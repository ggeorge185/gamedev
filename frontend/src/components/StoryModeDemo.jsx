import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { ArrowLeft, MapPin, Star, Lock, CheckCircle } from 'lucide-react';

// Mock data for demonstration
const mockScenarios = [
  {
    _id: '1',
    name: 'Finding Accommodation',
    description: 'Find suitable housing in Germany',
    order: 1,
    mapPosition: { x: 20, y: 30 },
    storyContext: 'Alex just arrived in Germany and needs to find a place to live. Help Alex navigate through housing options and rental processes.',
    availableLevels: ['A1', 'A2', 'B1', 'B2'],
    isRequired: true
  },
  {
    _id: '2',
    name: 'City Registration',
    description: 'Register with local authorities',
    order: 2,
    mapPosition: { x: 50, y: 20 },
    storyContext: 'Alex needs to register with the local authorities (Anmeldung) - a crucial step for living in Germany.',
    availableLevels: ['A1', 'A2', 'B1', 'B2'],
    isRequired: true
  },
  {
    _id: '3',
    name: 'University related',
    description: 'Enroll in university and navigate academic life',
    order: 3,
    mapPosition: { x: 80, y: 40 },
    storyContext: 'Alex wants to study in Germany and needs to understand the university system, enrollment processes, and academic vocabulary.',
    availableLevels: ['A2', 'B1', 'B2'],
    isRequired: true
  },
  {
    _id: '4',
    name: 'Banking',
    description: 'Open a bank account and manage finances',
    order: 4,
    mapPosition: { x: 30, y: 70 },
    storyContext: 'Alex needs to open a German bank account and learn about financial services and banking vocabulary.',
    availableLevels: ['A1', 'A2', 'B1', 'B2'],
    isRequired: true
  },
  {
    _id: '5',
    name: 'Medical Insurance',
    description: 'Get health insurance and understand medical system',
    order: 5,
    mapPosition: { x: 70, y: 80 },
    storyContext: 'Alex needs to get health insurance and learn about the German medical system and healthcare vocabulary.',
    availableLevels: ['A1', 'A2', 'B1', 'B2'],
    isRequired: true
  }
];

const mockGameUser = {
  username: 'Demo User',
  completedScenarios: [
    { scenarioId: '1', difficultyLevel: 'A1', score: 85, completedAt: new Date().toISOString() }
  ]
};

const StoryModeDemo = () => {
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('A1');
  const scenarios = mockScenarios;
  const gameUser = mockGameUser;

  const isScenarioCompleted = (scenarioId) => {
    return gameUser?.completedScenarios?.some(cs => cs.scenarioId === scenarioId);
  };

  const getScenarioCompletionCount = (scenarioId) => {
    return gameUser?.completedScenarios?.filter(cs => cs.scenarioId === scenarioId).length || 0;
  };

  const isScenarioUnlocked = (scenario) => {
    // First scenario (order 1) is always unlocked
    if (scenario.order === 1) {
      return true;
    }
    
    // Sort scenarios by order and check if previous scenario is completed
    const sortedScenarios = [...scenarios].sort((a, b) => a.order - b.order);
    const currentIndex = sortedScenarios.findIndex(s => s._id === scenario._id);
    
    if (currentIndex === 0) {
      return true; // First scenario is always unlocked
    }
    
    // Check if previous scenario is completed
    const previousScenario = sortedScenarios[currentIndex - 1];
    return isScenarioCompleted(previousScenario._id);
  };

  const handleScenarioClick = (scenario) => {
    // Only allow clicking if scenario is unlocked
    if (isScenarioUnlocked(scenario)) {
      setSelectedScenario(scenario);
      setSelectedDifficulty(scenario.availableLevels[0] || 'A1');
    }
  };

  const startScenario = () => {
    if (selectedScenario && selectedDifficulty && isScenarioUnlocked(selectedScenario)) {
      alert(`Starting ${selectedScenario.name} at difficulty ${selectedDifficulty}`);
    } else if (selectedScenario && !isScenarioUnlocked(selectedScenario)) {
      alert('Complete the previous scenario first to unlock this one!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
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
                  const isCompleted = isScenarioCompleted(scenario._id);
                  const isUnlocked = isScenarioUnlocked(scenario);
                  const completionCount = getScenarioCompletionCount(scenario._id);
                  
                  return (
                    <button
                      key={scenario._id}
                      onClick={() => handleScenarioClick(scenario)}
                      disabled={!isUnlocked}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
                        isUnlocked ? 'hover:scale-110 cursor-pointer' : 'cursor-not-allowed'
                      } ${
                        selectedScenario?._id === scenario._id ? 'z-20' : 'z-10'
                      }`}
                      style={{
                        left: `${scenario.mapPosition.x}%`,
                        top: `${scenario.mapPosition.y}%`,
                      }}
                    >
                      <div className="relative">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                          !isUnlocked
                            ? 'bg-gray-400 text-gray-600'
                            : isCompleted 
                            ? 'bg-green-500 text-white' 
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        } ${
                          selectedScenario?._id === scenario._id 
                            ? 'ring-4 ring-yellow-400' 
                            : ''
                        }`}>
                          {!isUnlocked ? (
                            <Lock className="w-6 h-6" />
                          ) : isCompleted ? (
                            <CheckCircle className="w-6 h-6" />
                          ) : (
                            <MapPin className="w-6 h-6" />
                          )}
                        </div>
                        
                        {/* Completion stars */}
                        {isUnlocked && completionCount > 0 && (
                          <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold text-yellow-900">
                            {completionCount}
                          </div>
                        )}
                        
                        {/* Scenario name */}
                        <div className={`absolute top-14 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded shadow text-xs font-medium whitespace-nowrap ${
                          !isUnlocked 
                            ? 'bg-gray-200 text-gray-500' 
                            : 'bg-white text-gray-800'
                        }`}>
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
                  <div className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center">
                    <Lock className="w-3 h-3 text-gray-600" />
                  </div>
                  <span>Locked</span>
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
                    {!isScenarioUnlocked(selectedScenario) ? (
                      <Lock className="w-5 h-5 text-gray-400" />
                    ) : isScenarioCompleted(selectedScenario._id) ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <MapPin className="w-5 h-5 text-blue-500" />
                    )}
                    <span className="font-medium">
                      {!isScenarioUnlocked(selectedScenario) 
                        ? 'Locked' 
                        : isScenarioCompleted(selectedScenario._id) 
                        ? 'Completed' 
                        : 'Available'}
                    </span>
                  </div>
                  {!isScenarioUnlocked(selectedScenario) && (
                    <div className="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                      Complete the previous scenario to unlock this one!
                    </div>
                  )}
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
                  disabled={!isScenarioUnlocked(selectedScenario)}
                  className={`w-full ${
                    isScenarioUnlocked(selectedScenario)
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                  size="lg"
                >
                  {isScenarioUnlocked(selectedScenario) ? 'Start Scenario' : 'Locked'}
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

export default StoryModeDemo;