import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AdminLogin({ onLogin, isLoggedIn }) {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function handleChange(e) {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:5000/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(credentials)
      })

      const data = await response.json()
      
      if (data.success) {
        onLogin()
        navigate('/admin/dashboard')
      } else {
        setError('Invalid credentials')
      }
    } catch (error) {
      setError('Login failed: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '2rem',
        maxWidth: '400px',
        width: '100%'
      }}>
        <h1>Alex Neuanfang Admin</h1>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label>Username</label>
            <input
              name="username"
              type="text"
              value={credentials.username}
              onChange={handleChange}
              placeholder="admin"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                marginTop: '0.5rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label>Password</label>
            <input
              name="password"
              type="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="admin"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                marginTop: '0.5rem'
              }}
            />
          </div>

          {error && (
            <div style={{
              background: '#e74c3c',
              color: 'white',
              padding: '0.75rem',
              borderRadius: '4px',
              marginBottom: '1rem'
            }}>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: '100%',
              background: '#3498db',
              color: 'white',
              border: 'none',
              padding: '0.75rem',
              borderRadius: '4px'
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin
