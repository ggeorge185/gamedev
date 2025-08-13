import { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/GameIntegration.css'

function GameIntegration() {
  const [vocabularySets, setVocabularySets] = useState([])
  const [selectedSet, setSelectedSet] = useState(null)
  const [gameData, setGameData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [apiTesting, setApiTesting] = useState({})

  useEffect(() => {
    fetchVocabularySets()
  }, [])

  async function fetchVocabularySets() {
    try {
      const response = await axios.get('/api/vocabulary-sets')
      setVocabularySets(response.data)
    } catch (error) {
      console.error('Failed to fetch vocabulary sets:', error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchGameData(setId) {
    setApiTesting({...apiTesting, [setId]: true})
    try {
      const response = await axios.get(`/api/games/vocabulary-sets/${setId}/words`)
      setGameData(response.data)
      setSelectedSet(setId)
    } catch (error) {
      console.error('Failed to fetch game data:', error)
      setGameData({ error: error.response?.data?.error || 'Failed to fetch data' })
    } finally {
      setApiTesting({...apiTesting, [setId]: false})
    }
  }

  function generateGodotCode() {
    if (!gameData || !gameData.words) return ''

    const godotCode = `# Generated Godot GDScript for Alex Neuanfang
# Vocabulary Set: ${gameData.vocabulary_set.name}

extends Node

var vocabulary_data = {
	"set_info": {
		"id": ${gameData.vocabulary_set.id},
		"name": "${gameData.vocabulary_set.name}",
		"difficulty": "${gameData.vocabulary_set.difficulty}",
		"category": "${gameData.vocabulary_set.category || 'general'}"
	},
	"words": [
${gameData.words.map(word => `		{
			"id": ${word.id},
			"german": "${word.german_word}",
			"english": "${word.english_word}",
			"phonetic": "${word.phonetic_german || ''}"
		}`).join(',\n')}
	]
}

func _ready():
	print("Loaded vocabulary set: ", vocabulary_data.set_info.name)
	print("Total words: ", vocabulary_data.words.size())

func get_random_word_pair():
	var random_index = randi() % vocabulary_data.words.size()
	return vocabulary_data.words[random_index]

func get_all_words():
	return vocabulary_data.words

func get_set_info():
	return vocabulary_data.set_info`

    return godotCode
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
    alert('Code copied to clipboard!')
  }

  if (loading) {
    return <div className="loading">Loading game integration...</div>
  }

  return (
    <div className="game-integration">
      <h2>🎮 Game Integration</h2>
      <p>Test game APIs and generate code for Godot integration.</p>

      <div className="integration-section">
        <h3>📚 Available Vocabulary Sets</h3>
        <div className="sets-grid">
          {vocabularySets.map(set => (
            <div key={set.id} className="set-card">
              <h4>{set.name}</h4>
              <p>{set.description}</p>
              <div className="set-meta">
                <span className="difficulty">{set.difficulty}</span>
                <span className="word-count">{set.word_count} words</span>
              </div>
              <button 
                onClick={() => fetchGameData(set.id)}
                disabled={apiTesting[set.id]}
                className="test-api-button"
              >
                {apiTesting[set.id] ? '⏳ Testing...' : '🧪 Test Game API'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {gameData && (
        <div className="integration-section">
          <h3>🎯 Game API Response</h3>
          
          {gameData.error ? (
            <div className="error-message">
              <h4>❌ API Error</h4>
              <p>{gameData.error}</p>
            </div>
          ) : (
            <>
              <div className="api-result">
                <h4>✅ API Response Successful</h4>
                <div className="response-info">
                  <p><strong>Set Name:</strong> {gameData.vocabulary_set.name}</p>
                  <p><strong>Difficulty:</strong> {gameData.vocabulary_set.difficulty}</p>
                  <p><strong>Category:</strong> {gameData.vocabulary_set.category}</p>
                  <p><strong>Word Count:</strong> {gameData.words.length}</p>
                </div>
              </div>

              <div className="words-preview">
                <h4>📝 Sample Words</h4>
                <div className="words-table">
                  <table>
                    <thead>
                      <tr>
                        <th>German</th>
                        <th>English</th>
                        <th>Phonetic</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gameData.words.slice(0, 5).map(word => (
                        <tr key={word.id}>
                          <td>{word.german_word}</td>
                          <td>{word.english_word}</td>
                          <td>{word.phonetic_german || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {gameData.words.length > 5 && (
                    <p className="more-words">...and {gameData.words.length - 5} more words</p>
                  )}
                </div>
              </div>

              <div className="godot-code">
                <h4>🎮 Generated Godot Code</h4>
                <div className="code-controls">
                  <button 
                    onClick={() => copyToClipboard(generateGodotCode())}
                    className="copy-button"
                  >
                    📋 Copy Code
                  </button>
                </div>
                <pre className="code-block">
                  <code>{generateGodotCode()}</code>
                </pre>
              </div>
            </>
          )}
        </div>
      )}

      <div className="integration-section">
        <h3>📡 API Endpoints for Godot</h3>
        <div className="api-docs">
          <div className="endpoint">
            <h4>GET /api/games/vocabulary-sets/{'{set_id}'}/words</h4>
            <p>Returns vocabulary set data formatted for game integration.</p>
            <div className="endpoint-example">
              <strong>Example:</strong>
              <code>GET http://localhost:5000/api/games/vocabulary-sets/1/words</code>
            </div>
          </div>

          <div className="endpoint">
            <h4>Response Format</h4>
            <pre className="response-format">{`{
  "vocabulary_set": {
    "id": 1,
    "name": "Banking Basics",
    "difficulty": "beginner",
    "category": "banking"
  },
  "words": [
    {
      "id": 1,
      "german_word": "Sparkasse",
      "english_word": "Savings Bank",
      "phonetic_german": "ˈʃpaʁkasə"
    }
  ]
}`}</pre>
          </div>
        </div>
      </div>

      <div className="integration-section">
        <h3>🛠️ Integration Tips</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <h4>🔄 Real-time Updates</h4>
            <p>Vocabulary changes in the admin panel are immediately available through the game API.</p>
          </div>
          <div className="tip-card">
            <h4>🎯 Difficulty Levels</h4>
            <p>Use the difficulty field to implement progressive learning in your game.</p>
          </div>
          <div className="tip-card">
            <h4>🔊 Phonetics</h4>
            <p>Use phonetic data for pronunciation features in your game.</p>
          </div>
          <div className="tip-card">
            <h4>📊 Categories</h4>
            <p>Filter vocabulary by category for themed game modes.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameIntegration