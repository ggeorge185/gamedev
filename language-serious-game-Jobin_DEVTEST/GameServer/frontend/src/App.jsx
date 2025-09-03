import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import GameInfo from './components/GameInfo'
import AddGame from './components/AddGame'
import MemoryPairs from './components/MemoryPairs'
import VocabularySets from './components/VocabularySets'
import Vocabulary from './components/Vocabulary'
import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [gameInfo, setGameInfo] = useState([])
  const [memoryPairs, setMemoryPairs] = useState([])
  const [form, setForm] = useState({ title: '', type: '', time_limit: '', pairs: '[]' })
  const [addResult, setAddResult] = useState('')

  useEffect(() => {
    fetchGameInfo()
    fetchMemoryPairs()
  }, [])

  function fetchGameInfo() {
    axios.get('/api/memory_game/info')
      .then(res => setGameInfo(res.data))
      .catch(err => setGameInfo([{ error: err.message }]))
  }

  function fetchMemoryPairs() {
    axios.get('/api/memory_game/pairs')
      .then(res => setMemoryPairs(res.data))
      .catch(err => setMemoryPairs([{ error: err.message }]))
  }

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
        setAddResult(JSON.stringify(res.data, null, 2))
        fetchGameInfo()
      })
      .catch(err => setAddResult(err.message))
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route index element={<Navigate to="/game-info" replace />} />
          <Route path="game-info" element={<GameInfo />} />
          <Route path="add-game" element={<AddGame />} />
          <Route path="memory-pairs" element={<MemoryPairs />} />
          <Route path="vocabulary-sets" element={<VocabularySets />} />
          <Route path="vocabulary/:setId" element={<Vocabulary />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
