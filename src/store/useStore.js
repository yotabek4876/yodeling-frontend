import { create } from 'zustand'
import { telegramAuth, getSrsProgress, getWords } from '../api/index'

const useStore = create((set, get) => ({
  // ─── State ──────────────────────────────────────────────
  user: null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  isAuthenticated: false,
  
  srsProgress: null,
  words: [],
  boxStats: [
    { box: 1, percent: 0, total: 0 },
    { box: 2, percent: 0, total: 0 },
    { box: 3, percent: 0, total: 0 },
    { box: 4, percent: 0, total: 0 },
    { box: 5, percent: 0, total: 0 },
    { box: 6, percent: 0, total: 0 },
  ],
  wordCount: 0,

  // ─── Telegram Auth ────────────────────────────────────── 
  initTelegramAuth: async () => {
    try {
      set({ isLoading: true })
      
      const tg = window.Telegram?.WebApp
      if (!tg) {
        console.error('Telegram WebApp not found')
        set({ isLoading: false })
        return
      }

      tg.ready()
      tg.expand()

      const initData = tg.initData
      if (!initData) {
        console.error('No initData')
        set({ isLoading: false })
        return
      }

      const response = await telegramAuth(initData)
      const { token, user } = response.data

      localStorage.setItem('token', token)

      set({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
      })

      // Ma'lumotlarni yuklash
      get().fetchProgress()
      get().fetchWords()

    } catch (error) {
      console.error('Auth error:', error)
      set({ isLoading: false })
    }
  },

  // ─── Fetch Progress ───────────────────────────────────── 
  fetchProgress: async () => {
    try {
      const response = await getSrsProgress()
      const progress = response.data

      const totalWords = progress.totalWords || 0
      const boxDistribution = progress.boxDistribution || {}

      const boxStats = [1, 2, 3, 4, 5, 6].map((box) => ({
        box,
        total: boxDistribution[box] || 0,
        percent: totalWords > 0
          ? Math.round(((boxDistribution[box] || 0) / totalWords) * 100)
          : 0,
      }))

      set({
        srsProgress: progress,
        boxStats,
        wordCount: totalWords,
      })
    } catch (error) {
      console.error('Progress error:', error)
    }
  },

  // ─── Fetch Words ──────────────────────────────────────── 
  fetchWords: async () => {
    try {
      const response = await getWords()
      set({ words: response.data.words || [] })
    } catch (error) {
      console.error('Words error:', error)
    }
  },

  // ─── Setters ──────────────────────────────────────────── 
  setUser: (user) => set({ user }),
  setWords: (words) => set({ words }),
  setWordCount: (wordCount) => set({ wordCount }),
  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null, isAuthenticated: false })
  },
}))

export default useStore