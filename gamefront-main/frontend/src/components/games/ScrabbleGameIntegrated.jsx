import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from '../ui/button';
import { ArrowLeft, RotateCcw, Plus, Check } from 'lucide-react';
import axios from 'axios';

// Result Modal Component
const ResultModal = ({ isOpen, score, wordsFormed, onPlayAgain, onBackToScenario }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 text-center shadow-2xl max-w-sm w-full mx-4">
        <h2 className="text-3xl font-bold mb-4 text-green-600">
          🎯 Game Complete!
        </h2>
        <p className="text-gray-700 mb-2">
          You formed {wordsFormed} words!
        </p>
        <div className="mb-6">
          <p className="text-gray-600">Final Score: {score}</p>
        </div>
        <div className="space-y-3">
          <Button
            onClick={onPlayAgain}
            className="w-full bg-green-500 hover:bg-green-600"
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

const ScrabbleGameIntegrated = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useSelector((store) => store.auth);
  
  const level = searchParams.get('level') || user?.currentLevel || 'A1';
  const scenario = searchParams.get('scenario') || 'city_registration';

  const [availableLetters, setAvailableLetters] = useState([]);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [currentWord, setCurrentWord] = useState('');
  const [formedWords, setFormedWords] = useState([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [gameTime, setGameTime] = useState(300); // 5 minutes
  const [gameActive, setGameActive] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);

  // Valid German words for each level
  const getValidWords = (level) => {
    const wordLists = {
      A1: ['HAUS', 'AUTO', 'HUND', 'BUCH', 'ZEIT', 'ICH', 'DU', 'ER', 'SIE', 'WIR', 'IHR', 'DAS', 'DER', 'DIE', 'UND', 'BIN', 'IST', 'HAT', 'EIN', 'AUS'],
      A2: ['FREUND', 'SCHULE', 'FAMILIE', 'ARBEITEN', 'GARTEN', 'FENSTER', 'TISCH', 'STUHL', 'WOCHE', 'MONAT', 'JAHR', 'HEUTE', 'MORGEN', 'GESTERN']
    };
    return wordLists[level] || wordLists.A1;
  };

  // Letter distribution for German
  const getLetterDistribution = () => {
    return [
      'A', 'A', 'A', 'E', 'E', 'E', 'E', 'I', 'I', 'N', 'N', 'N',
      'R', 'R', 'R', 'S', 'S', 'S', 'T', 'T', 'T', 'U', 'U', 'H', 'H',
      'D', 'D', 'L', 'L', 'C', 'G', 'M', 'B', 'F', 'K', 'P', 'W', 'Z'
    ];
  };

  useEffect(() => {
    initializeGame();
  }, [level]);

  useEffect(() => {
    let timer;
    if (gameActive && gameTime > 0) {
      timer = setTimeout(() => {
        setGameTime(gameTime - 1);
      }, 1000);
    } else if (gameTime === 0) {
      endGame();
    }
    return () => clearTimeout(timer);
  }, [gameActive, gameTime]);

  const initializeGame = () => {
    setLoading(true);
    const letters = getLetterDistribution().sort(() => Math.random() - 0.5).slice(0, 7);
    setAvailableLetters(letters.map((letter, index) => ({ letter, id: index })));
    setSelectedLetters([]);
    setCurrentWord('');
    setFormedWords([]);
    setScore(0);
    setFeedback('');
    setGameTime(300);
    setGameActive(false);
    setShowResult(false);
    setLoading(false);
  };

  const startGame = () => {
    setGameActive(true);
  };

  const endGame = () => {
    setGameActive(false);
    setShowResult(true);
    submitScore(score);
  };

  const handleLetterClick = (letterId) => {
    const letter = availableLetters.find(l => l.id === letterId);
    if (!letter) return;

    setSelectedLetters([...selectedLetters, letter]);
    setAvailableLetters(availableLetters.filter(l => l.id !== letterId));
    setCurrentWord(currentWord + letter.letter);
  };

  const handleSelectedLetterClick = (letterId) => {
    const letterIndex = selectedLetters.findIndex(l => l.id === letterId);
    if (letterIndex === -1) return;

    const letter = selectedLetters[letterIndex];
    setAvailableLetters([...availableLetters, letter]);
    setSelectedLetters(selectedLetters.filter(l => l.id !== letterId));
    
    // Rebuild current word
    const newWord = selectedLetters.filter(l => l.id !== letterId).map(l => l.letter).join('');
    setCurrentWord(newWord);
  };

  const submitWord = () => {
    if (currentWord.length < 2) {
      setFeedback('❌ Word must be at least 2 letters long');
      setTimeout(() => setFeedback(''), 2000);
      return;
    }

    const validWords = getValidWords(level);
    if (!validWords.includes(currentWord)) {
      setFeedback('❌ Not a valid German word');
      setTimeout(() => setFeedback(''), 2000);
      return;
    }

    if (formedWords.includes(currentWord)) {
      setFeedback('❌ Word already used');
      setTimeout(() => setFeedback(''), 2000);
      return;
    }

    // Valid word!
    const wordScore = currentWord.length * 10;
    setScore(score + wordScore);
    setFormedWords([...formedWords, currentWord]);
    setFeedback(`✅ +${wordScore} points for "${currentWord}"!`);
    
    // Return letters to available pool
    setAvailableLetters([...availableLetters, ...selectedLetters]);
    setSelectedLetters([]);
    setCurrentWord('');
    
    setTimeout(() => setFeedback(''), 2000);
  };

  const clearWord = () => {
    setAvailableLetters([...availableLetters, ...selectedLetters]);
    setSelectedLetters([]);
    setCurrentWord('');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const submitScore = async (finalScore) => {
    try {
      const response = await axios.post('/api/v1/game/complete', {
        scenario,
        level,
        gameType: 'scrabble',
        score: finalScore
      }, {
        withCredentials: true
      });
      
      if (response.data.success) {
        const resultParams = new URLSearchParams({
          scenario,
          gameType: 'scrabble',
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔠</div>
          <h2 className="text-2xl font-bold text-gray-800">Loading Scrabble Game...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4">
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
              <span className="font-semibold">Time: {formatTime(gameTime)}</span>
            </div>
            <div className="bg-white rounded-lg px-4 py-2 shadow">
              <span className="font-semibold">Words: {formedWords.length}</span>
            </div>
            <Button
              onClick={initializeGame}
              variant="outline"
              size="sm"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        {/* Game Info */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Scrabble Challenge</h1>
          <p className="text-gray-600">Form as many German words as possible from the available letters</p>
          <p className="text-sm text-gray-500">Level: {level} | Scenario: {scenario}</p>
        </div>

        {/* Game Content */}
        <div className="max-w-2xl mx-auto">
          {!gameActive && formedWords.length === 0 && (
            <div className="text-center mb-6">
              <Button
                onClick={startGame}
                className="bg-green-500 hover:bg-green-600 text-lg px-8 py-4"
              >
                Start Game
              </Button>
              <p className="text-gray-600 mt-2">You have 5 minutes to form as many words as possible!</p>
            </div>
          )}

          {gameActive || formedWords.length > 0 ? (
            <>
              {/* Current Word */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-center text-gray-700 mb-3">Current Word:</h3>
                <div className="flex justify-center mb-4">
                  <div className="flex gap-2 min-h-12 border-2 border-dashed border-gray-300 rounded-lg p-2">
                    {selectedLetters.map((letter) => (
                      <button
                        key={letter.id}
                        onClick={() => handleSelectedLetterClick(letter.id)}
                        className="w-12 h-12 bg-blue-500 text-white font-bold text-xl rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        {letter.letter}
                      </button>
                    ))}
                    {selectedLetters.length === 0 && (
                      <div className="text-gray-400 flex items-center px-4">
                        Click letters below to form a word
                      </div>
                    )}
                  </div>
                </div>

                {/* Feedback */}
                {feedback && (
                  <div className="text-center mb-4">
                    <p className="text-lg font-semibold">{feedback}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={submitWord}
                    disabled={currentWord.length < 2 || !gameActive}
                    className="bg-green-500 hover:bg-green-600 flex items-center"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Submit Word
                  </Button>
                  <Button
                    onClick={clearWord}
                    variant="outline"
                    disabled={selectedLetters.length === 0}
                  >
                    Clear
                  </Button>
                  {gameActive && (
                    <Button
                      onClick={endGame}
                      variant="destructive"
                    >
                      End Game
                    </Button>
                  )}
                </div>
              </div>

              {/* Available Letters */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-center text-gray-700 mb-3">Available Letters:</h3>
                <div className="flex justify-center">
                  <div className="flex flex-wrap gap-2">
                    {availableLetters.map((letter) => (
                      <button
                        key={letter.id}
                        onClick={() => handleLetterClick(letter.id)}
                        disabled={!gameActive}
                        className="w-12 h-12 bg-gray-300 text-gray-800 font-bold text-xl rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50"
                      >
                        {letter.letter}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Formed Words */}
              {formedWords.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-center text-gray-700 mb-3">Your Words:</h3>
                  <div className="flex flex-wrap justify-center gap-2">
                    {formedWords.map((word, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold"
                      >
                        {word} ({word.length * 10} pts)
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Result Modal */}
        <ResultModal
          isOpen={showResult}
          score={score}
          wordsFormed={formedWords.length}
          onPlayAgain={handlePlayAgain}
          onBackToScenario={handleBackToScenario}
        />
      </div>
    </div>
  );
};

export default ScrabbleGameIntegrated;