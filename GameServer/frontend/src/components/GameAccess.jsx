// components/GameAccess.jsx - Component for players to access games
import { useState, useEffect } from 'react'
import api from '../utils/api'

function GameAccess() {
  const [currentVocabSet, setCurrentVocabSet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [gameReady, setGameReady] = useState(false)

  useEffect(() => {
    checkGameStatus()
  }, [])

  const checkGameStatus = async () => {
    try {
      const response = await api.get('/api/game/current-vocabulary')
      setCurrentVocabSet(response.data.vocabulary_set)
      setGameReady(true)
    } catch (error) {
      console.error('Error checking game status:', error)
      setGameReady(false)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="game-access-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Checking game availability...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="game-access-container">
      <div className="header">
        <h2>🎮 Available Games</h2>
        <p>Choose a game to start learning German vocabulary</p>
      </div>

      {/* Scrabble/Word Search Game */}
      <div className="game-card">
        <div className="game-icon">🔤</div>
        <div className="game-info">
          <h3>German Word Search</h3>
          <p>Find German words hidden in a grid and learn their English meanings</p>
          
          {gameReady && currentVocabSet ? (
            <div className="game-status ready">
              <div className="status-badge">✓ Ready to Play</div>
              <div className="current-topic">
                Current Topic: <strong>{currentVocabSet.name}</strong>
                <span className="category">({currentVocabSet.category})</span>
              </div>
            </div>
          ) : (
            <div className="game-status not-ready">
              <div className="status-badge">⚠️ Not Available</div>
              <p>The administrator needs to configure a vocabulary set for this game.</p>
            </div>
          )}
        </div>
        
        <div className="game-actions">
          {gameReady ? (
            <>
              <button 
                className="btn btn-primary"
                onClick={() => window.open('/game/scrabble', '_blank')}
              >
                Play Game
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => window.open('/game/scrabble?preview=true', '_blank')}
              >
                Preview
              </button>
            </>
          ) : (
            <button className="btn btn-disabled" disabled>
              Game Not Available
            </button>
          )}
        </div>
      </div>

      {/* Memory Game */}
      <div className="game-card">
        <div className="game-icon">🧠</div>
        <div className="game-info">
          <h3>Memory Card Game</h3>
          <p>Match German words with their English translations</p>
          
          <div className="game-status ready">
            <div className="status-badge">✓ Ready to Play</div>
            <div className="current-topic">
              Multiple topics available
            </div>
          </div>
        </div>
        
        <div className="game-actions">
          <button 
            className="btn btn-primary"
            onClick={() => window.open('/game/memory', '_blank')}
          >
            Play Game
          </button>
        </div>
      </div>

      {/* Game Instructions */}
      <div className="instructions-card">
        <h3>How to Play</h3>
        <div className="instruction-grid">
          <div className="instruction">
            <div className="step-number">1</div>
            <div className="step-content">
              <h4>Choose a Game</h4>
              <p>Select from word search or memory games above</p>
            </div>
          </div>
          
          <div className="instruction">
            <div className="step-number">2</div>
            <div className="step-content">
              <h4>Learn Vocabulary</h4>
              <p>Each game teaches German words with English translations</p>
            </div>
          </div>
          
          <div className="instruction">
            <div className="step-number">3</div>
            <div className="step-content">
              <h4>Practice & Progress</h4>
              <p>Complete challenges to improve your German skills</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .game-access-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px;
        }

        .header {
          text-align: center;
          margin-bottom: 40px;
        }

        .header h2 {
          color: #2c3e50;
          margin-bottom: 8px;
          font-size: 28px;
        }

        .header p {
          color: #7f8c8d;
          font-size: 16px;
        }

        .game-card {
          display: flex;
          align-items: center;
          gap: 20px;
          background: white;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 20px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          border: 1px solid #e1e8ed;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .game-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
        }

        .game-icon {
          font-size: 48px;
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          flex-shrink: 0;
        }

        .game-info {
          flex: 1;
        }

        .game-info h3 {
          color: #2c3e50;
          margin: 0 0 8px 0;
          font-size: 20px;
        }

        .game-info p {
          color: #7f8c8d;
          margin: 0 0 16px 0;
          line-height: 1.5;
        }

        .game-status {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
          width: fit-content;
        }

        .game-status.ready .status-badge {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .game-status.not-ready .status-badge {
          background: #fff3cd;
          color: #856404;
          border: 1px solid #ffeaa7;
        }

        .current-topic {
          font-size: 14px;
          color: #495057;
        }

        .category {
          color: #6c757d;
          font-style: italic;
        }

        .game-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex-shrink: 0;
        }

        .btn {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          text-align: center;
          min-width: 120px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
        }

        .btn-secondary:hover {
          background: #5a6268;
        }

        .btn-disabled {
          background: #e9ecef;
          color: #6c757d;
          cursor: not-allowed;
        }

        .instructions-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 16px;
          padding: 32px;
          margin-top: 40px;
        }

        .instructions-card h3 {
          color: white;
          margin-bottom: 24px;
          font-size: 24px;
          text-align: center;
        }

        .instruction-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
        }

        .instruction {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }

        .step-number {
          width: 36px;
          height: 36px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          flex-shrink: 0;
        }

        .step-content h4 {
          margin: 0 0 8px 0;
          font-size: 16px;
        }

        .step-content p {
          margin: 0;
          opacity: 0.9;
          line-height: 1.4;
        }

        .loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .game-card {
            flex-direction: column;
            text-align: center;
          }

          .game-actions {
            flex-direction: row;
            justify-content: center;
          }

          .instruction-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

export default GameAccess