import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Debug logging
api.interceptors.request.use(config => {
  console.log('🚀 API Request:', config.method?.toUpperCase(), config.url)
  return config
})

api.interceptors.response.use(
  response => {
    console.log('✅ API Success:', response.status, response.config.url)
    return response
  },
  error => {
    console.error('❌ API Error:', error.response?.status, error.response?.data)
    return Promise.reject(error)
  }
)

export default api