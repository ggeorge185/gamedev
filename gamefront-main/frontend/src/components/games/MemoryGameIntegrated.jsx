import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from '../ui/button';
import { ArrowLeft, RotateCcw, Trophy } from 'lucide-react';
import axios from 'axios';

// Card Component
const Card = ({ word, image, pairId, isRevealed, isMatched, onCardFlip, disabled }) => {
  const [isFlipping, setIsFlipping] = useState(false);

  const handleClick = () => {
    if (disabled || isRevealed || isMatched) return;
    onCardFlip();
  };

  useEffect(() => {
    if (isRevealed !== undefined) {
      setIsFlipping(true);
      setTimeout(() => setIsFlipping(false), 300);
    }
  }, [isRevealed]);

  return (
    <button
      onClick={handleClick}
      disabled={isMatched}
      className={`
        relative w-24 h-32 bg-gradient-to-br from-blue-400 to-blue-600 
        border-2 border-blue-300 rounded-lg shadow-lg cursor-pointer
        transition-all duration-300 hover:shadow-xl hover:scale-105
        ${isMatched ? 'opacity-60 cursor-not-allowed bg-green-400' : ''}
        ${isFlipping ? 'transform rotate-y-180' : ''}
      `}
    >
      <div className="absolute inset-0 w-full h-full rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex flex-col items-center justify-center p-2">
        {isRevealed ? (
          <>
            <div className="mb-1 flex items-center justify-center h-12">
              <div className="text-2xl">{image || '📚'}</div>
            </div>
            <div className="text-white text-sm font-bold text-center break-words">
              {word}
            </div>
          </>
        ) : (
          <div className="text-white text-2xl font-bold">?</div>
        )}
      </div>
    </button>
  );
};

// Result Modal Component
const ResultModal = ({ isOpen, success, score, moves, onPlayAgain, onBackToScenario }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 text-center shadow-2xl max-w-sm w-full mx-4">
        <h2 className={`text-3xl font-bold mb-4 ${success ? 'text-green-600' : 'text-red-600'}`}>
          {success ? '🎉 Congratulations!' : '😔 Game Over'}
        </h2>
        <p className="text-gray-700 mb-2">
          {success ? 'You matched all pairs!' : 'Better luck next time!'}
        </p>
        <div className="mb-6">
          <p className="text-gray-600">Score: {score}</p>
          <p className="text-gray-600">Moves: {moves}</p>
        </div>
        <div className="space-y-3">
          <Button
            onClick={onPlayAgain}
            className="w-full bg-blue-500 hover:bg-blue-600"
          >
            Play Again
          </Button>
          <Button
            onClick={onBackToScenario}
            variant="outline"
            className="w-full"
          >
            Back to Scenario
          </Button>
        </div>
      </div>
    </div>
  );
};

