import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { ArrowLeft, MapPin, Star, Lock, CheckCircle } from 'lucide-react';
import { setScenarios } from '@/redux/gameAuthSlice';
import axios from 'axios';
import { toast } from 'sonner';

const StoryMode = () => {
  const { gameUser, scenarios } = useSelector(store => store.gameAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('A1');

  useEffect(() => {
    // Load scenarios if not already loaded
    if (!scenarios || scenarios.length === 0) {
      const loadScenarios = async () => {
        try {
          const res = await axios.get('/api/v1/game/scenarios');
          if (res.data.success) {
            dispatch(setScenarios(res.data.scenarios));
          }
        } catch (error) {
          console.error('Error loading scenarios:', error);
          toast.error('Failed to load scenarios');
        }
      };
      loadScenarios();
    }
  }, [dispatch, scenarios]);

  const isScenarioCompleted = (scenarioId) => {
    return gameUser?.completedScenarios?.some(cs => cs.scenarioId === scenarioId);
  };

  const getScenarioCompletionCount = (scenarioId) => {
    return gameUser?.completedScenarios?.filter(cs => cs.scenarioId === scenarioId).length || 0;
  };

  const handleScenarioClick = (scenario) => {
    setSelectedScenario(scenario);
    setSelectedDifficulty(scenario.availableLevels[0] || 'A1');
  };

  const startScenario = () => {
    if (selectedScenario && selectedDifficulty) {
      navigate(`/game/scenario/${selectedScenario._id}`, {
        state: { difficulty: selectedDifficulty }
      });
    }
  };

  const goBack = () => {
    navigate('/game');
  };

  if (!scenarios || scenarios.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center">
        <div className="text-lg">Loading scenarios...</div>
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
          <h1 className="text-3xl font-bold text-gray-900">Alex's German Adventure - Story Mode</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Germany Map</h2>
              <div className="relative bg-gradient-to-b from-blue-100 to-green-100 rounded-lg h-96 overflow-hidden">
                {/* Map Background */}
                <div className="absolute inset-0 opacity-20">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    {/* Simple Germany outline */}
                    <path
                      d="M20,20 L80,20 L85,30 L80,50 L75,80 L25,85 L15,70 L20,20 Z"
                      fill="currentColor"
                      className="text-gray-400"
                    />
                  </svg>
                </div>

                {/* Scenario Markers */}
                {scenarios.map((scenario) => {
                  // Defensive: skip if no mapPosition or missing x/y
                  if (
                    !scenario.mapPosition ||
                    typeof scenario.mapPosition.x !== "number" ||
                    typeof scenario.mapPosition.y !== "number"
                  ) {
                    return null;
                  }
                  const isCompleted = isScenarioCompleted(scenario._id);
                  const completionCount = getScenarioCompletionCount(scenario._id);
                  
                  return (
                    <button
                      key={scenario._id}
                      onClick={() => handleScenarioClick(scenario)}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110 ${
                        selectedScenario?._id === scenario._id ? 'z-20' : 'z-10'
                      }`}
                      style={{
                        left: `${scenario.mapPosition?.x ?? 50}%`,
                        top: `${scenario.mapPosition?.y ?? 50}%`,
                      }}
                    >
                      <div className="relative">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                          isCompleted 
                            ? 'bg-green-500 text-white' 
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        } ${
                          selectedScenario?._id === scenario._id 
                            ? 'ring-4 ring-yellow-400' 
                            : ''
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="w-6 h-6" />
                          ) : (
                            <MapPin className="w-6 h-6" />
                          )}
                        </div>
                        
                        {/* Completion stars */}
                        {completionCount > 0 && (
                          <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold text-yellow-900">
                            {completionCount}
                          </div>
                        )}
                        
                        {/* Scenario name */}
                        <div className="absolute top-14 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-xs font-medium text-gray-800 whitespace-nowrap">
                          {scenario.name}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Map Legend */}
              <div className="mt-4 flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span>Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-xs">
                    <Star className="w-3 h-3 text-yellow-900" />
                  </div>
                  <span>Number shows completion count</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scenario Details */}
          <div className="lg:col-span-1">
            {selectedScenario ? (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {selectedScenario.name}
                </h3>
                
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    {isScenarioCompleted(selectedScenario._id) ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <MapPin className="w-5 h-5 text-blue-500" />
                    )}
                    <span className="font-medium">
                      {isScenarioCompleted(selectedScenario._id) ? 'Completed' : 'Available'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {selectedScenario.description}
                  </p>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">Story Context</h4>
                  <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded">
                    {selectedScenario.storyContext}
                  </p>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Choose Difficulty Level</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedScenario.availableLevels.map((level) => (
                      <button
                        key={level}
                        onClick={() => setSelectedDifficulty(level)}
                        className={`p-3 text-center rounded border ${
                          selectedDifficulty === level
                            ? 'bg-blue-100 border-blue-500 text-blue-700'
                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div className="font-medium">{level}</div>
                        <div className="text-xs text-gray-500">
                          {level === 'A1' && 'Beginner'}
                          {level === 'A2' && 'Elementary'}
                          {level === 'B1' && 'Intermediate'}
                          {level === 'B2' && 'Upper-Int'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={startScenario}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  Start Scenario
                </Button>

                {/* Completion Stats */}
                {getScenarioCompletionCount(selectedScenario._id) > 0 && (
                  <div className="mt-4 p-3 bg-green-50 rounded border border-green-200">
                    <div className="text-sm text-green-800">
                      <strong>Your Progress:</strong> Completed {getScenarioCompletionCount(selectedScenario._id)} time(s)
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a Scenario
                </h3>
                <p className="text-gray-600 text-sm">
                  Click on any marker on the map to learn more about that scenario 
                  and start your German learning adventure!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryMode;
