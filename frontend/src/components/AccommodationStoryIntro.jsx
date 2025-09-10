import { useState } from 'react';
import { Button } from './ui/button';
import { Home, MapPin, Play, User, Heart } from 'lucide-react';
import AccommodationGame from './accommodation_game.jsx';

const AccommodationStoryIntro = ({ scenario, difficulty, onGameComplete }) => {
  const [showGame, setShowGame] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  // Alex's story about finding accommodation
  const alexStory = `
    Alex has just arrived in Germany to start a new chapter of life! As a young international student, 
    Alex needs to find a suitable place to live. This is one of the most important and challenging 
    tasks when moving to a new country.

    In Germany, finding accommodation can be competitive, especially in big cities. Alex needs to 
    learn about different types of housing, understand rental prices, and make smart decisions 
    about what kind of place would be suitable for a student budget and lifestyle.

    Help Alex navigate through various housing options and learn essential German vocabulary 
    related to accommodation along the way!
  `;

  const gameInstructions = [
    "You'll see different accommodation options one by one",
    "Swipe right (✓) if the place is suitable for Alex as a student",
    "Swipe left (✗) if the place is too expensive or not suitable",
    "Consider Alex's budget, needs, and student lifestyle",
    "Learn German vocabulary for housing and accommodation",
    "You have 3 lives - make smart choices!"
  ];

  if (showGame) {
    return (
      <AccommodationGame
        difficulty={difficulty}
        onGameComplete={onGameComplete}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Alex's Story Section */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Meet Alex
          </h2>
          <p className="text-lg text-blue-600 font-medium">
            A New Adventure in Germany
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-4">
            <Home className="w-8 h-8 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Alex's Story: Finding a Home
              </h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {alexStory}
              </p>
            </div>
          </div>
        </div>

        {/* Toggle Instructions */}
        <div className="text-center mb-6">
          <Button
            onClick={() => setShowInstructions(!showInstructions)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            {showInstructions ? 'Hide Instructions' : 'Show Game Instructions'}
          </Button>
        </div>

        {/* Instructions (collapsible) */}
        {showInstructions && (
          <div className="bg-yellow-50 rounded-lg p-6 mb-6 border border-yellow-200">
            <h4 className="text-lg font-semibold text-yellow-800 mb-4 flex items-center gap-2">
              <Play className="w-5 h-5" />
              How to Play the Accommodation Game
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gameInstructions.map((instruction, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-yellow-200 rounded-full flex items-center justify-center text-sm font-bold text-yellow-800 flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-yellow-700 text-sm">{instruction}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Game Level Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Difficulty Level</h4>
              <p className="text-sm text-gray-600">
                {difficulty} - {
                  difficulty === 'A1' ? 'Beginner (Basic vocabulary)' :
                  difficulty === 'A2' ? 'Elementary (Simple German terms)' :
                  difficulty === 'B1' ? 'Intermediate (More complex German)' :
                  'Upper-Intermediate (Advanced German)'
                }
              </p>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(3)].map((_, i) => (
                <Heart key={i} className="w-5 h-5 text-red-500 fill-current" />
              ))}
              <span className="ml-2 text-sm text-gray-600">3 Lives</span>
            </div>
          </div>
        </div>

        {/* Start Game Button */}
        <div className="text-center">
          <Button
            onClick={() => setShowGame(true)}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-medium"
          >
            <Play className="w-6 h-6 mr-3" />
            Start Alex's Accommodation Adventure
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccommodationStoryIntro;