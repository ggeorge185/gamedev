import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from './ui/button';
import { Trophy, Star, ArrowRight, Home } from 'lucide-react';

const GameResult = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    
    const scenario = searchParams.get('scenario') || '';
    const gameType = searchParams.get('gameType') || '';
    const score = parseInt(searchParams.get('score')) || 0;
    const unlockedScenario = searchParams.get('unlockedScenario');
    
    const scenarioNames = {
        'accommodation': 'Finding Accommodation',
        'city_registration': 'City Registration', 
        'university': 'University Life',
        'banking': 'Banking & Finance',
        'everyday_items': 'Everyday Shopping'
    };

    const gameNames = {
        'memory': 'Memory Game',
        'scrabble': 'Scrabble Game',
        'anagrams': 'Anagrams',
        'quiz': 'Quiz Challenge',
        'taboo': 'Taboo Game',
        'jumbled_letters': 'Jumbled Letters'
    };

    const getScoreGrade = (score) => {
        if (score >= 80) return { grade: 'Excellent!', color: 'text-green-600', emoji: '🌟' };
        if (score >= 60) return { grade: 'Good Job!', color: 'text-blue-600', emoji: '👍' };
        if (score >= 40) return { grade: 'Not Bad!', color: 'text-yellow-600', emoji: '👌' };
        return { grade: 'Keep Trying!', color: 'text-red-600', emoji: '💪' };
    };

    const scoreInfo = getScoreGrade(score);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center p-8">
            <div className="max-w-2xl w-full">
                {/* Main Result Card */}
                <div className="bg-white rounded-xl shadow-2xl p-8 text-center">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="text-6xl mb-4">{scoreInfo.emoji}</div>
                        <h1 className={`text-3xl font-bold mb-2 ${scoreInfo.color}`}>
                            {scoreInfo.grade}
                        </h1>
                        <p className="text-gray-600">
                            You completed <strong>{gameNames[gameType] || gameType}</strong> in{' '}
                            <strong>{scenarioNames[scenario] || scenario}</strong>
                        </p>
                    </div>

                    {/* Score Display */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
                        <div className="flex items-center justify-center mb-4">
                            <Trophy className="w-8 h-8 text-yellow-500 mr-3" />
                            <span className="text-2xl font-bold text-gray-800">Your Score</span>
                        </div>
                        <div className="text-5xl font-bold text-blue-600 mb-2">{score}</div>
                        <div className="flex justify-center">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-6 h-6 ${
                                        i < Math.floor(score / 20) 
                                            ? 'text-yellow-400 fill-current' 
                                            : 'text-gray-300'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Unlock Notification */}
                    {unlockedScenario && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                            <div className="flex items-center justify-center mb-2">
                                <div className="text-2xl mr-2">🎉</div>
                                <h3 className="font-semibold text-green-800">New Scenario Unlocked!</h3>
                            </div>
                            <p className="text-green-700">
                                You've unlocked <strong>{scenarioNames[unlockedScenario]}</strong>!
                                Continue Alex's journey and explore new challenges.
                            </p>
                        </div>
                    )}

                    {/* Progress Indicators */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-blue-50 rounded-lg p-4">
                            <div className="text-blue-600 font-semibold mb-1">German Skills</div>
                            <div className="text-2xl font-bold text-blue-800">
                                {score >= 80 ? 'Advanced' : score >= 60 ? 'Intermediate' : score >= 40 ? 'Beginner' : 'Learning'}
                            </div>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4">
                            <div className="text-purple-600 font-semibold mb-1">Experience</div>
                            <div className="text-2xl font-bold text-purple-800">+{Math.floor(score / 10)} XP</div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-4">
                        {unlockedScenario ? (
                            <Button
                                onClick={() => navigate(`/scenario/${unlockedScenario}`)}
                                className="w-full bg-green-500 hover:bg-green-600 text-lg py-3"
                            >
                                <ArrowRight className="w-5 h-5 mr-2" />
                                Continue to {scenarioNames[unlockedScenario]}
                            </Button>
                        ) : (
                            <Button
                                onClick={() => navigate(`/scenario/${scenario}`)}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-lg py-3"
                            >
                                <ArrowRight className="w-5 h-5 mr-2" />
                                Try Another Game
                            </Button>
                        )}

                        <div className="flex space-x-4">
                            <Button
                                onClick={() => navigate('/story-mode')}
                                variant="outline"
                                className="flex-1"
                            >
                                Story Mode
                            </Button>
                            <Button
                                onClick={() => navigate('/')}
                                variant="outline"
                                className="flex-1"
                            >
                                <Home className="w-4 h-4 mr-2" />
                                Dashboard
                            </Button>
                        </div>
                    </div>

                    {/* Tips */}
                    <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-gray-800 mb-2">💡 Tips for Improvement</h4>
                        <p className="text-sm text-gray-600">
                            {score >= 80 
                                ? "Outstanding! You're mastering German vocabulary. Try harder scenarios!"
                                : score >= 60 
                                ? "Good progress! Practice more to improve your vocabulary recognition."
                                : score >= 40
                                ? "Keep practicing! Try reviewing the vocabulary before playing again."
                                : "Don't give up! Learning a language takes time. Review the words and try again."
                            }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameResult;