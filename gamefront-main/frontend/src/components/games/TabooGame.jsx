import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../ui/button';
import { ArrowLeft, Target } from 'lucide-react';

const TabooGame = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const level = searchParams.get('level');
    const scenario = searchParams.get('scenario');

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 p-8">
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
                        <h1 className="text-3xl font-bold text-gray-800">Taboo Game</h1>
                        <p className="text-gray-600">Level: {level} • Scenario: {scenario}</p>
                    </div>
                </div>

                {/* Game Area */}
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="mb-8">
                        <Target className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                            Describe Without Using Forbidden Words!
                        </h2>
                        <p className="text-gray-600">
                            Describe the German word without using the taboo words
                        </p>
                    </div>

                    {/* Placeholder Game Interface */}
                    <div className="max-w-md mx-auto">
                        <div className="bg-red-50 rounded-lg p-6 mb-6">
                            <h3 className="text-lg font-semibold text-red-800 mb-4">
                                Game Coming Soon!
                            </h3>
                            <p className="text-red-700 mb-4">
                                The taboo game will challenge you to describe German words 
                                without using certain forbidden terms, improving your vocabulary range.
                            </p>
                            <div className="bg-white p-4 rounded border-2 border-dashed border-red-300">
                                <div className="font-bold text-lg mb-2">HAUS</div>
                                <div className="text-sm text-red-600 mb-2">Forbidden words:</div>
                                <div className="text-sm">Gebäude, Wohnung, Dach</div>
                            </div>
                        </div>

                        <Button 
                            onClick={() => navigate('/game-selection')}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Try Another Game
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TabooGame;