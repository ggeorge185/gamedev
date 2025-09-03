import { useEffect, useState } from 'react'
import axios from 'axios'
import '../styles/GameInfo.css'

function GameInfo() {
  const [gameInfo, setGameInfo] = useState([])
  const [memoryPairs, setMemoryPairs] = useState([])

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

  return (
    <div className="game-info">
      <section className="info-section">
        <h2>Game Information</h2>
        <button onClick={fetchGameInfo}>Refresh</button>
        <div className="data-display">
          {gameInfo.map((info, index) => (
            <div key={index} className="info-card">
              <h3>{info.title}</h3>
              <p>Type: {info.type}</p>
              <p>Time Limit: {info.time_limit}s</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pairs-section">
        <h2>Memory Pairs</h2>
        <button onClick={fetchMemoryPairs}>Refresh</button>
        <div className="data-display">
          {memoryPairs.map((pair, index) => (
            <div key={index} className="pair-card">
              <p>DE: {pair.word_de}</p>
              <p>EN: {pair.word_en}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default GameInfo