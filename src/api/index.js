import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
})

// User
export const getUser = (telegramId) => api.get(`/users/${telegramId}`)

// Cards / Boxlar
export const getBoxStats = (userId) => api.get(`/cards/box-stats/${userId}`)
export const getWordCount = (userId) => api.get(`/cards/count/${userId}`)

// Bo'limlar
export const getBolimlar = (userId) => api.get(`/bolimlar/${userId}`)

// Leaderboard
export const getLeaderboard = () => api.get(`/stats/leaderboard`)