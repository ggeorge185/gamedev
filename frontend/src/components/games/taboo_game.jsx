import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Target, CheckCircle, X, RotateCcw, Clock } from 'lucide-react';

const TabooGame = ({ scenario, difficulty, instructions, words, onGameComplete }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [roundActive, setRoundActive] = useState(false);

  // Fallback words if none provided from MongoDB
  const fallbackWords = [
    { 
      germanWordSingular: 'Haus', 
      englishTranslation: 'house',
      clues: ['building', 'home', 'live', 'roof'],
      englishDescription: 'A place where people live'
    },
    { 
      germanWordSingular: 'Auto', 
      englishTranslation: 'car',
      clues: ['vehicle', 'drive', 'wheels', 'road'],
      englishDescription: 'A motor vehicle with four wheels'
    },
    { 
      germanWordSingular: 'Buch', 
      englishTranslation: 'book',
      clues: ['read', 'pages', 'story', 'paper'],
      englishDescription: 'Something you read with pages'
    },
    { 
      germanWordSingular: 'Wasser', 
      englishTranslation: 'water',
      clues: ['drink', 'liquid', 'ocean', 'rain'],
      englishDescription: 'Clear liquid that you drink'
    },
    { 
      germanWordSingular: 'Katze', 
      englishTranslation: 'cat',
      clues: ['pet', 'meow', 'furry', 'animal'],
      englishDescription: 'A small domestic animal that says meow'
    }
  ];

  const gameWords = words.length > 0 ? words : fallbackWords;
  const currentWord = gameWords[currentWordIndex];

  // Timer effect
  useEffect(() => {
    let interval;
    if (roundActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setRoundActive(false);
            setGameCompleted(true);
            if (onGameComplete) {
              onGameComplete(score);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [roundActive, timeLeft, score, onGameComplete]);

  const handleGameStart = () => {
    setGameStarted(true);
    setRoundActive(true);
    setCurrentWordIndex(0);
    setScore(0);
    setTimeLeft(60);
    setGameCompleted(false);
  };

  const handleCorrectGuess = () => {
    setScore(score + 10);
    nextWord();
  };

  const handleSkipWord = () => {
    nextWord();
  };

  const nextWord = () => {
    if (currentWordIndex + 1 >= gameWords.length) {
      // Reset to beginning if we've gone through all words
      setCurrentWordIndex(0);
    } else {
      setCurrentWordIndex(currentWordIndex + 1);
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setRoundActive(false);
    setCurrentWordIndex(0);
    setScore(0);
    setTimeLeft(60);
    setGameCompleted(false);
  };

  const getForbiddenWords = (word) => {
    const forbidden = [];
    
    // Add the English translation
    if (word.englishTranslation) {
      forbidden.push(word.englishTranslation);
    }
    
    // Add clues if available
    if (word.clues && word.clues.length > 0) {
      forbidden.push(...word.clues.slice(0, 4)); // Max 4 forbidden words
    }
    
    // If we don't have enough, add some generic ones
    while (forbidden.length < 3) {
      forbidden.push('...');
    }
    
    return forbidden.slice(0, 5); // Max 5 forbidden words
  };

  if (!gameStarted) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <Target className="w-16 h-16 text-red-600 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Taboo Game
        </h2>
        <div className="mb-6 space-y-2">
          <p className="text-lg text-gray-700">
            Describe the German word without using the forbidden words!
          </p>
          <p className="text-sm text-gray-600">
            <strong>Scenario:</strong> {scenario?.name || 'General'}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Difficulty:</strong> {difficulty}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Time Limit:</strong> 60 seconds
          </p>
          {instructions && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-blue-800">
                <strong>Instructions:</strong> {instructions}
              </p>
            </div>
          )}
        </div>
        <Button
          onClick={handleGameStart}
          className="bg-red-600 hover:bg-red-700"
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
          Time's Up!
        </h2>
        <div className="mb-6 space-y-4">
          <div className="text-2xl font-bold text-red-600">
            Final Score: {score} points
          </div>
          <div className="text-lg text-gray-700">
            Great job describing the words!
          </div>
        </div>
        <div className="flex gap-4 justify-center">
          <Button
            onClick={resetGame}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
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
          <Target className="w-8 h-8 text-red-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Taboo Game</h2>
            <p className="text-sm text-gray-600">Describe without forbidden words!</p>
          </div>
        </div>
        
        <div className="flex gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{score}</div>
            <div className="text-xs text-gray-500">Score</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${timeLeft <= 10 ? 'text-red-600' : 'text-blue-600'}`}>
              {timeLeft}
            </div>
            <div className="text-xs text-gray-500">Seconds</div>
          </div>
        </div>
      </div>

      {/* Game Content */}
      <div className="text-center space-y-6">
        {/* Target Word */}
        <div className="bg-blue-50 p-8 rounded-lg">
          <div className="text-sm text-blue-600 mb-2">Describe this German word:</div>
          <div className="text-5xl font-bold text-blue-800 mb-2">
            {currentWord?.germanWordSingular}
          </div>
          {currentWord?.englishDescription && (
            <div className="text-sm text-blue-600 italic">
              ({currentWord.englishDescription})
            </div>
          )}
        </div>

        {/* Forbidden Words */}
        <div className="bg-red-50 p-6 rounded-lg">
          <div className="text-lg font-semibold text-red-800 mb-3">
            FORBIDDEN WORDS:
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {getForbiddenWords(currentWord).map((word, index) => (
              <div
                key={index}
                className="bg-red-200 text-red-800 px-3 py-2 rounded font-medium"
              >
                {word}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button
            onClick={handleCorrectGuess}
            className="bg-green-600 hover:bg-green-700 text-lg px-8 py-3"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Correct!
          </Button>
          <Button
            onClick={handleSkipWord}
            variant="outline"
            className="text-lg px-8 py-3"
          >
            <X className="w-5 h-5 mr-2" />
            Skip
          </Button>
        </div>

        {/* Instructions */}
        <div className="text-sm text-gray-600 max-w-md mx-auto">
          Have someone describe the German word to you without using any of the forbidden words. 
          Click "Correct!" when you guess it right, or "Skip" to move to the next word.
        </div>
      </div>
    </div>
  );
};

export default TabooGame;