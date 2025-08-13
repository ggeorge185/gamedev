import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import '../styles/Vocabulary.css'

function Vocabulary() {
  const { setId } = useParams()
  const [vocabulary, setVocabulary] = useState([])
  const [currentSet, setCurrentSet] = useState(null)
  const [error, setError] = useState('')
  const [newWord, setNewWord] = useState({
    word_de: '',
    word_en: '',
    phonetic_de: '',
    word_type: '',
    difficulty: '1',
    set_id: setId
  })

  const wordTypes = ['noun', 'verb', 'adjective', 'adverb', 'preposition', 'other']
  const difficultyLevels = [
    { value: '1', label: 'Beginner' },
    { value: '2', label: 'Elementary' },
    { value: '3', label: 'Intermediate' },
    { value: '4', label: 'Advanced' },
    { value: '5', label: 'Expert' }
  ]

  useEffect(() => {
    fetchSetDetails()
    fetchVocabulary()
  }, [setId])

  function fetchSetDetails() {
    axios.get(`/api/vocabulary-sets/${setId}`)
      .then(res => setCurrentSet(res.data))
      .catch(err => setError(err.message))
  }

  function fetchVocabulary() {
    axios.get(`/api/vocabulary?set_id=${setId}`)
      .then(res => setVocabulary(res.data))
      .catch(err => setError(err.message))
  }

  function handleCreate(e) {
    e.preventDefault()
    axios.post('/api/vocabulary', newWord)
      .then(() => {
        fetchVocabulary()
        setNewWord({
          word_de: '',
          word_en: '',
          phonetic_de: '',
          word_type: '',
          difficulty: '1',
          set_id: setId
        })
      })
      .catch(err => setError(err.message))
  }

  function handleUpdate(id, updatedWord) {
    axios.put(`/api/vocabulary/${id}`, updatedWord)
      .then(() => {
        fetchVocabulary()
        setEditingId(null)
      })
      .catch(err => setError(err.message))
  }

  function handleDelete(id) {
    if (window.confirm('Are you sure you want to delete this word?')) {
      axios.delete(`/api/vocabulary/${id}`)
        .then(() => fetchVocabulary())
        .catch(err => setError(err.message))
    }
  }

  return (
    <div className="vocabulary">
      <h2>Vocabulary Management</h2>
      
      {/* Create new word form */}
      <form onSubmit={handleCreate} className="add-word-form">
        <h3>Add New Word</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>German Word</label>
            <input
              placeholder="Enter German word"
              value={newWord.word_de}
              onChange={e => setNewWord({...newWord, word_de: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label>English Word</label>
            <input
              placeholder="Enter English word"
              value={newWord.word_en}
              onChange={e => setNewWord({...newWord, word_en: e.target.value})}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Phonetic (German)</label>
            <input
              placeholder="Enter phonetic spelling"
              value={newWord.phonetic_de}
              onChange={e => setNewWord({...newWord, phonetic_de: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label>Word Type</label>
            <select
              value={newWord.word_type}
              onChange={e => setNewWord({...newWord, word_type: e.target.value})}
              required
            >
              <option value="">Select type</option>
              {wordTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Difficulty</label>
            <select
              value={newWord.difficulty}
              onChange={e => setNewWord({...newWord, difficulty: e.target.value})}
              required
            >
              {difficultyLevels.map(level => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button type="submit">Add Word</button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {/* Vocabulary list */}
      <div className="vocabulary-list">
        {vocabulary.map(word => (
          <div key={word.id} className="word-card">
            {editingId === word.id ? (
              <form onSubmit={e => {
                e.preventDefault()
                handleUpdate(word.id, {
                  word_de: e.target.word_de.value,
                  word_en: e.target.word_en.value,
                  phonetic_de: e.target.phonetic_de.value,
                  word_type: e.target.word_type.value,
                  difficulty: e.target.difficulty.value
                })
              }}>
                <div className="form-grid">
                  <input name="word_de" defaultValue={word.word_de} required />
                  <input name="word_en" defaultValue={word.word_en} required />
                  <input name="phonetic_de" defaultValue={word.phonetic_de} />
                  <select name="word_type" defaultValue={word.word_type} required>
                    {wordTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <select name="difficulty" defaultValue={word.difficulty} required>
                    {difficultyLevels.map(level => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="actions">
                  <button type="submit">Save</button>
                  <button type="button" onClick={() => setEditingId(null)}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="word-content">
                  <div className="word-header">
                    <h3>{word.word_de}</h3>
                    <span className={`difficulty difficulty-${word.difficulty}`}>
                      {difficultyLevels.find(l => l.value === word.difficulty)?.label}
                    </span>
                  </div>
                  <p><strong>English:</strong> {word.word_en}</p>
                  <p><strong>Phonetic:</strong> {word.phonetic_de}</p>
                  <p><strong>Type:</strong> {word.word_type}</p>
                </div>
                <div className="actions">
                  <button onClick={() => setEditingId(word.id)}>Edit</button>
                  <button onClick={() => handleDelete(word.id)}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Vocabulary