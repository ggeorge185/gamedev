import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import GameInfo from './components/GameInfo'
import AddGame from './components/AddGame'
import MemoryPairs from './components/MemoryPairs'
import VocabularySets from './components/VocabularySets'
import Vocabulary from './components/Vocabulary'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'
import DatabaseManager from './components/DatabaseManager'
import GameIntegration from './components/GameIntegration'
import SystemStatus from './components/SystemStatus'
import AdminUsers from './components/AdminUsers'
import ScrabbleGameAdmin from './components/ScrabbleGameAdmin'  // New admin component
import GameAccess from './components/GameAccess'  // New player component
import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'
import api from './utils/api'

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const [adminUser, setAdminUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAdminSession()
  }, [])

  async function checkAdminSession() {
    try {
      const response = await api.get('/admin/check-session')  // Use api utility
      setIsAdminLoggedIn(response.data.logged_in)
      setAdminUser(response.data.user)
    } catch (error) {
      console.error('Session check failed:', error)
      setIsAdminLoggedIn(false)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={
          <AdminLogin 
            onLogin={checkAdminSession}
            isLoggedIn={isAdminLoggedIn}
          />
        } />
        
        {isAdminLoggedIn ? (
          <>
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard user={adminUser} />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<SystemStatus />} />
              <Route path="database" element={<DatabaseManager />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="scrabble-game" element={<ScrabbleGameAdmin />} />  {/* New route */}
            </Route>
            
            {/* Regular User Routes */}
            <Route path="/" element={<Dashboard />}>
              <Route index element={<Navigate to="/game-info" replace />} />
              <Route path="game-info" element={<GameInfo />} />
              <Route path="games" element={<GameAccess />} />  {/* New route for players */}
              <Route path="add-game" element={<AddGame />} />
              <Route path="memory-pairs" element={<MemoryPairs />} />
              <Route path="vocabulary-sets" element={<VocabularySets />} />
              <Route path="vocabulary/:setId" element={<Vocabulary />} />
            </Route>
          </>
        ) : (
          <Route path="*" element={<Navigate to="/admin/login" replace />} />
        )}
      </Routes>
    </BrowserRouter>
  )
}

export default App