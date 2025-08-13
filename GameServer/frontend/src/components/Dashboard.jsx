import { Link, Outlet } from 'react-router-dom'
import '../styles/Dashboard.css'

function Dashboard() {
  return (
    <div className="dashboard">
      <nav className="sidebar">
        <h2>Admin Dashboard</h2>
        <ul>
          <li><Link to="/game-info">Game Information</Link></li>
          <li><Link to="/add-game">Add New Game</Link></li>
          <li><Link to="/memory-pairs">Memory Pairs</Link></li>
          <li><Link to="/vocabulary-sets">Vocabulary Sets</Link></li>
        </ul>
      </nav>
      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}

export default Dashboard