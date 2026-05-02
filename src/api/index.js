import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const telegramAuth = (initData) => api.post('/api/auth/telegram', { initData })

export const getWords = () => api.get('/api/words')
export const addWord = (data) => api.post('/api/words/add', data)
export const updateWord = (id, data) => api.put(`/api/words/${id}`, data)
export const deleteWord = (id) => api.delete(`/api/words/${id}`)

export const getSrsSession = () => api.get('/api/srs/session')
export const submitSrsAnswer = (data) => api.post('/api/srs/answer', data)
export const getSrsProgress = () => api.get('/api/srs/progress')

export const getAiTestSession = () => api.get('/api/ai-test/session')
export const submitAiAnswer = (data) => api.post('/api/ai-test/answer', data)
export const getAiTestHistory = () => api.get('/api/ai-test/history')