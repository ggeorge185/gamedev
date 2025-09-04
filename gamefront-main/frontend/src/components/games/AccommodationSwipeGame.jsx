import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from '../ui/button';
import { ArrowLeft, Heart, X, Home, MapPin, Euro, AlertTriangle, CheckCircle } from 'lucide-react';
import axios from 'axios';

const AccommodationSwipeGame = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user } = useSelector((store) => store.auth);
    
    const level = searchParams.get('level') || 'A1';
    const scenario = searchParams.get('scenario') || 'accommodation';
    
    const [accommodations, setAccommodations] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [gameComplete, setGameComplete] = useState(false);
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState(null);
    const [correctChoices, setCorrectChoices] = useState(0);
    const [totalChoices, setTotalChoices] = useState(0);

    useEffect(() => {
        fetchAccommodationData();
    }, []);

    const fetchAccommodationData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/v1/game/accommodations', {
                withCredentials: true
            });
            
            if (response.data.success) {
                setAccommodations(response.data.accommodations);
            } else {
                console.error('Failed to fetch accommodations:', response.data.message);
                // Fallback to sample data if API fails
                setAccommodations(getSampleData());
            }
        } catch (error) {
            console.error('Error fetching accommodations:', error);
            // Fallback to sample data if API fails
            setAccommodations(getSampleData());
        } finally {
            setLoading(false);
        }
    };

    const getSampleData = () => {
        return [
            {
                _id: '1',
                title: 'Cozy Studio Apartment',
                location: 'Berlin Mitte',
                price: '800€/month',
                deposit: '1600€',
                image: '/api/placeholder/300/200',
                description: 'Beautiful studio in the heart of Berlin. Fully furnished with modern amenities.',
                isScam: false,
                redFlags: [],
                greenFlags: ['Central location', 'Reasonable deposit', 'Professional photos']
            },
            {
                _id: '2',
                title: 'Luxury Penthouse',
                location: 'Munich Center',
                price: '500€/month',
                deposit: '200€',
                image: '/api/placeholder/300/200',
                description: 'Amazing penthouse apartment for super cheap! Contact now!!!',
                isScam: true,
                redFlags: ['Price too good to be true', 'Multiple exclamation marks', 'Pressure to act fast'],
                greenFlags: []
            }
        ];
    };

    const currentAccommodation = accommodations[currentIndex];

    const handleSwipe = (isApprove) => {
        if (!currentAccommodation) return;

        const isCorrect = isApprove !== currentAccommodation.isScam;
        setTotalChoices(prev => prev + 1);
        
        if (isCorrect) {
            setCorrectChoices(prev => prev + 1);
            setScore(prev => prev + 10);
        }

        setFeedback({
            isCorrect,
            isApprove,
            accommodation: currentAccommodation
        });

        setTimeout(() => {
            setFeedback(null);
            if (currentIndex < accommodations.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else {
                setGameComplete(true);
            }
        }, 3000);
    };

    const goBack = () => {
        navigate('/story-mode');
    };

    const playAgain = () => {
        setCurrentIndex(0);
        setScore(0);
        setCorrectChoices(0);
        setTotalChoices(0);
        setGameComplete(false);
        setFeedback(null);
        fetchAccommodationData();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading accommodation options...</p>
                </div>
            </div>
        );
    }

    if (gameComplete) {
        const accuracy = totalChoices > 0 ? Math.round((correctChoices / totalChoices) * 100) : 0;
        
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
                <div className="max-w-md mx-auto">
                    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Game Complete!</h2>
                        <div className="space-y-2 mb-6">
                            <p className="text-lg text-gray-700">
                                <strong>Score:</strong> {score} points
                            </p>
                            <p className="text-lg text-gray-700">
                                <strong>Accuracy:</strong> {accuracy}% ({correctChoices}/{totalChoices})
                            </p>
                        </div>
                        <div className="space-y-3">
                            <Button onClick={playAgain} className="w-full bg-blue-600 hover:bg-blue-700">
                                Play Again
                            </Button>
                            <Button onClick={goBack} variant="outline" className="w-full">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Story Mode
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (feedback) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
                <div className="max-w-md mx-auto">
                    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                        <div className={`w-16 h-16 ${feedback.isCorrect ? 'bg-green-100' : 'bg-red-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                            {feedback.isCorrect ? (
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            ) : (
                                <X className="w-8 h-8 text-red-600" />
                            )}
                        </div>
                        <h3 className={`text-xl font-bold mb-4 ${feedback.isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                            {feedback.isCorrect ? 'Correct!' : 'Incorrect!'}
                        </h3>
                        <div className="text-left space-y-2 mb-4">
                            <p className="text-gray-700">
                                <strong>Your choice:</strong> {feedback.isApprove ? 'Approve' : 'Reject'}
                            </p>
                            <p className="text-gray-700">
                                <strong>This was:</strong> {feedback.accommodation.isScam ? 'A scam' : 'Legitimate'}
                            </p>
                        </div>
                        
                        {feedback.accommodation.isScam && feedback.accommodation.redFlags.length > 0 && (
                            <div className="bg-red-50 p-3 rounded-lg mb-4">
                                <h4 className="font-semibold text-red-800 mb-2">🚩 Red Flags:</h4>
                                <ul className="text-sm text-red-700 text-left">
                                    {feedback.accommodation.redFlags.map((flag, index) => (
                                        <li key={index}>• {flag}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        
                        {!feedback.accommodation.isScam && feedback.accommodation.greenFlags.length > 0 && (
                            <div className="bg-green-50 p-3 rounded-lg mb-4">
                                <h4 className="font-semibold text-green-800 mb-2">✅ Good Signs:</h4>
                                <ul className="text-sm text-green-700 text-left">
                                    {feedback.accommodation.greenFlags.map((flag, index) => (
                                        <li key={index}>• {flag}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (!currentAccommodation) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">No accommodations available</p>
                    <Button onClick={goBack} className="mt-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Story Mode
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-md mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <Button variant="ghost" onClick={goBack} size="sm">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-600">
                            {currentIndex + 1}/{accommodations.length}
                        </div>
                        <div className="text-sm font-semibold text-blue-600">
                            Score: {score}
                        </div>
                    </div>
                </div>

                {/* Game Instructions */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">
                        Help Alex Choose Wisely!
                    </h2>
                    <p className="text-sm text-gray-600">
                        Swipe ❤️ to approve good accommodations or ❌ to reject potential scams.
                        Look for red flags like unrealistic prices or suspicious descriptions.
                    </p>
                </div>

                {/* Accommodation Card */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
                    {/* Image placeholder */}
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                        <Home className="w-12 h-12 text-gray-400" />
                    </div>
                    
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            {currentAccommodation.title}
                        </h3>
                        
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center text-gray-600">
                                <MapPin className="w-4 h-4 mr-2" />
                                {currentAccommodation.location}
                            </div>
                            <div className="flex items-center text-gray-600">
                                <Euro className="w-4 h-4 mr-2" />
                                {currentAccommodation.price}
                            </div>
                            <div className="flex items-center text-gray-600">
                                <AlertTriangle className="w-4 h-4 mr-2" />
                                Deposit: {currentAccommodation.deposit}
                            </div>
                        </div>
                        
                        <p className="text-gray-700 text-sm mb-6">
                            {currentAccommodation.description}
                        </p>
                        
                        {/* Action Buttons */}
                        <div className="flex space-x-4">
                            <Button
                                onClick={() => handleSwipe(false)}
                                variant="outline"
                                className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
                                size="lg"
                            >
                                <X className="w-5 h-5 mr-2" />
                                Reject
                            </Button>
                            <Button
                                onClick={() => handleSwipe(true)}
                                className="flex-1 bg-green-500 hover:bg-green-600"
                                size="lg"
                            >
                                <Heart className="w-5 h-5 mr-2" />
                                Approve
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccommodationSwipeGame;