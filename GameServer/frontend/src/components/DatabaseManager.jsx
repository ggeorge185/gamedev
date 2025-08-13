import { useState } from 'react'
import axios from 'axios'
import '../styles/DatabaseManager.css'

function DatabaseManager() {
  const [setupResult, setSetupResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function setupTables() {
    setLoading(true)
    setError('')
    setSetupResult(null)

    try {
      const response = await axios.post('/api/setup/tables')
      setSetupResult(response.data)
    } catch (error) {
      setError(error.response?.data?.error || 'Setup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="database-manager">
      <h2>Database Management</h2>
      <p>Manage your Alex Neuanfang database tables and sample data.</p>

      <div className="manager-section">
        <h3>🏗️ Table Setup</h3>
        <p>Create all necessary database tables with sample data for testing.</p>
        
        <button 
          onClick={setupTables} 
          disabled={loading}
          className="setup-button"
        >
          {loading ? '⏳ Setting up tables...' : '🚀 Setup Database Tables'}
        </button>

        {error && (
          <div className="error-message">
            <h4>❌ Setup Failed</h4>
            <p>{error}</p>
          </div>
        )}

        {setupResult && (
          <div className="setup-result">
            <h4>✅ Setup Successful!</h4>
            <p>{setupResult.message}</p>
            
            {setupResult.tables_created && (
              <div className="tables-created">
                <h5>Tables Created:</h5>
                <ul>
                  {setupResult.tables_created.map(table => (
                    <li key={table}>{table}</li>
                  ))}
                </ul>
              </div>
            )}

            {setupResult.sample_data && (
              <div className="sample-data">
                <h5>Sample Data Added:</h5>
                <ul>
                  {Object.entries(setupResult.sample_data).map(([key, value]) => (
                    <li key={key}>
                      <strong>{key}:</strong> {value} records
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="manager-section">
        <h3>📋 What This Does</h3>
        <div className="info-grid">
          <div className="info-card">
            <h4>🏛️ Core Tables</h4>
            <ul>
              <li>categories</li>
              <li>words</li>
              <li>vocabulary_sets</li>
              <li>vocabulary_set_words</li>
            </ul>
          </div>

          <div className="info-card">
            <h4>🎮 Game Tables</h4>
            <ul>
              <li>memory_pairs</li>
              <li>game_info</li>
              <li>scenarios</li>
              <li>campaigns</li>
            </ul>
          </div>

          <div className="info-card">
            <h4>📊 Sample Data</h4>
            <ul>
              <li>4 categories (banking, university, health, bureaucracy)</li>
              <li>12+ vocabulary words with phonetics</li>
              <li>2 vocabulary sets</li>
              <li>8 memory pairs for games</li>
            </ul>
          </div>

          <div className="info-card">
            <h4>🎯 Ready For</h4>
            <ul>
              <li>React frontend testing</li>
              <li>Godot game integration</li>
              <li>Vocabulary management</li>
              <li>Memory game development</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="manager-section">
        <h3>⚠️ Important Notes</h3>
        <div className="warning-box">
          <p><strong>Safe Operation:</strong> This setup uses "CREATE TABLE IF NOT EXISTS" and "ON CONFLICT DO NOTHING" to prevent data loss.</p>
          <p><strong>Multiple Runs:</strong> You can run this multiple times safely - it won't duplicate data.</p>
          <p><strong>Production:</strong> In production, use proper database migrations instead.</p>
        </div>
      </div>
    </div>
  )
}

export default DatabaseManager