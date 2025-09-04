import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { ArrowLeft, CheckCircle, X, Heart, AlertTriangle, MapPin, Euro, Calendar, Trophy } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const AccommodationSwipeGame = ({ scenarioId, difficulty, onComplete, onBack }) => {
  const [accommodations, setAccommodations] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [swipeDirection, setSwipeDirection] = useState(null);

  useEffect(() => {
    fetchAccommodations();
  }, []);

  const fetchAccommodations = async () => {
    try {
      const response = await axios.get('/api/minigames');
      if (response.data && response.data.length > 0) {
        // Shuffle the accommodations for variety
        const shuffled = [...response.data].sort(() => Math.random() - 0.5);
        setAccommodations(shuffled);
      } else {
        // If no data exists, create some sample data
        toast.info('No accommodation data found. Please add some via the Mini Game Table.');
      }
    } catch (error) {
      console.error('Error fetching accommodations:', error);
      toast.error('Failed to load accommodations');
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = (isLegitimate) => {
    const currentAccommodation = accommodations[currentIndex];
    const isCorrect = isLegitimate !== currentAccommodation.isScam;
    
    if (isCorrect) {
      setScore(score + 1);
    }

    setFeedback({
      isCorrect,
      isLegitimate,
      accommodation: currentAccommodation
    });

    setSwipeDirection(isLegitimate ? 'right' : 'left');

    // Show feedback for 2 seconds, then move to next
    setTimeout(() => {
      setFeedback(null);
      setSwipeDirection(null);
      
      if (currentIndex + 1 >= accommodations.length) {
        setGameComplete(true);
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    }, 2000);
  };

  const restartGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setGameComplete(false);
    setFeedback(null);
    setSwipeDirection(null);
    fetchAccommodations();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center">
        <div className="text-lg">Loading accommodations...</div>
      </div>
    );
  }

  if (accommodations.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button onClick={onBack} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Accommodation Hunt</h1>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Accommodations Available</h2>
            <p className="text-gray-600 mb-6">
              No accommodation data found. Please add some accommodations via the Mini Game Table first.
            </p>
            <Button onClick={onBack} className="bg-blue-600 hover:bg-blue-700">
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (gameComplete) {
    const finalScore = Math.round((score / accommodations.length) * 100);
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button onClick={onBack} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Game Complete!</h1>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Well Done, Alex!</h2>
            <p className="text-xl text-gray-700 mb-6">
              You've completed the accommodation hunting game!
            </p>
            
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                Your Score: {score}/{accommodations.length} ({finalScore}%)
              </div>
              <p className="text-gray-600">
                {finalScore >= 80 ? 'Excellent! You can spot scams like a pro!' :
                 finalScore >= 60 ? 'Good work! You\'re getting the hang of it.' :
                 'Keep practicing! Identifying scams takes time to master.'}
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={restartGame} variant="outline">
                Play Again
              </Button>
              <Button onClick={onComplete} className="bg-green-600 hover:bg-green-700">
                Complete Scenario
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentAccommodation = accommodations[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button onClick={onBack} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Accommodation Hunt</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              {currentIndex + 1} / {accommodations.length}
            </div>
            <div className="text-sm font-medium text-blue-600">
              Score: {score}
            </div>
          </div>
        </div>

        {/* Game Instructions */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <p className="text-center text-gray-700">
            <strong>Swipe Right (✓)</strong> for legitimate accommodations • <strong>Swipe Left (✗)</strong> for potential scams
          </p>
        </div>

        {/* Accommodation Card */}
        <div className="relative max-w-md mx-auto">
          <div className={`bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 ${
            swipeDirection === 'right' ? 'transform rotate-12 translate-x-full opacity-50' :
            swipeDirection === 'left' ? 'transform -rotate-12 -translate-x-full opacity-50' : ''
          }`}>
            {/* Image */}
            {currentAccommodation.image && (
              <div className="h-48 bg-gray-200 overflow-hidden">
                <img 
                  src={currentAccommodation.image} 
                  alt={currentAccommodation.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Content */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {currentAccommodation.title}
              </h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{currentAccommodation.location}</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <Euro className="w-4 h-4" />
                  <span>{currentAccommodation.price}</span>
                </div>
                
                {currentAccommodation.deposit && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Deposit: {currentAccommodation.deposit}</span>
                  </div>
                )}
              </div>

              <p className="text-gray-700 text-sm mb-4">
                {currentAccommodation.description}
              </p>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => handleSwipe(false)}
                  variant="outline"
                  className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                  disabled={feedback !== null}
                >
                  <X className="w-5 h-5" />
                  Reject (Scam)
                </Button>
                
                <Button
                  onClick={() => handleSwipe(true)}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                  disabled={feedback !== null}
                >
                  <CheckCircle className="w-5 h-5" />
                  Accept (Legit)
                </Button>
              </div>
            </div>
          </div>

          {/* Feedback Overlay */}
          {feedback && (
            <div className="absolute inset-0 bg-white bg-opacity-95 rounded-lg flex items-center justify-center p-6">
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  feedback.isCorrect ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {feedback.isCorrect ? (
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  ) : (
                    <X className="w-8 h-8 text-red-600" />
                  )}
                </div>
                
                <h3 className={`text-xl font-bold mb-2 ${
                  feedback.isCorrect ? 'text-green-600' : 'text-red-600'
                }`}>
                  {feedback.isCorrect ? 'Correct!' : 'Incorrect!'}
                </h3>
                
                <p className="text-gray-700 mb-4">
                  This accommodation is {feedback.accommodation.isScam ? 'a SCAM' : 'LEGITIMATE'}.
                </p>

                {/* Show red/green flags */}
                {feedback.accommodation.isScam && feedback.accommodation.redFlags && feedback.accommodation.redFlags.length > 0 && (
                  <div className="text-left bg-red-50 rounded p-3 mb-2">
                    <h4 className="font-medium text-red-800 mb-1">Red Flags:</h4>
                    <ul className="text-sm text-red-700">
                      {feedback.accommodation.redFlags.map((flag, index) => (
                        <li key={index}>• {flag}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {!feedback.accommodation.isScam && feedback.accommodation.greenFlags && feedback.accommodation.greenFlags.length > 0 && (
                  <div className="text-left bg-green-50 rounded p-3">
                    <h4 className="font-medium text-green-800 mb-1">Green Flags:</h4>
                    <ul className="text-sm text-green-700">
                      {feedback.accommodation.greenFlags.map((flag, index) => (
                        <li key={index}>• {flag}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mt-8 max-w-md mx-auto">
          <div className="bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / accommodations.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccommodationSwipeGame;