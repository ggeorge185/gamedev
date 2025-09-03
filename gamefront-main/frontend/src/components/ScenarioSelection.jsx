import React from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from './ui/button';
import { ArrowLeft, Play, Star } from 'lucide-react';

const ScenarioSelection = () => {
    const navigate = useNavigate();
    const { scenarioId } = useParams();
    const [searchParams] = useSearchParams();
    const { user } = useSelector((store) => store.auth);
    
    const scenarios = {
        accommodation: {
            title: 'Finding Accommodation',
            description: 'Help Alex find the perfect place to live in Germany',
            icon: '🏠',
            story: 'Alex has just arrived in Germany and needs to find a place to stay. Help him navigate rental websites, understand housing terms, and communicate with landlords.',
            vocabulary: ['Miete', 'Kaution', 'Wohnung', 'Zimmer', 'Nebenkosten']
        },
        city_registration: {
            title: 'City Registration',
            description: 'Navigate the German bureaucracy for city registration',
            icon: '🏛️',
            story: 'One of the first things Alex must do is register his address with the local authorities. Learn the necessary German terms and procedures.',
            vocabulary: ['Anmeldung', 'Bürgeramt', 'Meldebestätigung', 'Ausweis', 'Formular']
        },
        university: {
            title: 'University Life',
            description: 'Explore campus life and academic German',
            icon: '🎓',
            story: 'Alex is starting his studies at a German university. Help him understand academic terms, navigate the campus, and communicate with professors.',
            vocabulary: ['Vorlesung', 'Seminar', 'Professor', 'Studium', 'Prüfung']
        },
        banking: {
            title: 'Banking & Finance',
            description: 'Open a bank account and handle finances',
            icon: '🏦',
            story: 'Alex needs to open a German bank account to manage his finances. Learn banking vocabulary and financial terms.',
            vocabulary: ['Konto', 'Überweisung', 'Girocard', 'Zinsen', 'Beratung']
        },
        everyday_items: {
            title: 'Everyday Shopping',
            description: 'Master daily shopping and German expressions',
            icon: '🛒',
            story: 'Alex needs to do his daily shopping. Help him learn the names of everyday items and common shopping phrases.',
            vocabulary: ['Einkaufen', 'Supermarkt', 'Rechnung', 'Angebot', 'Kasse']
        }
    };

    const games = [
        { id: 'jumbled_letters', name: 'Jumbled Letters', icon: '🔤', color: 'bg-purple-500' },
        { id: 'taboo', name: 'Taboo', icon: '🎯', color: 'bg-red-500' },
        { id: 'quiz', name: 'Quiz Challenge', icon: '❓', color: 'bg-blue-500' },
        { id: 'memory_game', name: 'Memory Game', icon: '🧠', color: 'bg-green-500' }
    ];

    const scenario = scenarios[scenarioId];
    
    if (!scenario) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Scenario Not Found</h1>
                    <Button onClick={() => navigate('/')}>Back to Dashboard</Button>
                </div>
            </div>
        );
    }

    const handleGameStart = (gameId) => {
        const level = user?.currentLevel || 'A1';
        navigate(`/game/${gameId}?level=${level}&scenario=${scenarioId}`);
    };

    const isScenarioUnlocked = () => {
        return user?.storyModeProgress?.unlockedScenarios?.includes(scenarioId) || scenarioId === 'accommodation';
    };

    if (!isScenarioUnlocked()) {
        return (
            <div className="min-h-screen bg-gray-100 p-8">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="bg-white rounded-lg shadow-md p-8">
                        <div className="text-6xl mb-4">🔒</div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Scenario Locked</h1>
                        <p className="text-gray-600 mb-6">
                            Complete previous scenarios in story mode to unlock this scenario.
                        </p>
                        <Button onClick={() => navigate('/story-mode')}>
                            Back to Story Mode
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

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
                        <div className="text-4xl mr-4">{scenario.icon}</div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">{scenario.title}</h1>
                            <p className="text-gray-600">{scenario.description}</p>
                        </div>
                    </div>
                </div>

                {/* Scenario Story */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Alex's Story</h2>
                    <p className="text-gray-700 mb-6">{scenario.story}</p>
                    
                    <div className="bg-indigo-50 rounded-lg p-4">
                        <h3 className="font-semibold text-indigo-800 mb-2">Key Vocabulary for this scenario:</h3>
                        <div className="flex flex-wrap gap-2">
                            {scenario.vocabulary.map((word, index) => (
                                <span 
                                    key={index}
                                    className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium"
                                >
                                    {word}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Game Selection */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">
                        Choose a Game to Practice
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {games.map((game) => (
                            <div
                                key={game.id}
                                className="border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => handleGameStart(game.id)}
                            >
                                <div className="flex items-center mb-4">
                                    <div className={`w-12 h-12 ${game.color} rounded-lg flex items-center justify-center text-white text-xl mr-4`}>
                                        {game.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{game.name}</h3>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Star className="w-4 h-4 text-yellow-500 mr-1" />
                                            Level: {user?.currentLevel || 'A1'}
                                        </div>
                                    </div>
                                </div>
                                <Button 
                                    className={`w-full ${game.color} hover:opacity-90 text-white`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleGameStart(game.id);
                                    }}
                                >
                                    <Play className="w-4 h-4 mr-2" />
                                    Play {game.name}
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Progress Indicator */}
                <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Your Progress in this Scenario</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {games.map((game) => {
                            const completed = user?.completedScenarios?.some(cs => 
                                cs.scenario === scenarioId && 
                                cs.completedGames?.some(cg => cg.gameType === game.id)
                            );
                            return (
                                <div key={game.id} className="text-center">
                                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-2 ${
                                        completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                                    }`}>
                                        {completed ? '✓' : game.icon}
                                    </div>
                                    <div className={`text-sm ${completed ? 'text-green-600' : 'text-gray-500'}`}>
                                        {game.name}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScenarioSelection;