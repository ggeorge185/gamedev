import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { ArrowLeft, GamepadIcon, Trophy, Clock, Target } from 'lucide-react';
import { setGameTypes } from '@/redux/gameAuthSlice';
import axios from 'axios';
import { toast } from 'sonner';

const GameSelection = () => {
  const { gameUser, gameTypes } = useSelector(store => store.gameAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedGameType, setSelectedGameType] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('A1');

  useEffect(() => {
    // Load game types if not already loaded
    if (!gameTypes || gameTypes.length === 0) {
      const loadGameTypes = async () => {
        try {
          const res = await axios.get('/api/v1/game/game-types');
          if (res.data.success) {
            dispatch(setGameTypes(res.data.gameTypes));
          }
        } catch (error) {
          console.error('Error loading game types:', error);
          toast.error('Failed to load game types');
        }
      };
      loadGameTypes();
    }
  }, [dispatch, gameTypes]);

  const goBack = () => {
    navigate('/game');
  };

  const startGame = () => {
    if (selectedGameType && selectedDifficulty) {
      // Navigate to individual game component
      navigate(`/game/play/${selectedGameType.componentName.toLowerCase()}`, {
        state: { 
          gameType: selectedGameType,
          difficulty: selectedDifficulty 
        }
      });
    }
  };

  const difficultyLevels = [
    { level: 'A1', name: 'Beginner', description: 'Basic vocabulary and simple phrases' },
    { level: 'A2', name: 'Elementary', description: 'Common words and expressions' },
    { level: 'B1', name: 'Intermediate', description: 'Complex topics and situations' },
    { level: 'B2', name: 'Upper-Intermediate', description: 'Advanced vocabulary and concepts' }
  ];

  const gameTypeIcons = {
    'Taboo': Target,
    'Memory Game': GamepadIcon,
    'Scrabble': Trophy,
    'Quiz': Clock
  };

  const gameTypeColors = {
    'Taboo': 'from-red-500 to-red-600',
    'Memory Game': 'from-purple-500 to-purple-600',
    'Scrabble': 'from-yellow-500 to-yellow-600',
    'Quiz': 'from-green-500 to-green-600'
  };

  if (!gameUser?.storyModeCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            Complete Story Mode first to unlock Game Selection!
          </p>
          <Button onClick={goBack} className="bg-blue-600 hover:bg-blue-700">
            Go Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (!gameTypes || gameTypes.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center">
        <div className="text-lg">Loading games...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={goBack}
            variant="outline"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Game Selection</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Game Types */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Choose Your Game</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {gameTypes.map((gameType) => {
                  const IconComponent = gameTypeIcons[gameType.name] || GamepadIcon;
                  const colorClass = gameTypeColors[gameType.name] || 'from-blue-500 to-blue-600';
                  
                  return (
                    <button
                      key={gameType._id}
                      onClick={() => setSelectedGameType(gameType)}
                      className={`p-6 rounded-lg border-2 transition-all duration-200 ${
                        selectedGameType?._id === gameType._id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                      }`}
                    >
                      <div className={`w-16 h-16 bg-gradient-to-r ${colorClass} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {gameType.name}
                      </h3>
                      
                      <p className="text-gray-600 text-sm">
                        {gameType.description}
                      </p>
                      
                      {/* Game configuration preview */}
                      {gameType.configOptions && Object.keys(gameType.configOptions).length > 0 && (
                        <div className="mt-3 text-xs text-gray-500">
                          {Object.entries(gameType.configOptions).slice(0, 2).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                              <span>{value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {gameTypes.length === 0 && (
                <div className="text-center py-12">
                  <GamepadIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Games Available</h3>
                  <p className="text-gray-600">
                    Games are being configured by administrators. Check back soon!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Game Settings */}
          <div className="lg:col-span-1">
            {selectedGameType ? (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {selectedGameType.name}
                </h3>
                
                <div className="mb-6">
                  <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded">
                    {selectedGameType.description}
                  </p>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Choose Difficulty Level</h4>
                  <div className="space-y-2">
                    {difficultyLevels.map((level) => (
                      <button
                        key={level.level}
                        onClick={() => setSelectedDifficulty(level.level)}
                        className={`w-full p-3 text-left rounded border ${
                          selectedDifficulty === level.level
                            ? 'bg-blue-100 border-blue-500 text-blue-700'
                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div className="font-medium">{level.level} - {level.name}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {level.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Game Configuration Display */}
                {selectedGameType.configOptions && Object.keys(selectedGameType.configOptions).length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Game Settings</h4>
                    <div className="bg-gray-50 p-3 rounded space-y-2">
                      {Object.entries(selectedGameType.configOptions).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-gray-600 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}:
                          </span>
                          <span className="text-gray-900 font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  onClick={startGame}
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  <GamepadIcon className="w-5 h-5 mr-2" />
                  Start Game
                </Button>

                {/* User stats for this game type */}
                <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                  <div className="text-sm text-blue-800">
                    <strong>Your Stats:</strong> You can track your performance here once you play!
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <GamepadIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a Game
                </h3>
                <p className="text-gray-600 text-sm">
                  Choose any game type to see its details and start playing. 
                  Mix and match your learning experience!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameSelection;