import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Grid3x3, CheckCircle, RotateCcw, Shuffle } from 'lucide-react';

const ScrabbleGame = ({ scenario, difficulty, instructions, words, onGameComplete }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [availableLetters, setAvailableLetters] = useState([]);
  const [formedWord, setFormedWord] = useState('');
  const [score, setScore] = useState(0);
  const [foundWords, setFoundWords] = useState([]);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [targetWords, setTargetWords] = useState([]);

  // Fallback words if none provided from MongoDB
  const fallbackWords = [
    'HAUS', 'AUTO', 'BUCH', 'KATZE', 'HUND', 'BAUM', 'WASSER', 'BLUME'
  ];

  // Generate letters and target words
  useEffect(() => {
    if (gameStarted) {
      const wordList = words.length > 0 
        ? words.map(w => w.germanWordSingular.toUpperCase()).filter(w => w.length <= 8)
        : fallbackWords;
      
      setTargetWords(wordList.slice(0, 5));
      
      // Generate letters from target words
      const allLetters = wordList.slice(0, 5).join('').split('');
      const letterCounts = {};
      
      // Count frequency of each letter
      allLetters.forEach(letter => {
        letterCounts[letter] = (letterCounts[letter] || 0) + 1;
      });
      
      // Create letter tiles (limit to reasonable numbers)
      const letters = [];
      Object.entries(letterCounts).forEach(([letter, count]) => {
        for (let i = 0; i < Math.min(count, 3); i++) {
          letters.push({
            id: `${letter}-${i}`,
            letter: letter,
            used: false
          });
        }
      });
      
      // Add some random common German letters
      const commonLetters = ['E', 'N', 'I', 'R', 'S', 'T', 'A'];
      commonLetters.forEach((letter, index) => {
        letters.push({
          id: `common-${letter}-${index}`,
          letter: letter,
          used: false
        });
      });
      
      setAvailableLetters(letters.slice(0, 12)); // Limit to 12 letters
    }
  }, [gameStarted, words]);

  const handleGameStart = () => {
    setGameStarted(true);
    setFormedWord('');
    setScore(0);
    setFoundWords([]);
    setGameCompleted(false);
  };

  const handleLetterClick = (letterId) => {
    const letter = availableLetters.find(l => l.id === letterId);
    if (letter && !letter.used) {
      setFormedWord(formedWord + letter.letter);
      setAvailableLetters(prev => prev.map(l => 
        l.id === letterId ? { ...l, used: true } : l
      ));
    }
  };

  const handleClearWord = () => {
    setFormedWord('');
    setAvailableLetters(prev => prev.map(l => ({ ...l, used: false })));
  };

  const handleSubmitWord = () => {
    const word = formedWord.trim();
    if (word.length < 3) {
      return;
    }

    // Check if word is in target words
    const isTargetWord = targetWords.includes(word);
    const alreadyFound = foundWords.includes(word);
    
    if (isTargetWord && !alreadyFound) {
      const wordScore = word.length * 5;
      setScore(score + wordScore);
      setFoundWords([...foundWords, word]);
      
      // Check if all words found
      if (foundWords.length + 1 >= targetWords.length) {
        setGameCompleted(true);
        if (onGameComplete) {
          onGameComplete(score + wordScore);
        }
      }
    } else if (word.length >= 3 && !alreadyFound) {
      // Give small points for any valid-looking word
      setScore(score + word.length);
      setFoundWords([...foundWords, word]);
    }
    
    setFormedWord('');
    setAvailableLetters(prev => prev.map(l => ({ ...l, used: false })));
  };

  const shuffleLetters = () => {
    setAvailableLetters(prev => [...prev].sort(() => Math.random() - 0.5));
  };

  const resetGame = () => {
    setGameStarted(false);
    setAvailableLetters([]);
    setFormedWord('');
    setScore(0);
    setFoundWords([]);
    setGameCompleted(false);
    setTargetWords([]);
  };

  if (!gameStarted) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <Grid3x3 className="w-16 h-16 text-yellow-600 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Word Building Game
        </h2>
        <div className="mb-6 space-y-2">
          <p className="text-lg text-gray-700">
            Form German words using the available letters!
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
          className="bg-yellow-600 hover:bg-yellow-700"
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
          Excellent Word Building!
        </h2>
        <div className="mb-6 space-y-4">
          <div className="text-2xl font-bold text-yellow-600">
            Final Score: {score} points
          </div>
          <div className="text-lg text-gray-700">
            Words found: {foundWords.length}
          </div>
          <div className="bg-green-50 p-4 rounded border border-green-200">
            <div className="text-sm font-medium text-green-800 mb-2">Target Words Found:</div>
            <div className="flex flex-wrap gap-2 justify-center">
              {foundWords.filter(word => targetWords.includes(word)).map((word, index) => (
                <span key={index} className="bg-green-200 text-green-800 px-2 py-1 rounded text-sm">
                  {word}
                </span>
              ))}
            </div>
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
          <Grid3x3 className="w-8 h-8 text-yellow-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Word Building</h2>
            <p className="text-sm text-gray-600">Form words with the letters!</p>
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">{score}</div>
          <div className="text-xs text-gray-500">Score</div>
        </div>
      </div>

      {/* Target Words Progress */}
      <div className="mb-6 bg-yellow-50 p-4 rounded-lg">
        <div className="text-sm font-medium text-yellow-800 mb-2">
          Target Words: {foundWords.filter(w => targetWords.includes(w)).length} / {targetWords.length}
        </div>
        <div className="flex flex-wrap gap-2">
          {targetWords.map((word, index) => (
            <span 
              key={index}
              className={`px-2 py-1 rounded text-sm ${
                foundWords.includes(word) 
                  ? 'bg-green-200 text-green-800' 
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {foundWords.includes(word) ? word : '???'}
            </span>
          ))}
        </div>
      </div>

      {/* Current Word */}
      <div className="mb-6 text-center">
        <div className="bg-blue-50 p-4 rounded-lg min-h-16 flex items-center justify-center">
          <span className="text-2xl font-bold text-blue-800 tracking-wider">
            {formedWord || 'Click letters to form a word...'}
          </span>
        </div>
      </div>

      {/* Available Letters */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="font-medium text-gray-700">Available Letters:</span>
          <Button
            onClick={shuffleLetters}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Shuffle className="w-4 h-4" />
            Shuffle
          </Button>
        </div>
        <div className="grid grid-cols-6 gap-2">
          {availableLetters.map((letter) => (
            <button
              key={letter.id}
              onClick={() => handleLetterClick(letter.id)}
              disabled={letter.used}
              className={`
                aspect-square flex items-center justify-center text-xl font-bold rounded border-2 transition-all
                ${letter.used 
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                  : 'bg-white text-yellow-800 border-yellow-300 hover:bg-yellow-50 cursor-pointer'
                }
              `}
            >
              {letter.letter}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center">
        <Button
          onClick={handleSubmitWord}
          disabled={formedWord.length < 3}
          className="bg-yellow-600 hover:bg-yellow-700"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Submit Word
        </Button>
        <Button
          onClick={handleClearWord}
          variant="outline"
        >
          Clear
        </Button>
      </div>

      {/* Found Words */}
      {foundWords.length > 0 && (
        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-gray-700 mb-2">
            Found Words ({foundWords.length}):
          </div>
          <div className="flex flex-wrap gap-2">
            {foundWords.map((word, index) => (
              <span 
                key={index}
                className={`px-2 py-1 rounded text-xs ${
                  targetWords.includes(word)
                    ? 'bg-green-200 text-green-800'
                    : 'bg-blue-200 text-blue-800'
                }`}
              >
                {word} ({(targetWords.includes(word) ? word.length * 5 : word.length)}pts)
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScrabbleGame;