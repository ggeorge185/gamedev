import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { ArrowLeft, GamepadIcon, Trophy, Clock, Target, Play } from 'lucide-react';
import AccommodationSwipeGame from './AccommodationSwipeGame';
import axios from 'axios';

const ScenarioGame = () => {
  const navigate = useNavigate();
  const { scenarioId } = useParams();
  const location = useLocation();
  const { difficulty } = location.state || { difficulty: 'A1' };
  const [scenario, setScenario] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScenario = async () => {
      try {
        const response = await axios.get('/api/v1/game/scenarios');
        if (response.data.success) {
          const foundScenario = response.data.scenarios.find(s => s._id === scenarioId);
          setScenario(foundScenario);
        }
      } catch (error) {
        console.error('Error fetching scenario:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchScenario();
  }, [scenarioId]);

  const goBack = () => {
    navigate('/game/story-mode');
  };

  const startGame = () => {
    setGameStarted(true);
  };

  const completeScenario = () => {
    // This would integrate with the actual game logic
    navigate('/game/story-mode', {
      state: { completed: { scenarioId, difficulty, score: 85 } }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Check if this is the first scenario (Accommodation)
  const isAccommodationScenario = scenario && scenario.name === 'Accommodation';

  if (isAccommodationScenario && !gameStarted) {
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
            <h1 className="text-3xl font-bold text-gray-900">Accommodation Hunt</h1>
          </div>

          {/* Start Page */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-8">
              <GamepadIcon className="w-24 h-24 text-blue-600 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to Germany, Alex!
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                You've just arrived in Germany and need to find accommodation. 
                In this game, you'll swipe through different housing options and learn to identify legitimate offers from potential scams.
              </p>
              <p className="text-md text-gray-600 mb-8">
                <strong>Difficulty:</strong> {difficulty} | 
                <strong> Scenario:</strong> {scenario?.description}
              </p>
            </div>

            <Button
              onClick={startGame}
              className="bg-blue-600 hover:bg-blue-700 text-xl px-8 py-4 rounded-lg flex items-center gap-3 mx-auto"
            >
              <Play className="w-6 h-6" />
              Start Your Housing Search
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isAccommodationScenario && gameStarted) {
    return <AccommodationSwipeGame scenarioId={scenarioId} difficulty={difficulty} onComplete={completeScenario} onBack={goBack} />;
  }

  // Default fallback for other scenarios
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
          <h1 className="text-3xl font-bold text-gray-900">Scenario Game</h1>
        </div>

        {/* Game Placeholder */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <GamepadIcon className="w-16 h-16 text-blue-600 mx-auto mb-6" />
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Game Implementation Placeholder
          </h2>
          
          <div className="mb-6 space-y-2">
            <p className="text-lg text-gray-700">
              <strong>Scenario ID:</strong> {scenarioId}
            </p>
            <p className="text-lg text-gray-700">
              <strong>Difficulty:</strong> {difficulty}
            </p>
            {scenario && (
              <p className="text-lg text-gray-700">
                <strong>Scenario:</strong> {scenario.name}
              </p>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              Game Implementation Notes
            </h3>
            <div className="text-left space-y-2 text-blue-800">
              <p>• This is where the actual game component would be rendered</p>
              <p>• The game type is determined by the scenario configuration</p>
              <p>• Game components would be: TabooGame, MemoryGame, ScrabbleGame, QuizGame</p>
              <p>• Each game would receive words/content based on scenario and difficulty</p>
              <p>• Game progress and scores would be tracked and saved to user profile</p>
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

          <div className="mt-6 p-4 bg-gray-50 rounded border text-sm text-gray-600">
            <p>
              <strong>For developers:</strong> Individual game components would be implemented here.
              Each game type (Taboo, Memory, Scrabble, Quiz) would have its own component
              that receives the scenario context, difficulty level, and word lists.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioGame;