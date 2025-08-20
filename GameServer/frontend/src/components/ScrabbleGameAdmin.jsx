// components/ScrabbleGameAdmin.jsx
import { useState, useEffect } from 'react'
import api from '../utils/api'

function ScrabbleGameAdmin() {
  const [vocabularySets, setVocabularySets] = useState([])
  const [currentVocabSet, setCurrentVocabSet] = useState(null)
  const [selectedVocabSetId, setSelectedVocabSetId] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [apiStatus, setApiStatus] = useState('checking')

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    setLoading(true)
    try {
      await Promise.all([
        loadVocabularySets(),
        loadCurrentVocabularySet(),
        checkApiStatus()
      ])
    } catch (error) {
      console.error('Error loading initial data:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkApiStatus = async () => {
    try {
      await api.get('/health')
      setApiStatus('running')
    } catch (error) {
      setApiStatus('error')
    }
  }

  const loadVocabularySets = async () => {
    try {
      const response = await api.get('/api/vocabulary-sets')
      setVocabularySets(response.data)
    } catch (error) {
      console.error('Error loading vocabulary sets:', error)
      setMessage('Error loading vocabulary sets')
    }
  }

  const loadCurrentVocabularySet = async () => {
    try {
      const response = await api.get('/api/admin/game/vocabulary-set')
      setCurrentVocabSet(response.data)
    } catch (error) {
      console.error('Error loading current vocabulary set:', error)
      setCurrentVocabSet(null)
    }
  }

  const setVocabularySet = async () => {
    if (!selectedVocabSetId) {
      setMessage('Please select a vocabulary set')
      return
    }

    try {
      const response = await api.post('/api/admin/game/vocabulary-set', {
        vocabulary_set_id: parseInt(selectedVocabSetId)
      })
      
      setMessage(`✓ ${response.data.message}`)
      await loadCurrentVocabularySet()
      setSelectedVocabSetId('')
      
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error setting vocabulary set:', error)
      setMessage(`Error: ${error.response?.data?.error || 'Failed to set vocabulary set'}`)
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      'running': { text: '✓ API Running', class: 'badge-success' },
      'error': { text: '✗ API Not Running', class: 'badge-error' },
      'checking': { text: '⟳ Checking...', class: 'badge-warning' }
    }
    return badges[status] || badges.checking
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading scrabble game settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Scrabble Game Administration</h1>
        <p>Control which vocabulary set is used in the word search game</p>
      </div>

      {/* API Status */}
      <div className="status-card">
        <h3>System Status</h3>
        <div className="status-row">
          <span>API Server:</span>
          <span className={`badge ${getStatusBadge(apiStatus).class}`}>
            {getStatusBadge(apiStatus).text}
          </span>
        </div>
      </div>

      <div className="vocab-card current-vocab">
        <h3>Current Scrabble Game Vocabulary Set</h3>
        {currentVocabSet ? (
          <div className="vocab-info">
            <div className="vocab-name">{currentVocabSet.vocabulary_set_name}</div>
            <div className="vocab-details">
              <span className="category">Category: {currentVocabSet.category_name}</span>
              <span className="word-count">Words: {currentVocabSet.word_count}</span>
            </div>
          </div>
        ) : (
          <div className="no-vocab">
            <span className="error-text">⚠️ No vocabulary set configured</span>
            <p>Please select a vocabulary set below to enable the scrabble game.</p>
          </div>
        )}
      </div>

      {/* Change Vocabulary Set */}
      <div className="vocab-card">
        <h3>Change Scrabble Game Vocabulary Set</h3>
        
        <div className="form-group">
          <label htmlFor="vocabSelect">Select Vocabulary Set:</label>
          <select 
            id="vocabSelect"
            value={selectedVocabSetId}
            onChange={(e) => setSelectedVocabSetId(e.target.value)}
            className="form-select"
          >
            <option value="">Choose a vocabulary set...</option>
            {vocabularySets.map(set => (
              <option key={set.id} value={set.id}>
                {set.name} ({set.category_name || 'No category'}) - {set.word_count || 0} words
              </option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <button 
            onClick={setVocabularySet}
            disabled={!selectedVocabSetId}
            className="btn btn-primary"
          >
            Set for Scrabble Game
          </button>
          
          <button 
            onClick={loadCurrentVocabularySet}
            className="btn btn-secondary"
          >
            Refresh Status
          </button>
        </div>

        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}
      </div>

      <style jsx>{`
        .container {
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
        }

        .header {
          text-align: center;
          margin-bottom: 30px;
        }

        .header h1 {
          color: #2c3e50;
          margin-bottom: 10px;
        }

        .header p {
          color: #7f8c8d;
          font-size: 16px;
        }

        .status-card, .vocab-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 20px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          border: 1px solid #e1e8ed;
        }

        .status-card h3, .vocab-card h3 {
          color: #2c3e50;
          margin-bottom: 16px;
          font-size: 18px;
        }

        .status-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
        }

        .badge-success {
          background-color: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .badge-error {
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .badge-warning {
          background-color: #fff3cd;
          color: #856404;
          border: 1px solid #ffeaa7;
        }

        .current-vocab {
          border-left: 4px solid #27ae60;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }

        .vocab-info {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .vocab-name {
          font-size: 20px;
          font-weight: 600;
          color: #2c3e50;
        }

        .vocab-details {
          display: flex;
          gap: 20px;
          color: #7f8c8d;
        }

        .category, .word-count {
          background: #ecf0f1;
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 14px;
        }

        .no-vocab {
          text-align: center;
          padding: 20px;
        }

        .error-text {
          color: #e74c3c;
          font-size: 18px;
          font-weight: 500;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #2c3e50;
        }

        .form-select {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #ddd;
          border-radius: 8px;
          font-size: 16px;
          background: white;
          transition: border-color 0.3s ease;
        }

        .form-select:focus {
          outline: none;
          border-color: #3498db;
          box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
        }

        .form-actions {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
        }

        .btn {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-primary {
          background: #3498db;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #2980b9;
          transform: translateY(-1px);
        }

        .btn-secondary {
          background: #95a5a6;
          color: white;
        }

        .btn-secondary:hover {
          background: #7f8c8d;
        }

        .message {
          padding: 12px 16px;
          border-radius: 8px;
          font-weight: 500;
        }

        .message.success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .message.error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .instructions {
          background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
          color: white;
        }

        .instructions h3 {
          color: white;
        }

        .instructions ol {
          margin: 20px 0;
          padding-left: 20px;
        }

        .instructions li {
          margin-bottom: 8px;
          line-height: 1.5;
        }

        .game-link {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
        }

        .game-link a {
          color: #fff;
          text-decoration: underline;
        }

        .note {
          font-size: 14px;
          opacity: 0.9;
          margin-top: 8px;
        }

        .loading-spinner {
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
          border-top: 4px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .container {
            padding: 15px;
          }
          
          .vocab-details {
            flex-direction: column;
            gap: 8px;
          }
          
          .form-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}

export default ScrabbleGameAdmin