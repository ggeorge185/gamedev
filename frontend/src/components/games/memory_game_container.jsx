import React, { useState, useEffect } from 'react';
import MemoryGame from './memory-game.jsx';
import axios from 'axios';
import { toast } from 'sonner';

const MemoryGameContainer = ({ scenario, difficulty, instructions, onGameComplete }) => {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWords();
  }, [scenario, difficulty]);

  const fetchWords = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/v1/word/search', {
        params: {
          level: difficulty,
          topic: scenario?.name || '',
          limit: 8  // 8 pairs = 16 cards
        }
      });
      
      if (res.data.success && res.data.words) {
        setWords(res.data.words);
      } else {
        setWords([]);
        toast.info('Using default word set for this scenario');
      }
    } catch (error) {
      console.error('Error fetching words:', error);
      setWords([]);
      toast.error('Failed to load words');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg text-gray-600">Loading memory game...</div>
      </div>
    );
  }

  return (
    <MemoryGame
      scenario={scenario}
      difficulty={difficulty}
      instructions={instructions}
      words={words}
      onGameComplete={onGameComplete}
    />
  );
};

export default MemoryGameContainer;