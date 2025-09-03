import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { ArrowLeft, MapPin, Lock, CheckCircle } from 'lucide-react';

const StoryMode = () => {
    const { user } = useSelector((store) => store.auth);
    const navigate = useNavigate();

    const scenarios = [
        {
            id: 'accommodation',
            title: 'Finding Accommodation',
            description: 'Help Alex find the perfect place to live in Germany',
            icon: '🏠',
            position: { top: '20%', left: '30%' },
            unlocked: true // Always unlocked
        },
        {
            id: 'city_registration',
            title: 'City Registration',
            description: 'Navigate the German bureaucracy for city registration',
            icon: '🏛️',
            position: { top: '40%', left: '50%' },
            unlocked: user?.storyModeProgress?.unlockedScenarios?.includes('city_registration') || false
        },
        {
            id: 'university',
            title: 'University Life',
            description: 'Explore campus life and academic German',
            icon: '🎓',
            position: { top: '60%', left: '25%' },
            unlocked: user?.storyModeProgress?.unlockedScenarios?.includes('university') || false
        },
        {
            id: 'banking',
            title: 'Banking & Finance',
            description: 'Open a bank account and handle finances',
            icon: '🏦',
            position: { top: '70%', left: '60%' },
            unlocked: user?.storyModeProgress?.unlockedScenarios?.includes('banking') || false
        },
        {
            id: 'everyday_items',
            title: 'Everyday Shopping',
            description: 'Master daily shopping and German expressions',
            icon: '🛒',
            position: { top: '30%', left: '70%' },
            unlocked: user?.storyModeProgress?.unlockedScenarios?.includes('everyday_items') || false
        }
    ];

    const handleScenarioClick = (scenario) => {
        if (scenario.unlocked) {
            navigate(`/scenario/${scenario.id}`);
        }
    };

    const isScenarioCompleted = (scenarioId) => {
        return user?.completedScenarios?.some(cs => cs.scenario === scenarioId);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-8">
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
                        <h1 className="text-3xl font-bold text-gray-800">Alex's German Adventure</h1>
                        <p className="text-gray-600">Follow Alex's journey through Germany step by step</p>
                    </div>
                </div>

                {/* Story Introduction */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex items-center mb-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                            <span className="text-2xl">👨‍🎓</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Meet Alex</h2>
                            <p className="text-gray-600">A student who just moved to Germany for university</p>
                        </div>
                    </div>
                    <p className="text-gray-700">
                        Alex has just arrived in Germany to start his studies. He needs your help to navigate 
                        through various important situations he'll encounter. Complete each scenario to unlock 
                        the next part of his journey and improve your German skills along the way!
                    </p>
                </div>

                {/* Interactive Map */}
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                        Germany Adventure Map
                    </h2>
                    
                    <div className="relative bg-gradient-to-br from-green-100 to-blue-200 rounded-lg min-h-96 border-2 border-gray-200">
                        {/* Decorative map elements */}
                        <div className="absolute top-4 left-4 text-2xl">🌲</div>
                        <div className="absolute top-8 right-8 text-2xl">🏔️</div>
                        <div className="absolute bottom-4 left-8 text-2xl">🌊</div>
                        <div className="absolute bottom-8 right-4 text-2xl">🌳</div>
                        
                        {/* Scenario Points */}
                        {scenarios.map((scenario, index) => (
                            <div
                                key={scenario.id}
                                className={`absolute transform -translate-x-1/2 -translate-y-1/2 ${
                                    scenario.unlocked ? 'cursor-pointer' : 'cursor-not-allowed'
                                }`}
                                style={{
                                    top: scenario.position.top,
                                    left: scenario.position.left
                                }}
                                onClick={() => handleScenarioClick(scenario)}
                            >
                                <div
                                    className={`relative flex flex-col items-center p-4 rounded-lg transition-all duration-300 ${
                                        scenario.unlocked
                                            ? 'bg-white shadow-lg hover:shadow-xl hover:scale-105'
                                            : 'bg-gray-200 opacity-60'
                                    }`}
                                >
                                    {/* Status indicator */}
                                    <div className="absolute -top-2 -right-2">
                                        {isScenarioCompleted(scenario.id) ? (
                                            <CheckCircle className="w-6 h-6 text-green-500" />
                                        ) : scenario.unlocked ? (
                                            <MapPin className="w-6 h-6 text-blue-500" />
                                        ) : (
                                            <Lock className="w-6 h-6 text-gray-400" />
                                        )}
                                    </div>
                                    
                                    {/* Scenario icon */}
                                    <div className="text-3xl mb-2">{scenario.icon}</div>
                                    
                                    {/* Scenario info */}
                                    <div className="text-center min-w-32">
                                        <div className={`font-semibold text-sm ${
                                            scenario.unlocked ? 'text-gray-800' : 'text-gray-500'
                                        }`}>
                                            {scenario.title}
                                        </div>
                                        <div className={`text-xs mt-1 ${
                                            scenario.unlocked ? 'text-gray-600' : 'text-gray-400'
                                        }`}>
                                            {scenario.unlocked ? 'Click to play' : 'Locked'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {/* Connection lines between scenarios */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                            <defs>
                                <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                                        refX="10" refY="3.5" orient="auto">
                                    <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
                                </marker>
                            </defs>
                            
                            {/* Draw paths between unlocked scenarios */}
                            <path
                                d="M 30% 20% Q 40% 30% 50% 40%"
                                stroke="#94a3b8"
                                strokeWidth="2"
                                fill="none"
                                strokeDasharray="5,5"
                                markerEnd="url(#arrowhead)"
                            />
                            <path
                                d="M 50% 40% Q 37% 50% 25% 60%"
                                stroke="#94a3b8"
                                strokeWidth="2"
                                fill="none"
                                strokeDasharray="5,5"
                                markerEnd="url(#arrowhead)"
                            />
                        </svg>
                    </div>
                </div>

                {/* Progress Summary */}
                <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Progress</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="font-bold text-2xl text-blue-600">
                                {scenarios.filter(s => s.unlocked).length}/5
                            </div>
                            <div className="text-sm text-gray-600">Scenarios Unlocked</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="font-bold text-2xl text-green-600">
                                {scenarios.filter(s => isScenarioCompleted(s.id)).length}/5
                            </div>
                            <div className="text-sm text-gray-600">Scenarios Completed</div>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                            <div className="font-bold text-2xl text-yellow-600">
                                {user?.currentLevel || 'A1'}
                            </div>
                            <div className="text-sm text-gray-600">Current Level</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoryMode;