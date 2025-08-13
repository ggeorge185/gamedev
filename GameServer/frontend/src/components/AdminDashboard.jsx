import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'
import '../styles/AdminDashboard.css'

function AdminDashboard({ user }) {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleLogout() {
    if (loading) return
    
    setLoading(true)
    try {
      await axios.post('/admin/logout')
      navigate('/admin/login')
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-dashboard">
      <nav className="admin-sidebar">
        <div className="admin-header">
          <h2>Admin Panel</h2>
          <p>Welcome, {user}</p>
        </div>
        
        <ul className="admin-nav">
          <li><Link to="/admin/dashboard">📊 System Status</Link></li>
          <li><Link to="/admin/database">🗄️ Database Manager</Link></li>
          <li><Link to="/admin/users">👥 User Management</Link></li>
          <li><Link to="/admin/game-integration">🎮 Game Integration</Link></li>
          <li className="nav-divider"></li>
          <li><Link to="/game-info">📝 Content Management</Link></li>
          <li><Link to="/vocabulary-sets">📚 Vocabulary Sets</Link></li>
          <li><Link to="/memory-pairs">🃏 Memory Pairs</Link></li>
          <li className="nav-divider"></li>
          <li>
            <button onClick={handleLogout} disabled={loading} className="logout-button">
              {loading ? '⏳ Logging out...' : '🚪 Logout'}
            </button>
          </li>
        </ul>
      </nav>
      
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminDashboard