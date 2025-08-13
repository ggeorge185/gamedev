import { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/SystemStatus.css'

function SystemStatus() {
  const [systemHealth, setSystemHealth] = useState(null)
  const [databaseStatus, setDatabaseStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchSystemStatus()
  }, [])

  async function fetchSystemStatus() {
    setLoading(true)
    try {
      const [healthResponse, dbResponse] = await Promise.all([
        axios.get('/health'),
        axios.get('/api/database/status')
      ])
      
      setSystemHealth(healthResponse.data)
      setDatabaseStatus(dbResponse.data)
    } catch (error) {
      console.error('Failed to fetch system status:', error)
    } finally {
      setLoading(false)
    }
  }

  async function refreshStatus() {
    setRefreshing(true)
    await fetchSystemStatus()
    setRefreshing(false)
  }

  if (loading) {
    return <div className="loading">Loading system status...</div>
  }

  return (
    <div className="system-status">
      <div className="status-header">
        <h2>System Status Dashboard</h2>
        <button onClick={refreshStatus} disabled={refreshing} className="refresh-button">
          {refreshing ? '🔄 Refreshing...' : '🔄 Refresh'}
        </button>
      </div>

      <div className="status-grid">
        {/* System Health Card */}
        <div className="status-card">
          <h3>🏥 System Health</h3>
          {systemHealth ? (
            <div className="health-info">
              <div className={`status-badge ${systemHealth.status}`}>
                {systemHealth.status === 'healthy' ? '✅ Healthy' : '❌ Unhealthy'}
              </div>
              <p><strong>Database:</strong> {systemHealth.database}</p>
              <p><strong>Version:</strong> {systemHealth.version}</p>
              {systemHealth.error && (
                <div className="error-info">
                  <strong>Error:</strong> {systemHealth.error}
                </div>
              )}
            </div>
          ) : (
            <p>❌ Health check failed</p>
          )}
        </div>

        {/* Database Status Card */}
        <div className="status-card">
          <h3>🗄️ Database Status</h3>
          {databaseStatus ? (
            <div className="db-info">
              <div className="status-badge healthy">
                ✅ Connected
              </div>
              <p><strong>Database:</strong> {databaseStatus.database_name}</p>
              <p><strong>Tables:</strong> {databaseStatus.table_count}</p>
              
              {databaseStatus.data_counts && (
                <div className="data-counts">
                  <h4>Data Counts:</h4>
                  <ul>
                    {Object.entries(databaseStatus.data_counts).map(([key, value]) => (
                      <li key={key}>
                        <strong>{key}:</strong> {value}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <details className="tables-list">
                <summary>View All Tables ({databaseStatus.tables_found.length})</summary>
                <ul>
                  {databaseStatus.tables_found.map(table => (
                    <li key={table}>{table}</li>
                  ))}
                </ul>
              </details>
            </div>
          ) : (
            <p>❌ Database connection failed</p>
          )}
        </div>

        {/* Quick Actions Card */}
        <div className="status-card">
          <h3>⚡ Quick Actions</h3>
          <div className="action-buttons">
            <button onClick={() => window.open('/', '_blank')} className="action-button">
              🌐 Open API Root
            </button>
            <button onClick={() => window.open('/api/database/status', '_blank')} className="action-button">
              📊 View Raw DB Status
            </button>
            <button onClick={() => window.open('/health', '_blank')} className="action-button">
              🏥 Health Check
            </button>
          </div>
        </div>

        {/* Server Info Card */}
        <div className="status-card">
          <h3>🖥️ Server Information</h3>
          <div className="server-info">
            <p><strong>Status:</strong> <span className="status-badge healthy">🟢 Online</span></p>
            <p><strong>API Version:</strong> 2.0</p>
            <p><strong>Environment:</strong> Development</p>
            <p><strong>Host:</strong> localhost:5000</p>
            <p><strong>Last Refresh:</strong> {new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SystemStatus