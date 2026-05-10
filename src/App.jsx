import { HashRouter, Routes, Route } from 'react-router-dom'
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
import ShopPage from './pages/ShopPage'
import TranslatorPage from './pages/TranslatorPage'
import LabaratoriyaPage from './pages/LabaratoriyaPage'
import AiJangPage from './pages/AiJangPage'
import DuelPage from './pages/DuelPage'
import GuruhliJangPage from './pages/GuruhliJangPage'
import useStore from './store/useStore'

export default function App() {
  const { initTelegramAuth, isLoading } = useStore()

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
    <HashRouter>
      <div className="min-h-screen bg-[#1a1a1a] pb-20">
        <Routes>
          <Route path="/" element={<AsosiyPage />} />
          <Route path="/bolimlar" element={<BolimlarPage />} />
          <Route path="/jang" element={<JangPage />} />
          <Route path="/jang/ai" element={<AiJangPage />} />
          <Route path="/jang/duel" element={<DuelPage />} />
          <Route path="/peshqadam" element={<PeshqadamlarPage />} />
          <Route path="/akkaunt" element={<AkkauntPage />} />
          <Route path="/sozqoshish" element={<SozQoshishPage />} />
          <Route path="/duelist" element={<DueListPage />} />
          <Route path="/jamisozlar" element={<JamiSozlarPage />} />
          <Route path="/jang/guruh" element={<GuruhliJangPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/uzeng" element={<TranslatorPage />} />
          <Route path="/laboratoriya" element={<LabaratoriyaPage />} />
        </Routes>
        <BottomNav />
      </div>
    </HashRouter>
  )
}