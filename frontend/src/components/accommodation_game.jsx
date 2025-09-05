import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Home, MapPin, CheckCircle, X, Heart } from 'lucide-react';
import AccommodationSwipe from './accommodation_swipe.jsx';

const AccommodationGame = ({ difficulty = 'A1', onGameComplete }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentProperty, setCurrentProperty] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [selectedProperties, setSelectedProperties] = useState([]);

  // Property data based on difficulty level
  const properties = {
    A1: [
      {
        id: 1,
        type: 'Apartment',
        location: 'Berlin Mitte',
        rent: '€800/month',
        size: '30m²',
        image: '/api/placeholder/300/200',
        description: 'Small studio apartment in city center',
        suitable: true,
        reason: 'Good for students - central location'
      },
      {
        id: 2,
        type: 'WG-Zimmer',
        location: 'Munich',
        rent: '€600/month',
        size: '15m²',
        image: '/api/placeholder/300/200',
        description: 'Shared room in student housing',
        suitable: true,
        reason: 'Perfect for students - affordable'
      },
      {
        id: 3,
        type: 'Villa',
        location: 'Frankfurt',
        rent: '€3000/month',
        size: '200m²',
        image: '/api/placeholder/300/200',
        description: 'Luxury villa with garden',
        suitable: false,
        reason: 'Too expensive for students'
      },
      {
        id: 4,
        type: 'Apartment',
        location: 'Hamburg',
        rent: '€700/month',
        size: '40m²',
        image: '/api/placeholder/300/200',
        description: 'One bedroom apartment near university',
        suitable: true,
        reason: 'Good size and price for students'
      },
      {
        id: 5,
        type: 'Mansion',
        location: 'Cologne',
        rent: '€5000/month',
        size: '500m²',
        image: '/api/placeholder/300/200',
        description: 'Historic mansion in premium area',
        suitable: false,
        reason: 'Way too expensive and large'
      }
    ],
    A2: [
      {
        id: 1,
        type: 'Einzimmerwohnung',
        location: 'Berlin Kreuzberg',
        rent: '€850/month',
        size: '35m²',
        image: '/api/placeholder/300/200',
        description: 'One-room apartment with balcony',
        suitable: true,
        reason: 'Gute Lage und angemessener Preis'
      },
      {
        id: 2,
        type: 'Wohngemeinschaft',
        location: 'Dresden',
        rent: '€400/month',
        size: '20m²',
        image: '/api/placeholder/300/200',
        description: 'Room in shared flat with 3 students',
        suitable: true,
        reason: 'Sehr günstig für Studenten'
      },
      {
        id: 3,
        type: 'Penthouse',
        location: 'München Maxvorstadt',
        rent: '€2500/month',
        size: '120m²',
        image: '/api/placeholder/300/200',
        description: 'Luxury penthouse with city view',
        suitable: false,
        reason: 'Zu teuer für das Budget'
      },
      {
        id: 4,
        type: 'Studentenwohnheim',
        location: 'Leipzig',
        rent: '€350/month',
        size: '18m²',
        image: '/api/placeholder/300/200',
        description: 'Student dormitory room',
        suitable: true,
        reason: 'Speziell für Studenten gemacht'
      }
    ],
    B1: [
      {
        id: 1,
        type: 'Zweizimmerwohnung',
        location: 'Berlin Prenzlauer Berg',
        rent: '€1200/month',
        size: '55m²',
        image: '/api/placeholder/300/200',
        description: 'Schöne Altbauwohnung mit hohen Decken',
        suitable: true,
        reason: 'Gute Ausstattung und verkehrsfreundliche Lage'
      },
      {
        id: 2,
        type: 'Luxusvilla',
        location: 'Düsseldorf Oberkassel',
        rent: '€4500/month',
        size: '300m²',
        image: '/api/placeholder/300/200',
        description: 'Exklusive Villa am Rhein mit Garten',
        suitable: false,
        reason: 'Weit über dem verfügbaren Budget'
      },
      {
        id: 3,
        type: 'Möbliertes Zimmer',
        location: 'Heidelberg',
        rent: '€580/month',
        size: '25m²',
        image: '/api/placeholder/300/200',
        description: 'Vollmöbliertes Zimmer in Uninähe',
        suitable: true,
        reason: 'Praktisch und in der Nähe der Universität'
      }
    ],
    B2: [
      {
        id: 1,
        type: 'Dreizimmerwohnung',
        location: 'Hamburg Eppendorf',
        rent: '€1800/month',
        size: '85m²',
        image: '/api/placeholder/300/200',
        description: 'Geräumige Wohnung in begehrter Wohnlage mit Balkon und modernen Annehmlichkeiten',
        suitable: false,
        reason: 'Überschreitet das Budget erheblich, obwohl die Lage sehr attraktiv ist'
      },
      {
        id: 2,
        type: 'Studentenapartment',
        location: 'Tübingen Zentrum',
        rent: '€650/month',
        size: '28m²',
        image: '/api/placeholder/300/200',
        description: 'Modernes Mikroapartment mit intelligenter Raumaufteilung',
        suitable: true,
        reason: 'Optimal für Studenten: zentrale Lage, angemessener Preis und moderne Ausstattung'
      }
    ]
  };

  const currentProperties = properties[difficulty] || properties.A1;

  const handleGameStart = () => {
    setGameStarted(true);
    setCurrentProperty(0);
    setScore(0);
    setLives(3);
    setGameCompleted(false);
    setSelectedProperties([]);
  };

  const handlePropertyDecision = (isAccepted) => {
    const property = currentProperties[currentProperty];
    const isCorrect = property.suitable === isAccepted;
    
    if (isCorrect) {
      setScore(score + 20);
      if (isAccepted) {
        setSelectedProperties([...selectedProperties, property]);
      }
    } else {
      setLives(lives - 1);
    }

    // Move to next property or end game
    if (currentProperty + 1 >= currentProperties.length || lives <= 1) {
      setGameCompleted(true);
      const finalScore = isCorrect ? score + 20 : score;
      if (onGameComplete) {
        onGameComplete(finalScore);
      }
    } else {
      setCurrentProperty(currentProperty + 1);
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setCurrentProperty(0);
    setScore(0);
    setLives(3);
    setGameCompleted(false);
    setSelectedProperties([]);
  };

  if (!gameStarted) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <Home className="w-16 h-16 text-blue-600 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Finding Accommodation Game
        </h2>
        <div className="mb-6 space-y-2">
          <p className="text-lg text-gray-700">
            Help Alex find suitable accommodation in Germany!
          </p>
          <p className="text-sm text-gray-600">
            <strong>Difficulty:</strong> {difficulty}
          </p>
          <p className="text-sm text-gray-600">
            Swipe right (✓) for suitable properties, left (✗) for unsuitable ones.
          </p>
          <p className="text-sm text-gray-600">
            <strong>Lives:</strong> 3 | <strong>Goal:</strong> Find the best accommodation options
          </p>
        </div>
        <Button
          onClick={handleGameStart}
          className="bg-blue-600 hover:bg-blue-700"
          size="lg"
        >
          Start Game
        </Button>
      </div>
    );
  }

  if (gameCompleted) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Game Complete!
        </h2>
        <div className="mb-6 space-y-4">
          <div className="text-2xl font-bold text-blue-600">
            Final Score: {score} points
          </div>
          <div className="text-lg text-gray-700">
            Lives remaining: {lives}
          </div>
          
          {selectedProperties.length > 0 && (
            <div className="mt-4 p-4 bg-green-50 rounded border border-green-200">
              <h3 className="font-semibold text-green-800 mb-2">
                Properties you selected:
              </h3>
              {selectedProperties.map((property) => (
                <div key={property.id} className="text-sm text-green-700">
                  • {property.type} in {property.location} - {property.rent}
                </div>
              ))}
            </div>
          )}
          
          <div className="text-sm text-gray-600">
            Great job learning about German accommodation vocabulary!
          </div>
        </div>
        <div className="flex gap-4 justify-center">
          <Button
            onClick={resetGame}
            variant="outline"
            className="flex items-center gap-2"
          >
            Play Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Game Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Home className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Finding Accommodation</h2>
            <p className="text-sm text-gray-600">Property {currentProperty + 1} of {currentProperties.length}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{score}</div>
            <div className="text-xs text-gray-500">Score</div>
          </div>
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <Heart
                key={i}
                className={`w-5 h-5 ${
                  i < lives ? 'text-red-500 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Property Card */}
      <AccommodationSwipe
        property={currentProperties[currentProperty]}
        onSwipe={handlePropertyDecision}
        difficulty={difficulty}
      />
      
      {/* Action Buttons */}
      <div className="flex justify-center gap-8 mt-6">
        <Button
          onClick={() => handlePropertyDecision(false)}
          variant="outline"
          size="lg"
          className="flex items-center gap-2 border-red-300 text-red-600 hover:bg-red-50"
        >
          <X className="w-5 h-5" />
          Not Suitable
        </Button>
        <Button
          onClick={() => handlePropertyDecision(true)}
          size="lg"
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
        >
          <CheckCircle className="w-5 h-5" />
          Suitable
        </Button>
      </div>
    </div>
  );
};

export default AccommodationGame;