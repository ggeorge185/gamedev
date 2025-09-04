import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from './ui/button';
import { ArrowLeft, Play, Star } from 'lucide-react';
import axios from 'axios';

const CityRegistrationScenario = () => {
    const navigate = useNavigate();
    const { scenarioId } = useParams();
    const { user } = useSelector((store) => store.auth);
    const [availableGames, setAvailableGames] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAvailableGames();
    }, []);

    const fetchAvailableGames = async () => {
        try {
            const level = user?.currentLevel || 'A1';
            const response = await axios.get(
                `/api/v1/admin/games/${scenarioId}/${level}`,
                {
                    withCredentials: true
                }
            );
            
            if (response.data.success) {
                setAvailableGames(response.data.availableGames);
            }
        } catch (error) {
            console.error('Error fetching available games:', error);
            // Set default games as fallback
            setAvailableGames([
                { gameType: 'memory', isActive: true, maxScore: 100, timeLimit: 10 },
                { gameType: 'scrabble', isActive: true, maxScore: 100, timeLimit: 15 },
                { gameType: 'anagrams', isActive: true, maxScore: 100, timeLimit: 8 }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleGameStart = (gameType) => {
        const level = user?.currentLevel || 'A1';
        navigate(`/game/${gameType}?level=${level}&scenario=${scenarioId}`);
    };

    const getGameDisplayInfo = (gameType) => {
        const gameInfo = {
            memory: { name: 'Memory Game', icon: '🧠', color: 'bg-blue-500' },
            scrabble: { name: 'Scrabble Game', icon: '🔠', color: 'bg-green-500' },
            anagrams: { name: 'Anagrams', icon: '🔤', color: 'bg-purple-500' },
            quiz: { name: 'Quiz Challenge', icon: '❓', color: 'bg-yellow-500' },
            taboo: { name: 'Taboo Game', icon: '🚫', color: 'bg-red-500' },
            jumbled_letters: { name: 'Jumbled Letters', icon: '🔤', color: 'bg-indigo-500' }
        };
        return gameInfo[gameType] || { name: gameType, icon: '🎮', color: 'bg-gray-500' };
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/story-mode')}
                        className="mr-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Story Mode
                    </Button>
                    <div className="flex items-center">
                        <div className="text-4xl mr-4">🏛️</div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">City Registration</h1>
                            <p className="text-gray-600">Navigate the German bureaucracy for city registration</p>
                        </div>
                    </div>
                </div>

                {/* Scene placeholder */}
                <div className="bg-white rounded-lg shadow-md p-8 mb-8 text-center">
                    <div className="text-6xl mb-6">🎬</div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        Scene to be Added
                    </h2>
                    <p className="text-gray-600 mb-6">
                        The interactive scene for city registration is coming soon. For now, practice with the available mini-games!
                    </p>
                </div>

                {/* Available Games */}
                {loading ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <div className="text-2xl">Loading available games...</div>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">
                            Practice with Available Mini-Games
                        </h2>
                        {availableGames.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-600">No games available for this scenario and level.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {availableGames.map((game) => {
                                    const gameInfo = getGameDisplayInfo(game.gameType);
                                    return (
                                        <div
                                            key={game.gameType}
                                            className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-center mb-4">
                                                <div className={`w-12 h-12 ${gameInfo.color} rounded-lg flex items-center justify-center text-white text-xl mr-4`}>
                                                    {gameInfo.icon}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-800">{gameInfo.name}</h3>
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                                                        Max Score: {game.maxScore} | Time: {game.timeLimit}min
                                                    </div>
                                                </div>
                                            </div>
                                            <Button 
                                                className={`w-full ${gameInfo.color} hover:opacity-90 text-white`}
                                                onClick={() => handleGameStart(game.gameType)}
                                            >
                                                <Play className="w-4 h-4 mr-2" />
                                                Start Game
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CityRegistrationScenario;