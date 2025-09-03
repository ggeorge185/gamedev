import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { ArrowLeft, GamepadIcon, Trophy, Clock, Target } from 'lucide-react';

const ScenarioGame = () => {
  const navigate = useNavigate();
  const { scenarioId } = useParams();
  const location = useLocation();
  const { difficulty } = location.state || { difficulty: 'A1' };

  const goBack = () => {
    navigate('/game/story-mode');
  };

  const completeScenario = () => {
    // This would integrate with the actual game logic
    navigate('/game/story-mode', {
      state: { completed: { scenarioId, difficulty, score: 85 } }
    });
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