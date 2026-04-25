import { create } from 'zustand'

const useStore = create((set) => ({
  user: {
    id: 1,
    telegramId: 123456,
    firstName: 'Ism',
    np: 222,
  },
  boxStats: [
    { box: 1, percent: 3, total: 0 },
    { box: 2, percent: 0, total: 0 },
    { box: 3, percent: 0, total: 0 },
    { box: 4, percent: 0, total: 0 },
    { box: 5, percent: 0, total: 0 },
    { box: 6, percent: 0, total: 0 },
  ],
  wordCount: 0,
  leaderboard: [],

  setUser: (user) => set({ user }),
  setBoxStats: (boxStats) => set({ boxStats }),
  setWordCount: (wordCount) => set({ wordCount }),
  setLeaderboard: (leaderboard) => set({ leaderboard }),
}))

export default useStore