const MemoryGameIntegrated = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useSelector((store) => store.auth);
  
  const level = searchParams.get('level') || user?.currentLevel || 'A1';
  const scenario = searchParams.get('scenario') || 'city_registration';

  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sample word pairs for the memory game
  const getWordPairs = (level) => {
    const wordPairs = {
      A1: [
        { german: 'Hallo', english: 'Hello', image: '👋' },
        { german: 'Danke', english: 'Thank you', image: '🙏' },
        { german: 'Haus', english: 'House', image: '🏠' },
        { german: 'Auto', english: 'Car', image: '🚗' },
        { german: 'Wasser', english: 'Water', image: '💧' },
        { german: 'Brot', english: 'Bread', image: '🍞' }
      ],
      A2: [
        { german: 'Arbeiten', english: 'To work', image: '💼' },
        { german: 'Freund', english: 'Friend', image: '👫' },
        { german: 'Schule', english: 'School', image: '🏫' },
        { german: 'Familie', english: 'Family', image: '👨‍👩‍👧‍👦' },
        { german: 'Zeit', english: 'Time', image: '⏰' },
        { german: 'Geld', english: 'Money', image: '💰' }
      ]
    };
    return wordPairs[level] || wordPairs.A1;
  };

  useEffect(() => {
    initializeGame();
  }, [level]);

  const initializeGame = () => {
    setLoading(true);
    const pairs = getWordPairs(level);
    const gameCards = [];
    
    // Create cards for each pair
    pairs.forEach((pair, index) => {
      // German word card
      gameCards.push({
        id: `german-${index}`,
        word: pair.german,
        image: pair.image,
        pairId: index,
        type: 'german'
      });
      
      // English word card
      gameCards.push({
        id: `english-${index}`,
        word: pair.english,
        image: '🇬🇧',
        pairId: index,
        type: 'english'
      });
    });

    // Shuffle cards
    const shuffledCards = gameCards.sort(() => Math.random() - 0.5);
    
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setScore(0);
    setGameOver(false);
    setShowResult(false);
    setLoading(false);
  };

  const handleCardFlip = (cardId) => {
    if (flippedCards.length === 2) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      
      const [firstCard, secondCard] = newFlippedCards.map(id => 
        cards.find(card => card.id === id)
      );

      // Check if cards match (same pairId but different types)
      if (firstCard.pairId === secondCard.pairId && firstCard.type !== secondCard.type) {
        // Match found
        setTimeout(() => {
          setMatchedPairs([...matchedPairs, firstCard.pairId]);
          setFlippedCards([]);
          const newScore = score + 10;
          setScore(newScore);
          
          // Check if game is complete
          if (matchedPairs.length + 1 === getWordPairs(level).length) {
            setGameOver(true);
            setShowResult(true);
            submitScore(newScore);
          }
        }, 1000);
      } else {
        // No match
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const submitScore = async (finalScore) => {
    try {
      const response = await axios.post('/api/v1/game/complete', {
        scenario,
        level,
        gameType: 'memory',
        score: finalScore
      }, {
        withCredentials: true
      });
      
      if (response.data.success) {
        // Redirect to result page with score and unlock info
        const resultParams = new URLSearchParams({
          scenario,
          gameType: 'memory',
          score: finalScore.toString(),
          ...(response.data.progress.unlockedScenario && { unlockedScenario: response.data.progress.unlockedScenario })
        });
        navigate(`/result?${resultParams.toString()}`);
      }
    } catch (error) {
      console.error('Error submitting score:', error);
    }
  };

  const handlePlayAgain = () => {
    initializeGame();
  };

  const handleBackToScenario = () => {
    navigate(`/scenario/${scenario}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🧠</div>
          <h2 className="text-2xl font-bold text-gray-800">Loading Memory Game...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(`/scenario/${scenario}`)}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Scenario
          </Button>
          
          <div className="flex items-center space-x-4">
            <div className="bg-white rounded-lg px-4 py-2 shadow">
              <span className="font-semibold">Score: {score}</span>
            </div>
            <div className="bg-white rounded-lg px-4 py-2 shadow">
              <span className="font-semibold">Moves: {moves}</span>
            </div>
            <Button
              onClick={initializeGame}
              variant="outline"
              size="sm"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Restart
            </Button>
          </div>
        </div>

        {/* Game Info */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Memory Game</h1>
          <p className="text-gray-600">Match German words with their English translations</p>
          <p className="text-sm text-gray-500">Level: {level} | Scenario: {scenario}</p>
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-4 gap-4 justify-items-center">
          {cards.map((card) => (
            <Card
              key={card.id}
              word={card.word}
              image={card.image}
              pairId={card.pairId}
              isRevealed={flippedCards.includes(card.id) || matchedPairs.includes(card.pairId)}
              isMatched={matchedPairs.includes(card.pairId)}
              onCardFlip={() => handleCardFlip(card.id)}
              disabled={flippedCards.length === 2}
            />
          ))}
        </div>

        {/* Result Modal */}
        <ResultModal
          isOpen={showResult}
          success={gameOver}
          score={score}
          moves={moves}
          onPlayAgain={handlePlayAgain}
          onBackToScenario={handleBackToScenario}
        />
      </div>
    </div>
  );
};

export default MemoryGameIntegrated;