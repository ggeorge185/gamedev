import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../ui/button';
import { ArrowLeft, Shuffle } from 'lucide-react';

const JumbledLettersGame = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const level = searchParams.get('level');
    const scenario = searchParams.get('scenario');

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-8">
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
                        <h1 className="text-3xl font-bold text-gray-800">Jumbled Letters</h1>
                        <p className="text-gray-600">Level: {level} • Scenario: {scenario}</p>
                    </div>
                </div>

                {/* Game Area */}
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="mb-8">
                        <Shuffle className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                            Unscramble the German Word!
                        </h2>
                        <p className="text-gray-600">
                            Rearrange the letters to form the correct German word
                        </p>
                    </div>

                    {/* Placeholder Game Interface */}
                    <div className="max-w-md mx-auto">
                        <div className="bg-purple-50 rounded-lg p-6 mb-6">
                            <h3 className="text-lg font-semibold text-purple-800 mb-4">
                                Game Coming Soon!
                            </h3>
                            <p className="text-purple-700 mb-4">
                                The jumbled letters game will help you practice German vocabulary 
                                by unscrambling mixed-up letters to form correct words.
                            </p>
                            <div className="text-2xl font-mono bg-white p-4 rounded border-2 border-dashed border-purple-300">
                                UHAS → HAUS
                            </div>
                            <p className="text-sm text-purple-600 mt-2">(House)</p>
                        </div>

                        <Button 
                            onClick={() => navigate('/game-selection')}
                            className="bg-purple-600 hover:bg-purple-700"
                        >
                            Try Another Game
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JumbledLettersGame;