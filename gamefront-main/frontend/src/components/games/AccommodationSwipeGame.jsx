import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../ui/button';
import { ArrowLeft, Heart, X, Home, MapPin, Euro, AlertTriangle, CheckCircle } from 'lucide-react';
import axios from 'axios';

const AccommodationSwipeGame = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const scenarioId = searchParams.get('scenario') || 'accommodation';
    
    const [accommodations, setAccommodations] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [score, setScore] = useState(0);
    const [swipedRight, setSwipedRight] = useState([]);
    const [swipedLeft, setSwipedLeft] = useState([]);
    const [gameComplete, setGameComplete] = useState(false);
    const [feedback, setFeedback] = useState('');

    // Fetch accommodation data from minigames API
    useEffect(() => {
        const fetchAccommodations = async () => {
            try {
                // Using the same API URL as MiniGameTable component
                const response = await axios.get('https://gamedev-2jld.onrender.com/api/minigames');
                if (response.data && response.data.length > 0) {
                    setAccommodations(response.data);
                } else {
                    // Fallback default data if no data in DB
                    setAccommodations(defaultAccommodations);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching accommodations:', error);
                // Use fallback data on error
                setAccommodations(defaultAccommodations);
                setLoading(false);
            }
        };

        fetchAccommodations();
    }, []);

    // Default accommodations as fallback
    const defaultAccommodations = [
        {
            title: "Cozy Studio in City Center",
            location: "Munich, Bayern",
            price: "800€",
            deposit: "1600€",
            image: "https://via.placeholder.com/400x300",
            description: "Beautiful studio apartment with modern amenities",
            isScam: false,
            redFlags: [],
            greenFlags: ["Good location", "Fair price", "Professional photos"]
        },
        {
            title: "Luxury Apartment - Too Good to be True!",
            location: "Berlin, Germany",
            price: "300€",
            deposit: "0€",
            image: "https://via.placeholder.com/400x300",
            description: "Amazing luxury apartment at unbelievable price! Contact immediately!",
            isScam: true,
            redFlags: ["Price too low", "No deposit required", "Urgency tactics"],
            greenFlags: []
        }
    ];

    const currentAccommodation = accommodations[currentIndex];

    const handleSwipe = (direction) => {
        if (!currentAccommodation) return;

        let points = 0;
        let feedbackMessage = '';

        if (direction === 'right') {
            // Swiped right (interested)
            setSwipedRight([...swipedRight, currentAccommodation]);
            if (!currentAccommodation.isScam) {
                points = 10;
                feedbackMessage = '✅ Good choice! This is a legitimate accommodation.';
            } else {
                points = -5;
                feedbackMessage = '❌ Be careful! This was likely a scam. Watch for red flags.';
            }
        } else {
            // Swiped left (not interested)
            setSwipedLeft([...swipedLeft, currentAccommodation]);
            if (currentAccommodation.isScam) {
                points = 10;
                feedbackMessage = '✅ Smart move! You avoided a potential scam.';
            } else {
                points = -2;
                feedbackMessage = '⚠️ This was actually a good option, but being cautious is wise.';
            }
        }

        setScore(score + points);
        setFeedback(feedbackMessage);

        // Move to next accommodation or complete game
        if (currentIndex < accommodations.length - 1) {
            setTimeout(() => {
                setCurrentIndex(currentIndex + 1);
                setFeedback('');
            }, 2000);
        } else {
            setTimeout(() => {
                setGameComplete(true);
            }, 2000);
        }
    };

    const restartGame = () => {
        setCurrentIndex(0);
        setScore(0);
        setSwipedRight([]);
        setSwipedLeft([]);
        setGameComplete(false);
        setFeedback('');
    };

    const goBack = () => {
        navigate(`/scenario/${scenarioId}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-xl text-gray-600">Loading accommodations...</p>
                </div>
            </div>
        );
    }

    if (gameComplete) {
        const totalAccommodations = accommodations.length;
        const percentage = Math.round((score / (totalAccommodations * 10)) * 100);
        
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                        <div className="text-6xl mb-4">🎉</div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">Game Complete!</h1>
                        
                        <div className="mb-6">
                            <div className="text-4xl font-bold text-blue-600 mb-2">{score} Points</div>
                            <div className="text-lg text-gray-600">
                                You correctly identified {percentage}% of accommodations
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-green-50 rounded-lg p-4">
                                <h3 className="font-semibold text-green-800 mb-2">
                                    ✅ Good Choices ({swipedRight.filter(acc => !acc.isScam).length})
                                </h3>
                                <p className="text-green-600 text-sm">Legitimate accommodations you showed interest in</p>
                            </div>
                            <div className="bg-red-50 rounded-lg p-4">
                                <h3 className="font-semibold text-red-800 mb-2">
                                    🚫 Scams Avoided ({swipedLeft.filter(acc => acc.isScam).length})
                                </h3>
                                <p className="text-red-600 text-sm">Potential scams you successfully avoided</p>
                            </div>
                        </div>

                        <div className="flex gap-4 justify-center">
                            <Button onClick={restartGame} className="bg-blue-600 hover:bg-blue-700">
                                Play Again
                            </Button>
                            <Button onClick={goBack} variant="outline">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Scenario
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!currentAccommodation) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">No Accommodations Available</h1>
                    <Button onClick={goBack}>Back to Scenario</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Button
                        variant="ghost"
                        onClick={goBack}
                        className="mr-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Scenario
                    </Button>
                    
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-800">Accommodation Finder</h1>
                        <p className="text-gray-600">Swipe right for interested, left to skip</p>
                    </div>

                    <div className="text-right">
                        <div className="font-bold text-xl text-blue-600">{score} Points</div>
                        <div className="text-sm text-gray-600">
                            {currentIndex + 1} / {accommodations.length}
                        </div>
                    </div>
                </div>

                {/* Feedback Message */}
                {feedback && (
                    <div className="bg-white rounded-lg p-4 mb-6 text-center border-l-4 border-blue-500">
                        <p className="text-lg font-medium">{feedback}</p>
                    </div>
                )}

                {/* Accommodation Card */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-md mx-auto">
                    <div className="relative">
                        <img 
                            src={currentAccommodation.image || 'https://via.placeholder.com/400x300'} 
                            alt={currentAccommodation.title}
                            className="w-full h-64 object-cover"
                        />
                        <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg">
                            <Home className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>

                    <div className="p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-2">
                            {currentAccommodation.title}
                        </h2>
                        
                        <div className="flex items-center text-gray-600 mb-2">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>{currentAccommodation.location}</span>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center text-green-600 font-semibold">
                                <Euro className="w-4 h-4 mr-1" />
                                <span>{currentAccommodation.price}/month</span>
                            </div>
                            <div className="text-gray-600">
                                Deposit: {currentAccommodation.deposit}
                            </div>
                        </div>

                        <p className="text-gray-700 mb-4">
                            {currentAccommodation.description}
                        </p>

                        {/* Red Flags (for learning purposes, visible to help players learn) */}
                        {currentAccommodation.redFlags && currentAccommodation.redFlags.length > 0 && (
                            <div className="mb-3">
                                <div className="flex items-center text-red-600 mb-2">
                                    <AlertTriangle className="w-4 h-4 mr-1" />
                                    <span className="font-semibold text-sm">Watch out for:</span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {currentAccommodation.redFlags.map((flag, index) => (
                                        <span key={index} className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                                            {flag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Green Flags */}
                        {currentAccommodation.greenFlags && currentAccommodation.greenFlags.length > 0 && (
                            <div className="mb-4">
                                <div className="flex items-center text-green-600 mb-2">
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    <span className="font-semibold text-sm">Good signs:</span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {currentAccommodation.greenFlags.map((flag, index) => (
                                        <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                            {flag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex border-t">
                        <button
                            onClick={() => handleSwipe('left')}
                            className="flex-1 p-4 bg-red-50 hover:bg-red-100 transition-colors flex items-center justify-center"
                        >
                            <X className="w-6 h-6 text-red-600 mr-2" />
                            <span className="font-medium text-red-700">Skip</span>
                        </button>
                        <button
                            onClick={() => handleSwipe('right')}
                            className="flex-1 p-4 bg-green-50 hover:bg-green-100 transition-colors flex items-center justify-center"
                        >
                            <Heart className="w-6 h-6 text-green-600 mr-2" />
                            <span className="font-medium text-green-700">Interested</span>
                        </button>
                    </div>
                </div>

                {/* Instructions */}
                <div className="text-center mt-6 bg-white rounded-lg p-4 shadow-md">
                    <h3 className="font-semibold text-gray-800 mb-2">How to Play</h3>
                    <p className="text-sm text-gray-600">
                        Look carefully at each accommodation listing. Pay attention to red flags (warning signs of scams) 
                        and green flags (positive indicators). Swipe right if you'd be interested, left if you want to skip it.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AccommodationSwipeGame;