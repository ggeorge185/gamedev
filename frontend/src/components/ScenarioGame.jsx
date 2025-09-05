import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from './ui/button';
import { ArrowLeft, GamepadIcon, Trophy, Clock, Target } from 'lucide-react';
import { updateGameUserProgress } from '@/redux/gameAuthSlice';
import { toast } from 'sonner';
import AccommodationGame from './accommodation_game.jsx';
// Import new game components
import AnagramGameContainer from './games/anagram_game_container.jsx';
import MemoryGameContainer from './games/memory_game_container.jsx';
import TabooGameContainer from './games/taboo-game-container.jsx';
import QuizGameContainer from './games/quiz_game_container.jsx';
import ScrabbleGameContainer from './games/scrabble-game-container.jsx';
import axios from 'axios';

const ScenarioGame = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { scenarioId } = useParams();
  const location = useLocation();
  const { difficulty } = location.state || { difficulty: 'A1' };
  const { scenarios } = useSelector(store => store.gameAuth);
  const [scenario, setScenario] = useState(null);
  const [scenarioConfig, setScenarioConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find the scenario from the stored scenarios or fetch it
    const findScenario = async () => {
      let foundScenario = scenarios?.find(s => s._id === scenarioId);
      
      if (!foundScenario) {
        try {
          const res = await axios.get(`/api/v1/game/scenarios/${scenarioId}`);
          if (res.data.success) {
            foundScenario = res.data.scenario;
          }
        } catch (error) {
          console.error('Error fetching scenario:', error);
          toast.error('Failed to load scenario');
        }
      }
      
      setScenario(foundScenario);
      
      // Fetch scenario configuration to get assigned game type and instructions
      if (foundScenario) {
        try {
          const configRes = await axios.get('/api/v1/game/scenario-configs');
          if (configRes.data.success) {
            const config = configRes.data.configs.find(
              c => c.scenario._id === scenarioId && c.difficultyLevel === difficulty
            );
            setScenarioConfig(config);
          }
        } catch (error) {
          console.error('Error fetching scenario config:', error);
        }
      }
      
      setLoading(false);
    };

    findScenario();
  }, [scenarioId, scenarios, difficulty]);

  const goBack = () => {
    navigate('/game/story-mode');
  };

  const handleGameComplete = (score) => {
    // Update user progress with the score
    dispatch(updateGameUserProgress({
      scenarioId,
      difficultyLevel: difficulty,
      score
    }));
    
    toast.success(`Scenario completed! Score: ${score}`);
    
    // Navigate back to story mode after a short delay
    setTimeout(() => {
      navigate('/game/story-mode');
    }, 2000);
  };

  const completeScenario = () => {
    // Demo completion for scenarios without games
    handleGameComplete(85);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center">
        <div className="text-lg">Loading scenario...</div>
      </div>
    );
  }

  if (!scenario) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center">
        <div className="text-lg text-red-600">Scenario not found</div>
      </div>
    );
  }

  const renderGameContent = () => {
    // If we have a scenario configuration, use the assigned game type
    if (scenarioConfig && scenarioConfig.gameType) {
      const gameType = scenarioConfig.gameType;
      const instructions = scenarioConfig.instructions || '';
      
      // Map component names to actual components
      const gameComponents = {
        'AnagramGame': AnagramGameContainer,
        'MemoryGame': MemoryGameContainer,
        'TabooGame': TabooGameContainer,
        'QuizGame': QuizGameContainer,
        'ScrabbleGame': ScrabbleGameContainer
      };
      
      const GameComponent = gameComponents[gameType.componentName];
      
      if (GameComponent) {
        return (
          <GameComponent
            scenario={scenario}
            difficulty={difficulty}
            instructions={instructions}
            onGameComplete={handleGameComplete}
          />
        );
      }
    }
    
    // Fallback: Check if this is the "Accommodation" scenario with hardcoded game
    if (scenario.name === 'Accommodation') {
      return (
        <AccommodationGame
          difficulty={difficulty}
          onGameComplete={handleGameComplete}
        />
      );
    }

    // Placeholder for scenarios without configuration
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <GamepadIcon className="w-16 h-16 text-blue-600 mx-auto mb-6" />
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {scenario.name} - {difficulty}
        </h2>
        
        <div className="mb-6 space-y-2">
          <div className="mt-4 p-4 bg-blue-50 rounded border border-blue-200">
            <p className="text-blue-800 text-sm">
              {scenario.storyContext}
            </p>
          </div>
          
          {scenarioConfig?.instructions && (
            <div className="mt-4 p-4 bg-green-50 rounded border border-green-200">
              <p className="text-green-800 text-sm">
                <strong>Instructions:</strong> {scenarioConfig.instructions}
              </p>
            </div>
          )}
        </div>

        <div className="bg-yellow-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            No Game Configured
          </h3>
          <div className="text-left space-y-2 text-blue-800">
            <p>• This scenario doesn't have a game type assigned</p>
            <p>• Administrators can configure game types for each scenario/difficulty combination</p>
            <p>• Available games: Anagram, Memory, Taboo, Quiz, Scrabble</p>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Button
            onClick={goBack}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          
          <Button
            onClick={completeScenario}
            className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
          >
            <Trophy className="w-4 h-4" />
            Mark as Complete (Demo)
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={goBack}
            variant="outline"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Story Mode
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            {scenario.name} - {difficulty}
          </h1>
        </div>

        {/* Game Content */}
        {renderGameContent()}
      </div>
    </div>
  );
};

export default ScenarioGame;