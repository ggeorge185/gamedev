import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import '../styles/VocabularySets.css'

function VocabularySets() {
  const [sets, setSets] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [newSet, setNewSet] = useState({ 
    name: '', 
    description: '', 
    difficulty: '1'  // Add difficulty to initial state
  })
  const [error, setError] = useState('')

  const difficultyLevels = [
    { value: '1', label: 'Beginner (A1-A2)' },
    { value: '2', label: 'Intermediate (B1-B2)' }
  ]

  useEffect(() => {
    fetchSets()
  }, [])

  function fetchSets() {
    console.log('Fetching sets...'); // Debug log
    axios.get('/api/vocabulary-sets')
        .then(res => {
            console.log('Response:', res.data); // Debug log
            setSets(res.data);
        })
        .catch(err => {
            console.error('Error:', err.response || err); // Detailed error log
            setError(err.message);
        });
  }

  function handleCreate(e) {
    e.preventDefault()
    axios.post('/api/vocabulary-sets', newSet)
      .then(() => {
        fetchSets()
        setNewSet({ name: '', description: '' })
      })
      .catch(err => setError(err.message))
  }

  return (
    <div className="vocabulary-sets">
      <h2>Vocabulary Sets</h2>
      
      <form onSubmit={handleCreate} className="add-set-form">
        <h3>Create New Set</h3>
        <div className="form-group">
          <input
            placeholder="Set Name"
            value={newSet.name}
            onChange={e => setNewSet({...newSet, name: e.target.value})}
            required
          />
          <input
            placeholder="Description"
            value={newSet.description}
            onChange={e => setNewSet({...newSet, description: e.target.value})}
          />
          <select
            value={newSet.difficulty}
            onChange={e => setNewSet({...newSet, difficulty: e.target.value})}
            required
          >
            {difficultyLevels.map(level => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
          <button type="submit">Create Set</button>
        </div>
      </form>

      <div className="sets-list">
        {sets.map(set => (
          <div key={set.id} className="set-card">
            <h3>{set.name}</h3>
            <p>{set.description}</p>
            <p>{set.word_count} words</p>
            <span className={`difficulty difficulty-${set.difficulty}`}>
              {set.difficulty === '1' ? 'Beginner (A1-A2)' : 'Intermediate (B1-B2)'}
            </span>
            <div className="actions">
              <Link to={`/vocabulary/${set.id}`}>View Words</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default VocabularySets