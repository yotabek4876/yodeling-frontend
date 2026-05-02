import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Beaker, Zap, Atom, Rocket, Hammer, Sparkles } from 'lucide-react'

export default function LabaratoriyaPage() {
  const navigate = useNavigate()
  const [textIndex, setTextIndex] = useState(0)
  const [fade, setFade] = useState(true)

  // Kreativ va kulguli matnlar bazasi
  const labMessages = [
  "To'xtang! 🧪 Sirli Me'mor hozirgina yangi so'zlarni kolbada aralashtirgan edi, bittasi kiber-panjaradan sakrab qochib ketdi. Uni quvlayapmiz! 🏃‍♂️💨",
  "Vay! Bu yerga qanday kirdingiz? 🕵️‍♂️ Me'mor hozirgina Future.js faylini g'ishtma-g'isht terishni tugatdi. Qurilish hali qizg'in! 🏗️",
  "Diqqat! ⚠️ Laboratoriya ichida Me'mor tomonidan 5-darajali kreativlik portlashi yuz berdi. Radiatsiya o'rniga yangi funksiyalar sochilib ketgan! ☢️✨",
  "Sirli Me'mor kofe ichishga chiqib ketgan. ☕ U kelgunicha hech narsaga tegmay turing, aks holda lug'atingiz o'z-o'zidan qadimiy shumer tiliga o'zgarib qolishi mumkin! 🤖",
  "Me'mor aytganidek: 'Yaxshi narsalar kutganlarga keladi, juda yaxshi narsalar esa... kuting, hali o'ylab topmadim!' 🚀",
  "Vocab-Shovvozlar e'tiboriga: Me'mor bu eshik ortida yangi dunyo pishirmoqda. Hidi kelyaptimi? Bu kiber-lag'mon hidi! 🍜 (yoki shunga o'xshash)",
  "Bu yerda Me'mor koinotdagi eng qiyin so'zlarni klonlashtirish bilan band. 🧪 Hozircha esa laboratoriya sichqonlari (kodlarimiz) break-dance tushmoqda! 🐭🕺",
  "Shshsh! 🤫 Me'mor uxlab qoldi. Agar uyg'onib ketsa, hammani majburiy 'IELTS 9.0' qilib yuboradi. Sekinroq yuring...",
  "Xatolik 404: Me'morning kayfiyati topilmadi. 📉 U hozir yangi funksiyalar ustida jahl bilan kod yozmoqda. Yaqinlashmang, elektr urishi mumkin! ⚡",
  "Me'mor bu yerga 'Kirish taqiqlanadi' degan yozuv qo'yishni unutibdi. Demak, siz tanlangan shaxssiz! Yoki shunchaki adashib qoldingiz... 🤔",
  "Laboratoriyada yangi tajriba: 'So'zlarni choy bilan ichish'. ☕ Me'mor hali natijasini kutmoqda. Siz ham kutib turing!",
  "Me'morning kiber-laboratoriyasiga xush kelibsiz! Bu yerda hatto 'The' artikli ham oltin suvi bilan yuviladi. ✨",
];

  // Matnlarni har 5 soniyada mayin almashish mantiqi
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false) // Avval yo'qoladi
      setTimeout(() => {
        setTextIndex((prev) => (prev + 1) % labMessages.length)
        setFade(true) // Keyin yangi matn chiqadi
      }, 1000)
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', color: '#fff', fontFamily: 'system-ui' }}>
      {/* Fon qismi - Dizayn daxlsizligi */}
      <div style={{ position: 'absolute', inset: 0, background: '#0a0a1a', zIndex: 0 }} />
      <div style={{
        position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)',
        width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(245,166,35,0.05) 0%, transparent 70%)',
        zIndex: 0
      }} />

      <div style={{ position: 'relative', zIndex: 1, padding: '20px 16px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        
        {/* Orqaga qaytish tugmasi */}
        <button onClick={() => navigate(-1)} style={{ 
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', 
          borderRadius: '50%', width: 42, height: 42, color: '#fff', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <ArrowLeft size={20} />
        </button>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          
          {/* Markaziy Animatsiya qismi */}
          <div style={{ position: 'relative', marginBottom: 40 }}>
            <div style={{
                position: 'absolute', inset: -25, background: 'rgba(245,166,35,0.15)',
                borderRadius: '50%', filter: 'blur(45px)', animation: 'pulse-glow 3s infinite'
            }} />
            <div style={{
              width: 120, height: 120, borderRadius: 35,
              background: 'rgba(255,255,255,0.03)', border: '1.5px solid rgba(245,166,35,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: 'float-lab 4s infinite ease-in-out',
              backdropFilter: 'blur(10px)'
            }}>
              <Beaker size={60} color="#F5A623" />
            </div>
            <Atom size={35} color="#F5A623" style={{ position: 'absolute', top: -15, right: -15, animation: 'spin-lab 8s linear infinite' }} />
            <Sparkles size={24} color="#F5A623" style={{ position: 'absolute', bottom: -10, left: -10, animation: 'pulse-glow 2s infinite' }} />
          </div>

          <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 20, letterSpacing: -0.5 }}>
            Kiber-Laboratoriya
          </h1>
          
          {/* Animatsiyali matn qutisi */}
          <div style={{ 
            minHeight: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 20px', maxWidth: '340px'
          }}>
            <p style={{ 
              fontSize: 16, color: 'rgba(255,255,255,0.8)', 
              lineHeight: 1.7, margin: 0,
              transition: 'all 0.5s ease-in-out',
              opacity: fade ? 1 : 0,
              transform: fade ? 'translateY(0)' : 'translateY(10px)',
              fontStyle: 'italic'
            }}>
              "{labMessages[textIndex]}"
            </p>
          </div>

          {/* Pastki interaktiv ikonalar */}
          <div style={{ marginTop: 50, display: 'flex', alignItems: 'center', gap: 20 }}>
             <div style={{ animation: 'bounce-slow 2s infinite', opacity: 0.5 }}><Rocket size={28} /></div>
             <div style={{ color: '#F5A623', animation: 'hammer-hit 1.5s infinite' }}><Hammer size={32} /></div>
             <div style={{ animation: 'pulse-glow 1.5s infinite', opacity: 0.5 }}><Zap size={28} /></div>
          </div>
        </div>

        {/* Footer Info */}
        <div style={{ 
            textAlign: 'center', padding: '20px', 
            fontSize: 10, color: 'rgba(245,166,35,0.4)', 
            letterSpacing: 3, fontWeight: 800 
        }}>
          STATUS: ENCRYPTING NEW FEATURES...
        </div>
      </div>

      {/* Maxsus Animatsiyalar */}
      <style>{`
        @keyframes float-lab { 
          0%, 100% { transform: translateY(0) rotate(0deg); } 
          50% { transform: translateY(-20px) rotate(5deg); } 
        }
        @keyframes pulse-glow { 
          0%, 100% { opacity: 0.4; transform: scale(1); } 
          50% { opacity: 0.7; transform: scale(1.1); } 
        }
        @keyframes spin-lab { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes bounce-slow { 
          0%, 100% { transform: translateY(0); } 
          50% { transform: translateY(-10px); } 
        }
        @keyframes hammer-hit {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-30deg); }
        }
      `}</style>
    </div>
  )
}