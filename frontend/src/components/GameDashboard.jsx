import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { GamepadIcon, LogOut, User, Play, Lock, Trophy } from 'lucide-react';
import { setGameAuthUser, setScenarios, setGameTypes, setScenarioConfigs } from '@/redux/gameAuthSlice';
import axios from 'axios';
import { toast } from 'sonner';

const GameDashboard = () => {
  const { gameUser, scenarios, gameTypes, scenarioConfigs } = useSelector(store => store.gameAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load game data
    const loadGameData = async () => {
      try {
        const [scenariosRes, gameTypesRes, configsRes] = await Promise.all([
          axios.get('/api/v1/game/scenarios'),
          axios.get('/api/v1/game/game-types'),
          axios.get('/api/v1/game/scenario-configs')
        ]);

        if (scenariosRes.data.success) {
          dispatch(setScenarios(scenariosRes.data.scenarios));
        }
        if (gameTypesRes.data.success) {
          dispatch(setGameTypes(gameTypesRes.data.gameTypes));
        }
        if (configsRes.data.success) {
          dispatch(setScenarioConfigs(configsRes.data.configs));
        }
      } catch (error) {
        console.error('Error loading game data:', error);
        toast.error('Failed to load game data');
      } finally {
        setLoading(false);
      }
    };

    loadGameData();
  }, [dispatch]);

  const logoutHandler = async () => {
    try {
      const res = await axios.get('/api/v1/gameuser/logout', { withCredentials: true });
      if (res.data.success) {
        dispatch(setGameAuthUser(null));
        navigate("/game-login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Logout failed');
    }
  };

  const startStoryMode = () => {
    navigate('/game/story-mode');
  };

  const startGameSelection = () => {
    if (gameUser?.storyModeCompleted) {
      navigate('/game/game-selection');
    } else {
      toast.error('Complete Story Mode first to unlock Game Selection!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <GamepadIcon className="w-8 h-8 text-green-600" />
              <h1 className="text-2xl font-bold text-green-600">German Learning Game</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-700">
                <User className="w-5 h-5" />
                <span className="font-medium">{gameUser?.username}</span>
              </div>
              <Button
                onClick={logoutHandler}
                variant="outline"
                size="sm"
                className="text-gray-600 hover:text-gray-800"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Alex's German Adventure!
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Follow Alex's journey as they navigate life in Germany. Learn essential German vocabulary 
            and phrases through interactive games and real-life scenarios.
          </p>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Progress</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">Completed Scenarios</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {gameUser?.completedScenarios?.length || 0}
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Play className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-900">Story Mode</span>
              </div>
              <div className="text-lg font-semibold text-green-600">
                {gameUser?.storyModeCompleted ? 'Completed' : 'In Progress'}
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <GamepadIcon className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-purple-900">Total Scenarios</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {scenarios?.length || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Game Mode Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Story Mode */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
              <h3 className="text-2xl font-bold text-white mb-2">Story Mode</h3>
              <p className="text-blue-100">Follow Alex's journey through Germany</p>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Play className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">Available Now</span>
                </div>
                <p className="text-gray-600 text-sm">
                  Experience 5 real-life scenarios: Accommodation, City Registration, 
                  University, Banking, and Everyday Items.
                </p>
              </div>
              <Button
                onClick={startStoryMode}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Story Mode
              </Button>
            </div>
          </div>

          {/* Game Selection */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className={`p-6 ${gameUser?.storyModeCompleted 
              ? 'bg-gradient-to-r from-green-500 to-green-600' 
              : 'bg-gradient-to-r from-gray-400 to-gray-500'}`}>
              <h3 className="text-2xl font-bold text-white mb-2">Game Selection</h3>
              <p className="text-gray-100">
                {gameUser?.storyModeCompleted 
                  ? 'Choose your favorite games' 
                  : 'Complete Story Mode to unlock'}
              </p>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  {gameUser?.storyModeCompleted ? (
                    <>
                      <GamepadIcon className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-600">Unlocked</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 text-gray-400" />
                      <span className="font-medium text-gray-400">Locked</span>
                    </>
                  )}
                </div>
                <p className="text-gray-600 text-sm">
                  Play individual games: Taboo, Memory Game, Scrabble, and Quiz. 
                  Mix and match your learning experience.
                </p>
              </div>
              <Button
                onClick={startGameSelection}
                className={`w-full ${gameUser?.storyModeCompleted 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-gray-400 cursor-not-allowed'}`}
                size="lg"
                disabled={!gameUser?.storyModeCompleted}
              >
                {gameUser?.storyModeCompleted ? (
                  <>
                    <GamepadIcon className="w-5 h-5 mr-2" />
                    Start Game Selection
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5 mr-2" />
                    Complete Story Mode First
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDashboard;