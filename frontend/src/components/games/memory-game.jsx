import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Brain, CheckCircle, RotateCcw, Clock } from 'lucide-react';

const MemoryGame = ({ scenario, difficulty, instructions, words, onGameComplete }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Fallback words if none provided from MongoDB
  const fallbackWords = [
    { germanWordSingular: 'Haus', englishTranslation: 'house' },
    { germanWordSingular: 'Auto', englishTranslation: 'car' },
    { germanWordSingular: 'Buch', englishTranslation: 'book' },
    { germanWordSingular: 'Wasser', englishTranslation: 'water' },
    { germanWordSingular: 'Katze', englishTranslation: 'cat' },
    { germanWordSingular: 'Hund', englishTranslation: 'dog' },
    { germanWordSingular: 'Baum', englishTranslation: 'tree' },
    { germanWordSingular: 'Blume', englishTranslation: 'flower' }
  ];

  const gameWords = words.length >= 4 ? words.slice(0, 8) : fallbackWords;

  // Timer effect
  useEffect(() => {
    let interval;
    if (gameStarted && !gameCompleted) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameCompleted]);

  // Initialize cards
  useEffect(() => {
    if (gameStarted) {
      const cardPairs = [];
      gameWords.forEach((word, index) => {
        // German word card
        cardPairs.push({
          id: `german-${index}`,
          content: word.germanWordSingular,
          type: 'german',
          pairId: index
        });
        // English translation card
        cardPairs.push({
          id: `english-${index}`,
          content: word.englishTranslation,
          type: 'english',
          pairId: index
        });
      });
      
      // Shuffle cards
      const shuffledCards = cardPairs.sort(() => Math.random() - 0.5);
      setCards(shuffledCards);
    }
  }, [gameStarted, gameWords]);

  // Check for matches when two cards are flipped
  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      setMoves(moves + 1);
      
      if (first.pairId === second.pairId && first.type !== second.type) {
        // Match found
        setMatchedPairs([...matchedPairs, first.pairId]);
        setScore(score + 20);
        setFlippedCards([]);
        
        // Check if game is complete
        if (matchedPairs.length + 1 === gameWords.length) {
          setGameCompleted(true);
          const finalScore = score + 20;
          if (onGameComplete) {
            onGameComplete(finalScore);
          }
        }
      } else {
        // No match, flip cards back after delay
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards, matchedPairs, gameWords.length, score, moves, onGameComplete]);

  const handleCardClick = (card) => {
    if (flippedCards.length < 2 && 
        !flippedCards.find(c => c.id === card.id) && 
        !matchedPairs.includes(card.pairId)) {
      setFlippedCards([...flippedCards, card]);
    }
  };

  const handleGameStart = () => {
    setGameStarted(true);
    setFlippedCards([]);
    setMatchedPairs([]);
    setScore(0);
    setMoves(0);
    setGameCompleted(false);
    setTimeElapsed(0);
  };

  const resetGame = () => {
    setGameStarted(false);
    setCards([]);
    setFlippedCards([]);
    setMatchedPairs([]);
    setScore(0);
    setMoves(0);
    setGameCompleted(false);
    setTimeElapsed(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!gameStarted) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <Brain className="w-16 h-16 text-blue-600 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Memory Game
        </h2>
        <div className="mb-6 space-y-2">
          <p className="text-lg text-gray-700">
            Match German words with their English translations!
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
          Excellent Memory!
        </h2>
        <div className="mb-6 space-y-4">
          <div className="text-2xl font-bold text-blue-600">
            Final Score: {score} points
          </div>
          <div className="text-lg text-gray-700">
            Completed in {moves} moves
          </div>
          <div className="text-lg text-gray-700">
            Time: {formatTime(timeElapsed)}
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
          <Brain className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Memory Game</h2>
            <p className="text-sm text-gray-600">Match the pairs!</p>
          </div>
        </div>
        
        <div className="flex gap-6">
          <div className="text-center">
            <div className="text-xl font-bold text-blue-600">{score}</div>
            <div className="text-xs text-gray-500">Score</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-purple-600">{moves}</div>
            <div className="text-xs text-gray-500">Moves</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-green-600">{formatTime(timeElapsed)}</div>
            <div className="text-xs text-gray-500">Time</div>
          </div>
        </div>
      </div>

      {/* Game Grid */}
      <div className="grid grid-cols-4 gap-3 max-w-2xl mx-auto">
        {cards.map((card) => {
          const isFlipped = flippedCards.find(c => c.id === card.id) || matchedPairs.includes(card.pairId);
          const isMatched = matchedPairs.includes(card.pairId);
          
          return (
            <div
              key={card.id}
              onClick={() => handleCardClick(card)}
              className={`
                aspect-square flex items-center justify-center text-center p-2 rounded-lg border-2 cursor-pointer transition-all duration-300
                ${isFlipped 
                  ? isMatched 
                    ? 'bg-green-100 border-green-400 text-green-800' 
                    : card.type === 'german' 
                      ? 'bg-blue-100 border-blue-400 text-blue-800'
                      : 'bg-purple-100 border-purple-400 text-purple-800'
                  : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
                }
                ${flippedCards.length === 2 ? 'pointer-events-none' : ''}
              `}
            >
              <span className={`text-sm font-medium ${isFlipped ? 'block' : 'hidden'}`}>
                {card.content}
              </span>
              <span className={`text-2xl ${isFlipped ? 'hidden' : 'block'}`}>
                ?
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress */}
      <div className="mt-6 text-center">
        <div className="text-sm text-gray-600">
          Pairs matched: {matchedPairs.length} / {gameWords.length}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(matchedPairs.length / gameWords.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default MemoryGame;