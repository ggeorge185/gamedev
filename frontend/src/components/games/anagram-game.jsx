import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Shuffle, CheckCircle, RotateCcw, Target } from 'lucide-react';


const AnagramGame = ({ scenario, difficulty, instructions, words, onGameComplete }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [scrambledWord, setScrambledWord] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Fallback words if none provided from MongoDB
  const fallbackWords = [
    { germanWordSingular: 'Haus', englishTranslation: 'house', clues: ['You live in it'] },
    { germanWordSingular: 'Auto', englishTranslation: 'car', clues: ['A vehicle'] },
    { germanWordSingular: 'Buch', englishTranslation: 'book', clues: ['You read it'] },
    { germanWordSingular: 'Wasser', englishTranslation: 'water', clues: ['You drink it'] },
    { germanWordSingular: 'Katze', englishTranslation: 'cat', clues: ['A pet animal'] }
  ];

  const gameWords = words.length > 0 ? words : fallbackWords;
  const currentWord = gameWords[currentWordIndex];

  const scrambleWord = (word) => {
    const chars = word.split('');
    for (let i = chars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    return chars.join('');
  };

  useEffect(() => {
    if (gameStarted && currentWord) {
      let scrambled = scrambleWord(currentWord.germanWordSingular);
      // Ensure scrambled word is different from original
      while (scrambled === currentWord.germanWordSingular && currentWord.germanWordSingular.length > 3) {
        scrambled = scrambleWord(currentWord.germanWordSingular);
      }
      setScrambledWord(scrambled);
      setUserAnswer('');
      setShowHint(false);
    }
  }, [gameStarted, currentWordIndex, currentWord]);

  const handleGameStart = () => {
    setGameStarted(true);
    setCurrentWordIndex(0);
    setScore(0);
    setGameCompleted(false);
  };

  const handleSubmitAnswer = () => {
    if (!currentWord) return;

    const isCorrect = userAnswer.toLowerCase().trim() === currentWord.germanWordSingular.toLowerCase();
    
    if (isCorrect) {
      setScore(score + 20);
    }

    // Move to next word or end game
    if (currentWordIndex + 1 >= gameWords.length) {
      setGameCompleted(true);
      const finalScore = isCorrect ? score + 20 : score;
      if (onGameComplete) {
        onGameComplete(finalScore);
      }
    } else {
      setCurrentWordIndex(currentWordIndex + 1);
    }
  };

  const handleSkipWord = () => {
    if (currentWordIndex + 1 >= gameWords.length) {
      setGameCompleted(true);
      if (onGameComplete) {
        onGameComplete(score);
      }
    } else {
      setCurrentWordIndex(currentWordIndex + 1);
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setCurrentWordIndex(0);
    setScore(0);
    setGameCompleted(false);
  };

  if (!gameStarted) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <Shuffle className="w-16 h-16 text-purple-600 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Anagram Game
        </h2>
        <div className="mb-6 space-y-2">
          <p className="text-lg text-gray-700">
            Unscramble the German words!
          </p>
          <p className="text-sm text-gray-600">
            <strong>Scenario:</strong> {scenario?.name || 'General'}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Difficulty:</strong> {difficulty}
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
          className="bg-purple-600 hover:bg-purple-700"
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
          <div className="text-2xl font-bold text-purple-600">
            Final Score: {score} points
          </div>
          <div className="text-lg text-gray-700">
            Words completed: {currentWordIndex + 1} / {gameWords.length}
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
          <Shuffle className="w-8 h-8 text-purple-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Anagram Game</h2>
            <p className="text-sm text-gray-600">Word {currentWordIndex + 1} of {gameWords.length}</p>
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{score}</div>
          <div className="text-xs text-gray-500">Score</div>
        </div>
      </div>

      {/* Game Content */}
      <div className="text-center space-y-6">
        <div className="bg-purple-50 p-6 rounded-lg">
          <div className="text-sm text-purple-600 mb-2">Unscramble this word:</div>
          <div className="text-4xl font-bold text-purple-800 tracking-wider">
            {scrambledWord}
          </div>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSubmitAnswer()}
            placeholder="Type your answer here..."
            className="w-full max-w-md mx-auto px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            autoFocus
          />

          <div className="flex gap-3 justify-center">
            <Button
              onClick={handleSubmitAnswer}
              disabled={!userAnswer.trim()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Submit Answer
            </Button>
            <Button
              onClick={() => setShowHint(!showHint)}
              variant="outline"
            >
              <Target className="w-4 h-4 mr-2" />
              {showHint ? 'Hide' : 'Show'} Hint
            </Button>
            <Button
              onClick={handleSkipWord}
              variant="outline"
            >
              Skip Word
            </Button>
          </div>

          {showHint && currentWord && (
            <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
              <div className="text-sm text-yellow-800">
                <strong>Hint:</strong> {currentWord.englishTranslation}
                {currentWord.clues && currentWord.clues.length > 0 && (
                  <div className="mt-1">{currentWord.clues[0]}</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnagramGame;
