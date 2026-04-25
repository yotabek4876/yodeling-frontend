import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import BottomNav from './components/BottomNav'
import AsosiyPage from './pages/AsosiyPage'
import BolimlarPage from './pages/BolimlarPage'
import JangPage from './pages/JangPage'
import PeshqadamlarPage from './pages/PeshqadamlarPage'
import AkkauntPage from './pages/AkkauntPage'
import SozQoshishPage from './pages/SozQoshishPage'
import DueListPage from './pages/DueListPage'
import JamiSozlarPage from './pages/JamiSozlarPage'
import useStore from './store/useStore'

export default function App() {
  const { initTelegramAuth, isLoading, isAuthenticated } = useStore()

  useEffect(() => {
    initTelegramAuth()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-white text-xl">⏳ Yuklanmoqda...</div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#1a1a1a] pb-20">
        <Routes>
          <Route path="/" element={<AsosiyPage />} />
          <Route path="/bolimlar" element={<BolimlarPage />} />
          <Route path="/jang" element={<JangPage />} />
          <Route path="/peshqadam" element={<PeshqadamlarPage />} />
          <Route path="/akkaunt" element={<AkkauntPage />} />
          <Route path="/sozqoshish" element={<SozQoshishPage />} />
          <Route path="/duelist" element={<DueListPage />} />
          <Route path="/jamisozlar" element={<JamiSozlarPage />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  )
}