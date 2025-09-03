import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../ui/button';
import { ArrowLeft, Star } from 'lucide-react';

const MemoryGame = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const level = searchParams.get('level');
    const scenario = searchParams.get('scenario');

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-8">
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
                        <h1 className="text-3xl font-bold text-gray-800">Memory Game</h1>
                        <p className="text-gray-600">Level: {level} • Scenario: {scenario}</p>
                    </div>
                </div>

                {/* Game Area */}
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="mb-8">
                        <Star className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                            Match German Words with Meanings!
                        </h2>
                        <p className="text-gray-600">
                            Flip cards to match German words with their English translations
                        </p>
                    </div>

                    {/* Placeholder Game Interface */}
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-green-50 rounded-lg p-6 mb-6">
                            <h3 className="text-lg font-semibold text-green-800 mb-4">
                                Game Coming Soon!
                            </h3>
                            <p className="text-green-700 mb-4">
                                The memory game will help you memorize German vocabulary by 
                                matching words with their meanings or translations.
                            </p>
                            <div className="grid grid-cols-4 gap-3 max-w-lg mx-auto">
                                {[...Array(8)].map((_, i) => (
                                    <div 
                                        key={i}
                                        className="aspect-square bg-white border-2 border-dashed border-green-300 rounded-lg flex items-center justify-center"
                                    >
                                        {i === 0 && <span className="text-lg">HAUS</span>}
                                        {i === 1 && <span className="text-lg">House</span>}
                                        {i === 2 && <span className="text-lg">?</span>}
                                        {i === 3 && <span className="text-lg">?</span>}
                                        {i === 4 && <span className="text-lg">?</span>}
                                        {i === 5 && <span className="text-lg">?</span>}
                                        {i === 6 && <span className="text-lg">?</span>}
                                        {i === 7 && <span className="text-lg">?</span>}
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-green-600 mt-3">Match the pairs!</p>
                        </div>

                        <Button 
                            onClick={() => navigate('/game-selection')}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            Try Another Game
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemoryGame;