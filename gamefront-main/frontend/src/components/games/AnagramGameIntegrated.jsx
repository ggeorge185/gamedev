import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from '../ui/button';
import { ArrowLeft, RotateCcw, Check, X } from 'lucide-react';
import axios from 'axios';

// Result Modal Component
const ResultModal = ({ isOpen, success, score, wordsCompleted, onPlayAgain, onBackToScenario }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 text-center shadow-2xl max-w-sm w-full mx-4">
        <h2 className={`text-3xl font-bold mb-4 ${success ? 'text-green-600' : 'text-red-600'}`}>
          {success ? '🎉 Excellent!' : '💪 Good Try!'}
        </h2>
        <p className="text-gray-700 mb-2">
          You completed {wordsCompleted} words correctly!
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

const AnagramGameIntegrated = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useSelector((store) => store.auth);
  
  const level = searchParams.get('level') || user?.currentLevel || 'A1';
  const scenario = searchParams.get('scenario') || 'city_registration';

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [words, setWords] = useState([]);
  const [scrambledLetters, setScrambledLetters] = useState([]);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [score, setScore] = useState(0);
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);

  // Sample words for anagram game
  const getWords = (level) => {
    const wordLists = {
      A1: [
        { german: 'HAUS', english: 'house', hint: 'A place where people live' },
        { german: 'AUTO', english: 'car', hint: 'A vehicle for transportation' },
        { german: 'HUND', english: 'dog', hint: 'A loyal pet animal' },
        { german: 'BUCH', english: 'book', hint: 'Something you read' },
        { german: 'ZEIT', english: 'time', hint: 'It never stops moving' }
      ],
      A2: [
        { german: 'FREUND', english: 'friend', hint: 'Someone you like spending time with' },
        { german: 'SCHULE', english: 'school', hint: 'Where students learn' },
        { german: 'FAMILIE', english: 'family', hint: 'Your relatives' },
        { german: 'ARBEITEN', english: 'to work', hint: 'What you do at your job' },
        { german: 'GARTEN', english: 'garden', hint: 'Where flowers and plants grow' }
      ]
    };
    return wordLists[level] || wordLists.A1;
  };

  useEffect(() => {
    initializeGame();
  }, [level]);

  const initializeGame = () => {
    setLoading(true);
    const gameWords = getWords(level);
    setWords(gameWords);
    setCurrentWordIndex(0);
    setScore(0);
    setWordsCompleted(0);
    setGameOver(false);
    setShowResult(false);
    setFeedback('');
    scrambleWord(gameWords[0]);
    setLoading(false);
  };

  const scrambleWord = (word) => {
    const letters = word.german.split('');
    const scrambled = letters.sort(() => Math.random() - 0.5);
    setScrambledLetters(scrambled.map((letter, index) => ({ letter, id: index })));
    setSelectedLetters([]);
  };

  const handleLetterClick = (letterId) => {
    const letter = scrambledLetters.find(l => l.id === letterId);
    if (!letter) return;

    setSelectedLetters([...selectedLetters, letter]);
    setScrambledLetters(scrambledLetters.filter(l => l.id !== letterId));
  };

  const handleSelectedLetterClick = (letterId) => {
    const letter = selectedLetters.find(l => l.id === letterId);
    if (!letter) return;

    setScrambledLetters([...scrambledLetters, letter]);
    setSelectedLetters(selectedLetters.filter(l => l.id !== letterId));
  };

  const checkAnswer = () => {
    const currentWord = words[currentWordIndex];
    const formedWord = selectedLetters.map(l => l.letter).join('');
    
    if (formedWord === currentWord.german) {
      // Correct answer
      const newScore = score + 20;
      const newWordsCompleted = wordsCompleted + 1;
      setScore(newScore);
      setWordsCompleted(newWordsCompleted);
      setFeedback('✅ Correct! Well done!');
      
      setTimeout(() => {
        if (currentWordIndex + 1 >= words.length) {
          // Game completed
          setGameOver(true);
          setShowResult(true);
          submitScore(newScore);
        } else {
          // Next word
          const nextIndex = currentWordIndex + 1;
          setCurrentWordIndex(nextIndex);
          scrambleWord(words[nextIndex]);
          setFeedback('');
        }
      }, 1500);
    } else {
      // Wrong answer
      setFeedback('❌ Try again! Check the spelling.');
      setTimeout(() => setFeedback(''), 2000);
    }
  };

  const skipWord = () => {
    if (currentWordIndex + 1 >= words.length) {
      setGameOver(true);
      setShowResult(true);
      submitScore(score);
    } else {
      const nextIndex = currentWordIndex + 1;
      setCurrentWordIndex(nextIndex);
      scrambleWord(words[nextIndex]);
      setFeedback('');
    }
  };

  const submitScore = async (finalScore) => {
    try {
      const response = await axios.post('/api/v1/game/complete', {
        scenario,
        level,
        gameType: 'anagrams',
        score: finalScore
      }, {
        withCredentials: true
      });
      
      if (response.data.success) {
        const resultParams = new URLSearchParams({
          scenario,
          gameType: 'anagrams',
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔤</div>
          <h2 className="text-2xl font-bold text-gray-800">Loading Anagram Game...</h2>
        </div>
      </div>
    );
  }

  const currentWord = words[currentWordIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
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
              <span className="font-semibold">Words: {wordsCompleted}/{words.length}</span>
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Anagram Challenge</h1>
          <p className="text-gray-600">Unscramble the letters to form German words</p>
          <p className="text-sm text-gray-500">Level: {level} | Scenario: {scenario}</p>
        </div>

        {/* Game Content */}
        <div className="max-w-2xl mx-auto">
          {/* Current Word Info */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Word {currentWordIndex + 1} of {words.length}
              </h3>
              <p className="text-gray-600">
                <strong>Hint:</strong> {currentWord.hint}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                English: {currentWord.english}
              </p>
            </div>

            {/* Feedback */}
            {feedback && (
              <div className="text-center mb-4">
                <p className="text-lg font-semibold">{feedback}</p>
              </div>
            )}

            {/* Selected Letters (Answer Area) */}
            <div className="mb-6">
              <h4 className="text-center text-gray-700 mb-3">Your Answer:</h4>
              <div className="flex justify-center min-h-16">
                <div className="flex flex-wrap gap-2 min-h-12 border-2 border-dashed border-gray-300 rounded-lg p-2">
                  {selectedLetters.map((letter) => (
                    <button
                      key={letter.id}
                      onClick={() => handleSelectedLetterClick(letter.id)}
                      className="w-12 h-12 bg-blue-500 text-white font-bold text-xl rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      {letter.letter}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Available Letters */}
            <div className="mb-6">
              <h4 className="text-center text-gray-700 mb-3">Available Letters:</h4>
              <div className="flex justify-center">
                <div className="flex flex-wrap gap-2">
                  {scrambledLetters.map((letter) => (
                    <button
                      key={letter.id}
                      onClick={() => handleLetterClick(letter.id)}
                      className="w-12 h-12 bg-gray-300 text-gray-800 font-bold text-xl rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      {letter.letter}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <Button
                onClick={checkAnswer}
                disabled={selectedLetters.length === 0}
                className="bg-green-500 hover:bg-green-600 flex items-center"
              >
                <Check className="w-4 h-4 mr-2" />
                Check Answer
              </Button>
              <Button
                onClick={skipWord}
                variant="outline"
                className="flex items-center"
              >
                <X className="w-4 h-4 mr-2" />
                Skip Word
              </Button>
            </div>
          </div>
        </div>

        {/* Result Modal */}
        <ResultModal
          isOpen={showResult}
          success={gameOver}
          score={score}
          wordsCompleted={wordsCompleted}
          onPlayAgain={handlePlayAgain}
          onBackToScenario={handleBackToScenario}
        />
      </div>
    </div>
  );
};

export default AnagramGameIntegrated;