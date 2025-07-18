import { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/MemoryPairs.css'

function MemoryPairs() {
  const [pairs, setPairs] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [newPair, setNewPair] = useState({ word_de: '', word_en: '' })
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPairs()
  }, [])

  function fetchPairs() {
    axios.get('/api/memory_game/pairs')
      .then(res => setPairs(res.data))
      .catch(err => setError(err.message))
  }

  function handleCreate(e) {
    e.preventDefault()
    axios.post('/api/memory_game/pairs', newPair)
      .then(() => {
        fetchPairs()
        setNewPair({ word_de: '', word_en: '' })
      })
      .catch(err => setError(err.message))
  }

  function handleUpdate(id, updatedPair) {
    axios.put(`/api/memory_game/pairs/${id}`, updatedPair)
      .then(() => {
        fetchPairs()
        setEditingId(null)
      })
      .catch(err => setError(err.message))
  }

  function handleDelete(id) {
    if (window.confirm('Are you sure you want to delete this pair?')) {
      axios.delete(`/api/memory_game/pairs/${id}`)
        .then(() => fetchPairs())
        .catch(err => setError(err.message))
    }
  }

  return (
    <div className="memory-pairs">
      <h2>Memory Pairs Management</h2>
      
      {/* Create new pair form */}
      <form onSubmit={handleCreate} className="add-pair-form">
        <h3>Add New Pair</h3>
        <div className="form-group">
          <input
            placeholder="German Word"
            value={newPair.word_de}
            onChange={e => setNewPair({...newPair, word_de: e.target.value})}
            required
          />
          <input
            placeholder="English Word"
            value={newPair.word_en}
            onChange={e => setNewPair({...newPair, word_en: e.target.value})}
            required
          />
          <button type="submit">Add Pair</button>
        </div>
      </form>

      {/* Error message */}
      {error && <div className="error-message">{error}</div>}

      {/* Pairs list */}
      <div className="pairs-list">
        {pairs.map(pair => (
          <div key={pair.id} className="pair-card">
            {editingId === pair.id ? (
              // Edit form
              <form onSubmit={e => {
                e.preventDefault()
                handleUpdate(pair.id, {
                  word_de: e.target.word_de.value,
                  word_en: e.target.word_en.value
                })
              }}>
                <input 
                  name="word_de"
                  defaultValue={pair.word_de}
                  required
                />
                <input 
                  name="word_en"
                  defaultValue={pair.word_en}
                  required
                />
                <div className="actions">
                  <button type="submit">Save</button>
                  <button type="button" onClick={() => setEditingId(null)}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              // Display mode
              <>
                <div className="pair-content">
                  <p><strong>DE:</strong> {pair.word_de}</p>
                  <p><strong>EN:</strong> {pair.word_en}</p>
                </div>
                <div className="actions">
                  <button onClick={() => setEditingId(pair.id)}>Edit</button>
                  <button onClick={() => handleDelete(pair.id)}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default MemoryPairs