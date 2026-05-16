import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Languages, Copy, Sparkles, RefreshCw } from 'lucide-react'
import { api } from '../api/index'

// StarField foni (Dizayn birligi uchun)
function StarField() {
  const stars = Array.from({ length: 45 }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100, size: Math.random() * 2
  }))
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, #0a0a1a 0%, #0d1117 100%)' }} />
      {stars.map(s => (
        <div key={s.id} style={{
          position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size,
          backgroundColor: '#fff', borderRadius: '50%', opacity: 0.3,
          animation: `twinkle 3s ${Math.random() * 5}s infinite ease-in-out`
        }} />
      ))}
      <style>{`@keyframes twinkle { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.6; } } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default function TranslatorPage() {
  const navigate = useNavigate()
  const [text, setText] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [langpair, setLangpair] = useState('en|uz')

  const handleTranslate = async () => {
    if (!text.trim()) return
    setLoading(true)
    try {
      const res = await api.post('/api/translate', { text: text.trim(), langpair })
      setResult(res.data.translatedText || '')
    } catch (error) {
      const msg = error?.response?.data?.error || error?.message
      setResult(msg ? String(msg) : "Kiber-tarmoqda uzilish yuz berdi...")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', color: '#fff', paddingBottom: 40 }}>
      <StarField />
      
      <div style={{ position: 'relative', zIndex: 1, padding: '20px 16px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 25 }}>
          <button onClick={() => navigate(-1)} style={{ 
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', 
            borderRadius: '50%', width: 42, height: 42, color: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}> Translator</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
               <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
               <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>SYSTEM ONLINE</span>
            </div>
          </div>
        </div>

        {/* Input Card */}
        <div style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(245,166,35,0.2)',
          borderRadius: 24, padding: '20px', backdropFilter: 'blur(15px)', marginBottom: 16
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
            <span style={{ fontSize: 11, color: '#F5A623', fontWeight: 700, letterSpacing: 1 }}>
              {langpair === 'en|uz' ? 'EN → UZ' : 'UZ → EN'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                type="button"
                onClick={() => setLangpair('en|uz')}
                style={{
                  fontSize: 11, fontWeight: 700, padding: '6px 12px', borderRadius: 12, cursor: 'pointer', border: 'none',
                  background: langpair === 'en|uz' ? 'rgba(245,166,35,0.35)' : 'rgba(255,255,255,0.06)',
                  color: '#fff',
                }}
              >
                EN → UZ
              </button>
              <button
                type="button"
                onClick={() => setLangpair('uz|en')}
                style={{
                  fontSize: 11, fontWeight: 700, padding: '6px 12px', borderRadius: 12, cursor: 'pointer', border: 'none',
                  background: langpair === 'uz|en' ? 'rgba(245,166,35,0.35)' : 'rgba(255,255,255,0.06)',
                  color: '#fff',
                }}
              >
                UZ → EN
              </button>
              <Languages size={16} color="#F5A623" />
            </div>
          </div>
          <textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Matn kiriting..."
            style={{
              width: '100%', background: 'transparent', border: 'none', color: '#fff',
              fontSize: 17, outline: 'none', resize: 'none', height: 110, fontFamily: 'inherit',
              lineHeight: 1.5
            }}
          />
        </div>

        {/* Action Button */}
        <button 
          onClick={handleTranslate}
          disabled={loading}
          style={{
            width: '100%', padding: '16px', borderRadius: 20, border: 'none',
            background: loading ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #F5A623, #E8820F)',
            color: '#fff', fontWeight: 800, fontSize: 16, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            transition: 'transform 0.1s', boxShadow: '0 8px 20px rgba(245,166,35,0.2)'
          }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.96)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          {loading ? (
            <RefreshCw size={20} style={{ animation: 'spin 0.9s linear infinite' }} />
          ) : (
            <>
              <Sparkles size={18} /> Tarjima qilish
            </>
          )}
        </button>

        {/* Output Card */}
        <div style={{
          marginTop: 16, background: 'rgba(255,255,255,0.02)', 
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 24, padding: '20px', backdropFilter: 'blur(15px)',
          minHeight: 130, position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: 3, height: '100%', background: '#F5A623' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 700, letterSpacing: 1 }}>
              {langpair === 'en|uz' ? "O'ZBEKCHA NATIJA" : 'ENGLISH RESULT'}
            </span>
            <Copy size={16} color="rgba(255,255,255,0.3)" style={{ cursor: 'pointer' }} onClick={() => {
                if(result) navigator.clipboard.writeText(result)
            }} />
          </div>
          <div style={{ fontSize: 17, lineHeight: 1.5, color: result ? '#fff' : 'rgba(255,255,255,0.15)' }}>
            {result || "Kutish jarayoni..."}
          </div>
        </div>
      </div>
    </div>
  )
}