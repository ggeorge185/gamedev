import React from 'react';
import { useSelector } from 'react-redux';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Gamepad2, Trophy, MapPin } from 'lucide-react';

const GameDashboard = () => {
    const { user } = useSelector((store) => store.auth);
    const navigate = useNavigate();

    const handleStoryMode = () => {
        navigate('/story-mode');
    };

    const handleGameMode = () => {
        navigate('/game-selection');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        Welcome to German Adventure, {user?.username}!
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        Join Alex on his journey through Germany and master the German language
                    </p>
                    
                    {/* User Progress Summary */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center">
                                <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                                <div className="font-semibold text-gray-800">Current Level</div>
                                <div className="text-blue-600 font-bold">{user?.currentLevel || 'A1'}</div>
                            </div>
                            <div className="text-center">
                                <Gamepad2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                <div className="font-semibold text-gray-800">Total Score</div>
                                <div className="text-blue-600 font-bold">{user?.totalScore || 0}</div>
                            </div>
                            <div className="text-center">
                                <MapPin className="w-8 h-8 text-red-500 mx-auto mb-2" />
                                <div className="font-semibold text-gray-800">Completed Scenarios</div>
                                <div className="text-blue-600 font-bold">{user?.completedScenarios?.length || 0}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Start Game Button */}
                <div className="text-center mb-12">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Ready to start your adventure?</h2>
                    <Button 
                        size="lg" 
                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-xl rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                        onClick={() => {
                            // Show game mode options
                            document.getElementById('game-options').classList.remove('hidden');
                        }}
                    >
                        Start Learning German!
                    </Button>
                </div>

                {/* Game Mode Options */}
                <div id="game-options" className="hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Story Mode */}
                        <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300">
                            <BookOpen className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Story Mode</h3>
                            <p className="text-gray-600 mb-6">
                                Follow Alex's journey through Germany. Complete scenarios step by step as you help Alex navigate life in his new country.
                            </p>
                            <div className="mb-6">
                                <h4 className="font-semibold text-gray-700 mb-2">5 Exciting Scenarios:</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>🏠 Finding Accommodation</li>
                                    <li>🏛️ City Registration</li>
                                    <li>🎓 University Life</li>
                                    <li>🏦 Banking & Finance</li>
                                    <li>🛒 Everyday Shopping</li>
                                </ul>
                            </div>
                            <Button 
                                onClick={handleStoryMode}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                size="lg"
                            >
                                Start Alex's Story
                            </Button>
                        </div>

                        {/* Game Selection Mode */}
                        <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300">
                            <Gamepad2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Free Play</h3>
                            <p className="text-gray-600 mb-6">
                                Choose your own adventure! Select any scenario and difficulty level to practice specific skills.
                            </p>
                            <div className="mb-6">
                                <h4 className="font-semibold text-gray-700 mb-2">4 Different Games:</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>🔤 Jumbled Letters</li>
                                    <li>🎯 Taboo</li>
                                    <li>❓ Quiz Challenge</li>
                                    <li>🧠 Memory Game</li>
                                </ul>
                            </div>
                            <Button 
                                onClick={handleGameMode}
                                className="w-full bg-green-600 hover:bg-green-700 text-white"
                                size="lg"
                            >
                                Choose Your Game
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameDashboard;