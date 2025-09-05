import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { HelpCircle, CheckCircle, RotateCcw, Clock } from 'lucide-react';

const QuizGame = ({ scenario, difficulty, instructions, words, onGameComplete }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [questions, setQuestions] = useState([]);

  // Fallback words if none provided from MongoDB
  const fallbackWords = [
    { 
      germanWordSingular: 'Haus', 
      englishTranslation: 'house',
      englishDescription: 'A building where people live'
    },
    { 
      germanWordSingular: 'Auto', 
      englishTranslation: 'car',
      englishDescription: 'A motor vehicle with four wheels'
    },
    { 
      germanWordSingular: 'Buch', 
      englishTranslation: 'book',
      englishDescription: 'Something you read with pages'
    },
    { 
      germanWordSingular: 'Wasser', 
      englishTranslation: 'water',
      englishDescription: 'Clear liquid that you drink'
    },
    { 
      germanWordSingular: 'Katze', 
      englishTranslation: 'cat',
      englishDescription: 'A small domestic animal that meows'
    }
  ];

  const gameWords = words.length > 0 ? words : fallbackWords;

  // Generate quiz questions
  useEffect(() => {
    if (gameStarted) {
      const quizQuestions = gameWords.slice(0, 5).map((word, index) => {
        // Create wrong answers by mixing up other words' translations
        const wrongAnswers = gameWords
          .filter(w => w.englishTranslation !== word.englishTranslation)
          .slice(0, 3)
          .map(w => w.englishTranslation);
        
        // Ensure we have enough wrong answers
        while (wrongAnswers.length < 3) {
          const fallbackWrongs = ['wrong', 'incorrect', 'false'];
          wrongAnswers.push(fallbackWrongs[wrongAnswers.length] || 'other');
        }

        const allAnswers = [word.englishTranslation, ...wrongAnswers.slice(0, 3)];
        
        return {
          id: index,
          question: `What does "${word.germanWordSingular}" mean in English?`,
          germanWord: word.germanWordSingular,
          correctAnswer: word.englishTranslation,
          description: word.englishDescription,
          options: allAnswers.sort(() => Math.random() - 0.5), // Shuffle answers
        };
      });
      
      setQuestions(quizQuestions);
    }
  }, [gameStarted, gameWords]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleGameStart = () => {
    setGameStarted(true);
    setCurrentQuestionIndex(0);
    setScore(0);
    setGameCompleted(false);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleAnswerSelect = (answer) => {
    if (showResult) return; // Prevent changing answer after showing result
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(score + 20);
    }

    setShowResult(true);
    
    // Auto advance after 2 seconds
    setTimeout(() => {
      if (currentQuestionIndex + 1 >= questions.length) {
        setGameCompleted(true);
        const finalScore = isCorrect ? score + 20 : score;
        if (onGameComplete) {
          onGameComplete(finalScore);
        }
      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      }
    }, 2000);
  };

  const resetGame = () => {
    setGameStarted(false);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setGameCompleted(false);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  if (!gameStarted) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <HelpCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Quiz Game
        </h2>
        <div className="mb-6 space-y-2">
          <p className="text-lg text-gray-700">
            Test your German vocabulary knowledge!
          </p>
          <p className="text-sm text-gray-600">
            <strong>Scenario:</strong> {scenario?.name || 'General'}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Difficulty:</strong> {difficulty}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Questions:</strong> {Math.min(gameWords.length, 5)}
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
          className="bg-green-600 hover:bg-green-700"
          size="lg"
        >
          Start Quiz
        </Button>
      </div>
    );
  }

  if (gameCompleted) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Quiz Complete!
        </h2>
        <div className="mb-6 space-y-4">
          <div className="text-2xl font-bold text-green-600">
            Final Score: {score} points
          </div>
          <div className="text-lg text-gray-700">
            You answered {score / 20} out of {questions.length} questions correctly!
          </div>
          <div className="text-sm text-gray-600">
            {score === questions.length * 20 ? 'Perfect score! 🎉' : 
             score >= questions.length * 15 ? 'Great job! 👏' :
             score >= questions.length * 10 ? 'Good effort! 👍' : 'Keep practicing! 💪'}
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

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg text-gray-600">Loading question...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Game Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <HelpCircle className="w-8 h-8 text-green-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Quiz Game</h2>
            <p className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{score}</div>
          <div className="text-xs text-gray-500">Score</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <div className="bg-green-50 p-6 rounded-lg text-center">
          <div className="text-lg font-medium text-green-800 mb-2">
            {currentQuestion.question}
          </div>
          <div className="text-3xl font-bold text-green-600">
            {currentQuestion.germanWord}
          </div>
          {currentQuestion.description && showResult && (
            <div className="text-sm text-green-600 mt-2 italic">
              {currentQuestion.description}
            </div>
          )}
        </div>
      </div>

      {/* Answer Options */}
      <div className="space-y-3 mb-6">
        {currentQuestion.options.map((option, index) => {
          let buttonClass = "w-full p-4 text-left border-2 rounded-lg transition-all ";
          
          if (showResult) {
            if (option === currentQuestion.correctAnswer) {
              buttonClass += "bg-green-100 border-green-500 text-green-800";
            } else if (option === selectedAnswer && option !== currentQuestion.correctAnswer) {
              buttonClass += "bg-red-100 border-red-500 text-red-800";
            } else {
              buttonClass += "bg-gray-50 border-gray-200 text-gray-600";
            }
          } else {
            if (selectedAnswer === option) {
              buttonClass += "bg-blue-100 border-blue-500 text-blue-800";
            } else {
              buttonClass += "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100";
            }
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              className={buttonClass}
              disabled={showResult}
            >
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center mr-3 text-sm font-bold">
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="font-medium">{option}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Submit Button */}
      {!showResult && (
        <div className="text-center">
          <Button
            onClick={handleSubmitAnswer}
            disabled={!selectedAnswer}
            className="bg-green-600 hover:bg-green-700 px-8 py-3"
          >
            Submit Answer
          </Button>
        </div>
      )}

      {/* Result Display */}
      {showResult && (
        <div className="text-center">
          <div className={`text-lg font-semibold mb-2 ${
            selectedAnswer === currentQuestion.correctAnswer ? 'text-green-600' : 'text-red-600'
          }`}>
            {selectedAnswer === currentQuestion.correctAnswer ? '✓ Correct!' : '✗ Incorrect'}
          </div>
          {selectedAnswer !== currentQuestion.correctAnswer && (
            <div className="text-sm text-gray-600">
              The correct answer was: <strong>{currentQuestion.correctAnswer}</strong>
            </div>
          )}
          <div className="text-sm text-gray-500 mt-2">
            {currentQuestionIndex + 1 < questions.length ? 'Next question in 2 seconds...' : 'Calculating final score...'}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizGame;