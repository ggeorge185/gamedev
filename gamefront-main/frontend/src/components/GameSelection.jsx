import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { ArrowLeft, Star, Zap, Brain, Target } from 'lucide-react';

const GameSelection = () => {
    const { user } = useSelector((store) => store.auth);
    const navigate = useNavigate();
    const [selectedLevel, setSelectedLevel] = useState(user?.currentLevel || 'A1');
    const [selectedScenario, setSelectedScenario] = useState('');

    const levels = [
        { 
            id: 'A1', 
            name: 'A1 - Beginner', 
            description: 'Basic words and phrases',
            color: 'bg-green-100 text-green-800 border-green-300'
        },
        { 
            id: 'A2', 
            name: 'A2 - Elementary', 
            description: 'Simple conversations',
            color: 'bg-blue-100 text-blue-800 border-blue-300'
        },
        { 
            id: 'B1', 
            name: 'B1 - Intermediate', 
            description: 'Clear standard topics',
            color: 'bg-yellow-100 text-yellow-800 border-yellow-300'
        },
        { 
            id: 'B2', 
            name: 'B2 - Upper Intermediate', 
            description: 'Complex texts and abstract topics',
            color: 'bg-red-100 text-red-800 border-red-300'
        }
    ];

    const scenarios = [
        { id: 'accommodation', name: 'Finding Accommodation', icon: '🏠' },
        { id: 'city_registration', name: 'City Registration', icon: '🏛️' },
        { id: 'university', name: 'University Life', icon: '🎓' },
        { id: 'banking', name: 'Banking & Finance', icon: '🏦' },
        { id: 'everyday_items', name: 'Everyday Shopping', icon: '🛒' }
    ];

    const games = [
        {
            id: 'jumbled_letters',
            name: 'Jumbled Letters',
            description: 'Unscramble German words to form correct vocabulary',
            icon: <Zap className="w-8 h-8" />,
            color: 'bg-purple-500 hover:bg-purple-600',
            difficulty: 'Easy'
        },
        {
            id: 'taboo',
            name: 'Taboo',
            description: 'Describe words without using forbidden terms',
            icon: <Target className="w-8 h-8" />,
            color: 'bg-red-500 hover:bg-red-600',
            difficulty: 'Medium'
        },
        {
            id: 'quiz',
            name: 'Quiz Challenge',
            description: 'Answer multiple choice questions about German',
            icon: <Brain className="w-8 h-8" />,
            color: 'bg-blue-500 hover:bg-blue-600',
            difficulty: 'Medium'
        },
        {
            id: 'memory_game',
            name: 'Memory Game',
            description: 'Match German words with their meanings',
            icon: <Star className="w-8 h-8" />,
            color: 'bg-green-500 hover:bg-green-600',
            difficulty: 'Hard'
        }
    ];

    const handleGameStart = (gameId) => {
        if (!selectedScenario) {
            alert('Please select a scenario first!');
            return;
        }
        navigate(`/game/${gameId}?level=${selectedLevel}&scenario=${selectedScenario}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/')}
                        className="mr-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Free Play Mode</h1>
                        <p className="text-gray-600">Choose your level, scenario, and game type</p>
                    </div>
                </div>

                {/* Level Selection */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Step 1: Choose Your Level
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {levels.map((level) => (
                            <button
                                key={level.id}
                                onClick={() => setSelectedLevel(level.id)}
                                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                                    selectedLevel === level.id
                                        ? level.color + ' ring-2 ring-offset-2 ring-indigo-500'
                                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                                }`}
                            >
                                <div className="font-semibold">{level.name}</div>
                                <div className="text-sm mt-1">{level.description}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Scenario Selection */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Step 2: Choose a Scenario
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {scenarios.map((scenario) => (
                            <button
                                key={scenario.id}
                                onClick={() => setSelectedScenario(scenario.id)}
                                className={`p-4 rounded-lg border-2 transition-all duration-200 text-center ${
                                    selectedScenario === scenario.id
                                        ? 'bg-indigo-100 text-indigo-800 border-indigo-300 ring-2 ring-offset-2 ring-indigo-500'
                                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                                }`}
                            >
                                <div className="text-2xl mb-2">{scenario.icon}</div>
                                <div className="font-semibold text-sm">{scenario.name}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Game Selection */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">
                        Step 3: Choose Your Game
                    </h2>
                    
                    {!selectedScenario && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                            <p className="text-yellow-800">
                                Please select a scenario first to enable game selection.
                            </p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {games.map((game) => (
                            <div
                                key={game.id}
                                className={`bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 ${
                                    !selectedScenario ? 'opacity-50' : ''
                                }`}
                            >
                                <div className="flex items-center mb-4">
                                    <div className={`p-3 rounded-lg text-white mr-4 ${game.color.split(' ')[0]}`}>
                                        {game.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">{game.name}</h3>
                                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                            game.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                                            game.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {game.difficulty}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-gray-600 mb-4">{game.description}</p>
                                <Button
                                    onClick={() => handleGameStart(game.id)}
                                    disabled={!selectedScenario}
                                    className={`w-full ${game.color} text-white`}
                                    size="lg"
                                >
                                    Play {game.name}
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Selection Summary */}
                {selectedLevel && selectedScenario && (
                    <div className="mt-8 bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                        <h3 className="font-semibold text-indigo-800 mb-2">Your Selection:</h3>
                        <div className="text-indigo-700">
                            <span className="font-medium">Level:</span> {selectedLevel} • 
                            <span className="font-medium ml-2">Scenario:</span> {scenarios.find(s => s.id === selectedScenario)?.name}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GameSelection;