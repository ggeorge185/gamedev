import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../ui/button';
import { ArrowLeft, Brain } from 'lucide-react';

const QuizGame = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const level = searchParams.get('level');
    const scenario = searchParams.get('scenario');

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/game-selection')}
                        className="mr-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Game Selection
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Quiz Challenge</h1>
                        <p className="text-gray-600">Level: {level} • Scenario: {scenario}</p>
                    </div>
                </div>

                {/* Game Area */}
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="mb-8">
                        <Brain className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                            Test Your German Knowledge!
                        </h2>
                        <p className="text-gray-600">
                            Answer multiple choice questions about German vocabulary and grammar
                        </p>
                    </div>

                    {/* Placeholder Game Interface */}
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-blue-50 rounded-lg p-6 mb-6">
                            <h3 className="text-lg font-semibold text-blue-800 mb-4">
                                Game Coming Soon!
                            </h3>
                            <p className="text-blue-700 mb-4">
                                The quiz game will test your German knowledge with multiple choice 
                                questions tailored to your level and chosen scenario.
                            </p>
                            <div className="bg-white p-4 rounded border-2 border-dashed border-blue-300 text-left">
                                <div className="font-semibold mb-3">What does "Guten Tag" mean?</div>
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <div className="w-6 h-6 border-2 border-blue-300 rounded mr-3"></div>
                                        <span>Good night</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-6 h-6 bg-blue-500 rounded mr-3"></div>
                                        <span>Good day/Hello</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-6 h-6 border-2 border-blue-300 rounded mr-3"></div>
                                        <span>Good morning</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-6 h-6 border-2 border-blue-300 rounded mr-3"></div>
                                        <span>Goodbye</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Button 
                            onClick={() => navigate('/game-selection')}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            Try Another Game
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizGame;