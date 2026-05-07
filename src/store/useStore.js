import { create } from 'zustand'
import { telegramAuth, getSrsProgress, getWords } from '../api/index'
import { api } from '../api/index'

const useStore = create((set, get) => ({
  // ── Auth ──────────────────────────────────────────────
  user:            null,
  token:           localStorage.getItem('token') || null,
  isLoading:       false,
  isAuthenticated: false,

  // ── SRS ───────────────────────────────────────────────
  srsProgress: null,
  boxStats: [
    { box: 1, percent: 0, total: 0 },
    { box: 2, percent: 0, total: 0 },
    { box: 3, percent: 0, total: 0 },
    { box: 4, percent: 0, total: 0 },
    { box: 5, percent: 0, total: 0 },
    { box: 6, percent: 0, total: 0 },
  ],
  wordCount:   0,
  words:       [],

  // ── Leaderboard ───────────────────────────────────────
  leaderboard: [],

  // ── Telegram auth + barcha ma'lumotlarni yuklash ──────
  initTelegramAuth: async () => {
    try {
      set({ isLoading: true })
      const tg = window.Telegram?.WebApp
      if (!tg) { set({ isLoading: false }); return }
      tg.ready()
      tg.expand()
      const initData = tg.initData
      if (!initData) { set({ isLoading: false }); return }

      const response = await telegramAuth(initData)
      const { token, user } = response.data
      localStorage.setItem('token', token)

      // ── user ni normalize qil (np va npBalance ikkalasi) ──
      const normalizedUser = normalizeUser(user)
      set({ token, user: normalizedUser, isAuthenticated: true, isLoading: false })

      // ── Barcha real ma'lumotlarni parallel yukla ──
      await Promise.all([
        get().fetchProgress(),
        get().fetchWords(),
        get().fetchMyStats(),
      ])
    } catch (error) {
      console.error('Auth error:', error)
      set({ isLoading: false })
    }
  },

  // ── SRS progress + NP + boxStats ─────────────────────
  fetchProgress: async () => {
    try {
      const response = await getSrsProgress()
      const progress = response.data
      const totalWords      = progress.totalWords || 0
      const boxDistribution = progress.boxDistribution || {}

      const boxStats = [1, 2, 3, 4, 5, 6].map(box => ({
        box,
        total:   boxDistribution[box] || 0,
        percent: totalWords > 0
          ? Math.round(((boxDistribution[box] || 0) / totalWords) * 100)
          : 0,
      }))

      set((state) => ({
      srsProgress: progress,
      boxStats,
      wordCount: totalWords,
      // ✅ NP balansini user ga qo'shamiz
      user: state.user ? {
        ...state.user,
        npBalance: progress.npBalance || 0,
      } : state.user,
    }))
  } catch (error) {
    console.error('Progress error:', error)
  }
},

  // ── So'zlar ro'yxati ──────────────────────────────────
  fetchWords: async () => {
    try {
      const response = await getWords()
      const words = response.data?.words ?? response.data ?? []
      set({ words, wordCount: words.length })
    } catch (error) {
      console.error('Words error:', error)
    }
  },

  // ── Joriy foydalanuvchi statistikasi (NP, streak, battles) ──
  fetchMyStats: async () => {
    try {
      const response = await api.get('/api/stats/my')
      const stats = response.data
      set(state => ({
        user: state.user ? {
          ...state.user,
          np:           stats.npBalance ?? state.user.np ?? 0,
          npBalance:    stats.npBalance ?? state.user.npBalance ?? 0,
          streak:       stats.streak    ?? state.user.streak ?? 0,
          isPremium:    stats.isPremium ?? state.user.isPremium ?? false,
          totalWords:   stats.totalWords ?? 0,
          masteredWords: stats.masteredWords ?? 0,
          battles: {
            total:  stats.battles ?? 0,
            wins:   stats.wins    ?? 0,
            losses: stats.losses  ?? 0,
          },
        } : state.user,
      }))
    } catch (error) {
      console.error('Stats error:', error)
    }
  },

  // ── NP ni real vaqtda yangilash (har qanday action dan keyin) ──
  refreshNp: async () => {
    try {
      const response = await api.get('/api/stats/my')
      const np = response.data?.npBalance ?? 0
      set(state => ({
        user: state.user ? {
          ...state.user,
          np,
          npBalance: np,
        } : state.user,
      }))
    } catch (error) {
      console.error('NP refresh error:', error)
    }
  },

  // ── Setterlar ─────────────────────────────────────────
  setUser:        (user)        => set({ user: normalizeUser(user) }),
  setWords:       (words)       => set({ words }),
  setWordCount:   (wordCount)   => set({ wordCount }),
  setBoxStats:    (boxStats)    => set({ boxStats }),
  setLeaderboard: (leaderboard) => set({ leaderboard }),

  // ── Logout ────────────────────────────────────────────
  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null, isAuthenticated: false })
  },
}))

// ── Helper: user ni normalize qilish ─────────────────────
function normalizeUser(user) {
  if (!user) return user
  const np = user.npBalance ?? user.np ?? 0
  return {
    ...user,
    np,
    npBalance: np,
    // firstName ni ham normalize
    firstName:  user.firstName  ?? user.first_name  ?? '',
    lastName:   user.lastName   ?? user.last_name   ?? '',
    streak:     user.streak     ?? 0,
    isPremium:  user.isPremium  ?? false,
    battles:    user.battles    ?? { total: 0, wins: 0, losses: 0 },
  }
}

export default useStore