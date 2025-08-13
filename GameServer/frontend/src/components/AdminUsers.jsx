import { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/AdminUsers.css'

function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    role: 'admin'
  })
  const [createResult, setCreateResult] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    try {
      const response = await axios.get('/admin/users')
      setUsers(response.data.users)
    } catch (error) {
      setError('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  function handleInputChange(e) {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value
    })
  }

  async function handleCreateUser(e) {
    e.preventDefault()
    setCreateResult('')

    try {
      const response = await axios.post('/admin/users/create', newUser)
      setCreateResult('User created successfully!')
      setNewUser({ username: '', password: '', role: 'admin' })
      setShowCreateForm(false)
      fetchUsers() // Refresh the list
    } catch (error) {
      setCreateResult(error.response?.data?.error || 'Failed to create user')
    }
  }

  if (loading) {
    return <div className="loading">Loading users...</div>
  }

  return (
    <div className="admin-users">
      <div className="users-header">
        <h2>👥 User Management</h2>
        <button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="create-user-button"
        >
          {showCreateForm ? '❌ Cancel' : '➕ Create User'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {createResult && (
        <div className={`result-message ${createResult.includes('successfully') ? 'success' : 'error'}`}>
          {createResult}
        </div>
      )}

      {showCreateForm && (
        <div className="create-user-form">
          <h3>Create New Admin User</h3>
          <form onSubmit={handleCreateUser}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                value={newUser.username}
                onChange={handleInputChange}
                required
                minLength={3}
                placeholder="Enter username (min 3 chars)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={newUser.password}
                onChange={handleInputChange}
                required
                minLength={6}
                placeholder="Enter password (min 6 chars)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                name="role"
                value={newUser.role}
                onChange={handleInputChange}
              >
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
                <option value="moderator">Moderator</option>
              </select>
            </div>

            <button type="submit" className="submit-button">
              👤 Create User
            </button>
          </form>
        </div>
      )}

      <div className="users-list">
        <h3>Current Users ({users.length})</h3>
        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Role</th>
                <th>Created By</th>
                <th>Created At</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.username} className={user.is_current_user ? 'current-user' : ''}>
                  <td>
                    {user.username}
                    {user.is_current_user && <span className="current-badge">You</span>}
                  </td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{user.created_by}</td>
                  <td>{user.created_at}</td>
                  <td>
                    <span className="status-badge active">
                      🟢 Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="user-management-info">
        <h3>ℹ️ User Management Info</h3>
        <div className="info-grid">
          <div className="info-card">
            <h4>🏛️ Role Permissions</h4>
            <ul>
              <li><strong>Super Admin:</strong> Full access, can create users</li>
              <li><strong>Admin:</strong> Content management access</li>
              <li><strong>Moderator:</strong> Limited content access</li>
            </ul>
          </div>

          <div className="info-card">
            <h4>🔒 Security Notes</h4>
            <ul>
              <li>Passwords are securely hashed</li>
              <li>Sessions expire automatically</li>
              <li>Only Super Admins can create users</li>
            </ul>
          </div>

          <div className="info-card">
            <h4>🚀 Default Account</h4>
            <ul>
              <li><strong>Username:</strong> admin</li>
              <li><strong>Password:</strong> admin</li>
              <li><strong>Role:</strong> Super Admin</li>
              <li>⚠️ Change in production!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminUsers