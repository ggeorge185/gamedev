import { useState } from 'react'
import axios from 'axios'
import '../styles/AddGame.css'

function AddGame() {
  const [form, setForm] = useState({ 
    title: '', 
    type: '', 
    time_limit: '', 
    pairs: '[]' 
  })
  const [addResult, setAddResult] = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    let pairs
    try {
      pairs = JSON.parse(form.pairs || '[]')
    } catch {
      setAddResult('Invalid JSON for pairs!')
      return
    }
    
    axios.post('/api/memory_game/info', {
      title: form.title,
      type: form.type,
      time_limit: parseInt(form.time_limit),
      pairs
    })
      .then(res => {
        setAddResult('Game added successfully!')
        setForm({ title: '', type: '', time_limit: '', pairs: '[]' })
      })
      .catch(err => setAddResult(err.message))
  }

  return (
    <div className="add-game">
      <h2>Add New Game</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="type">Type</label>
          <input
            id="type"
            name="type"
            value={form.type}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="time_limit">Time Limit (seconds)</label>
          <input
            id="time_limit"
            name="time_limit"
            type="number"
            value={form.time_limit}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="pairs">Pairs (JSON array)</label>
          <textarea
            id="pairs"
            name="pairs"
            value={form.pairs}
            onChange={handleChange}
            rows={4}
          />
        </div>

        <button type="submit">Add Game</button>
      </form>
      {addResult && <div className="result-message">{addResult}</div>}
    </div>
  )
}

export default AddGame