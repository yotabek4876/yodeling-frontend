import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import { addWord } from '../api/index'
import { ArrowLeft, Plus, Zap, Sparkles } from 'lucide-react'

function StarField() {
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    delay: Math.random() * 4,
    duration: Math.random() * 3 + 2,
  }))
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(160deg, #0a0a1a 0%, #0d1117 40%, #0a0f1a 70%, #110a0a 100%)',
      }} />
      <div style={{
        position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)',
        width: '400px', height: '300px', borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(34,197,94,0.05) 0%, transparent 70%)',
      }} />
      {stars.map(s => (
        <div key={s.id} style={{
          position: 'absolute',
          left: `${s.x}%`, top: `${s.y}%`,
          width: s.size, height: s.size,
          borderRadius: '50%', backgroundColor: '#ffffff', opacity: 0,
          animation: `twinkle ${s.duration}s ${s.delay}s ease-in-out infinite`,
        }} />
      ))}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0.8); }
          50% { opacity: 0.7; transform: scale(1.2); }
        }
        @keyframes pulse-green {
          0%, 100% { box-shadow: 0 0 20px rgba(34,197,94,0.2); }
          50% { box-shadow: 0 0 40px rgba(34,197,94,0.45), 0 0 70px rgba(34,197,94,0.1); }
        }
        @keyframes shimmer-line {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        @keyframes blink-zap {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes success-pop {
          0% { transform: scale(0.8); opacity: 0; }
          60% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  )
}

export default function SozQoshishPage() {
  const navigate = useNavigate()
  // ✅ fetchWords va fetchProgress ni store dan olamiz
  const { fetchWords, fetchProgress } = useStore()

  const [word, setWord] = useState('')
  const [translation, setTranslation] = useState('')
  const [example, setExample] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)
  const [focused, setFocused] = useState(null)

  const handleSubmit = async () => {
    if (!word.trim() || !translation.trim()) return
    setLoading(true)
    setError(null)

    try {
      // ✅ Haqiqiy backend ga yuboramiz
      await addWord({
        word: word.trim(),
        translation: translation.trim(),
        example: example.trim() || undefined,
      })

      // ✅ Store ni yangilaymiz — AsosiyPage va JamiSozlarPage avtomatik yangilanadi
      await fetchWords()
      await fetchProgress()

      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        setWord('')
        setTranslation('')
        setExample('')
      }, 1800)
    } catch (err) {
      console.error('So\'z qo\'shishda xatolik:', err)
      setError(err?.response?.data?.message || 'Xatolik yuz berdi, qayta urinib ko\'ring')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = (name) => ({
    width: '100%',
    background: focused === name
      ? 'rgba(245,166,35,0.06)'
      : 'rgba(255,255,255,0.04)',
    border: focused === name
      ? '1.5px solid rgba(245,166,35,0.45)'
      : '1px solid rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: '14px 18px',
    fontSize: 15,
    color: '#fff',
    outline: 'none',
    backdropFilter: 'blur(12px)',
    transition: 'all 0.25s',
    resize: 'none',
    fontFamily: 'inherit',
  })

  return (
    <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: 100 }}>
      <StarField />

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── TOP BAR ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '20px 16px 12px',
        }}>
          <button onClick={() => navigate('/bolimlar')} style={{
            width: 36, height: 36, borderRadius: 12,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0,
          }}>
            <ArrowLeft size={18} color="#fff" />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Plus size={18} color="#22c55e" strokeWidth={2.5} />
            <span style={{ fontWeight: 700, fontSize: 17, color: '#fff' }}>
              So'z qo'shish
            </span>
          </div>
        </div>

        {/* ── ERROR ── */}
        {error && (
          <div style={{
            margin: '0 16px 12px',
            padding: '12px 16px',
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.25)',
            borderRadius: 14,
            fontSize: 13,
            color: '#fca5a5',
            textAlign: 'center',
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* ── FORM ── */}
        <div style={{ padding: '8px 16px 0', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* So'zni kiriting */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <Zap size={15} color="#F5A623" fill="#F5A623"
                style={{ animation: 'blink-zap 2s ease-in-out infinite' }} />
              <span style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>
                So'zni kiriting
              </span>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Inglizcha so'z..."
                value={word}
                onChange={e => setWord(e.target.value)}
                onFocus={() => setFocused('word')}
                onBlur={() => setFocused(null)}
                style={inputStyle('word')}
              />
              <div style={{
                position: 'absolute', right: 14, top: '50%',
                transform: 'translateY(-50%)',
                opacity: word ? 0.8 : 0.3,
                transition: 'opacity 0.2s',
              }}>
                <Sparkles size={16} color="#F5A623" />
              </div>
            </div>
          </div>

          {/* Tarjimasini kiriting */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <Zap size={15} color="#F5A623" fill="#F5A623"
                style={{ animation: 'blink-zap 2s ease-in-out infinite', animationDelay: '0.5s' }} />
              <span style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>
                Tarjimasini kiriting
              </span>
            </div>
            <input
              type="text"
              placeholder="O'zbekcha tarjimasi..."
              value={translation}
              onChange={e => setTranslation(e.target.value)}
              onFocus={() => setFocused('translation')}
              onBlur={() => setFocused(null)}
              style={inputStyle('translation')}
            />
          </div>

          {/* Misol (ixtiyoriy) */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <Zap size={15} color="#F5A623" fill="#F5A623"
                style={{ animation: 'blink-zap 2s ease-in-out infinite', animationDelay: '1s' }} />
              <span style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>
                Misol{' '}
                <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>
                  (ixtiyoriy)
                </span>
              </span>
            </div>
            <textarea
              rows={3}
              placeholder="Misol gap yozing..."
              value={example}
              onChange={e => setExample(e.target.value)}
              onFocus={() => setFocused('example')}
              onBlur={() => setFocused(null)}
              style={inputStyle('example')}
            />
          </div>

          {/* QO'SHISH TUGMASI */}
          <div style={{ marginTop: 4 }}>
            <button
              onClick={handleSubmit}
              disabled={!word.trim() || !translation.trim() || loading}
              style={{
                width: '100%', padding: '16px',
                borderRadius: 18, cursor: (!word.trim() || !translation.trim() || loading) ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                fontWeight: 700, fontSize: 16,
                transition: 'all 0.2s',
                position: 'relative', overflow: 'hidden',
                ...(success ? {
                  background: 'linear-gradient(135deg, #22c55e, #10b981)',
                  border: 'none',
                  boxShadow: '0 4px 24px rgba(34,197,94,0.4)',
                  animation: 'success-pop 0.4s ease',
                } : word.trim() && translation.trim() ? {
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#fff',
                  animation: 'pulse-green 2.5s ease-in-out infinite',
                } : {
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  color: 'rgba(255,255,255,0.3)',
                }),
              }}
              onTouchStart={e => { if (word && translation) e.currentTarget.style.transform = 'scale(0.97)' }}
              onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              {/* Shimmer */}
              {word.trim() && translation.trim() && !success && (
                <div style={{
                  position: 'absolute', inset: 0, overflow: 'hidden',
                  borderRadius: 18, pointerEvents: 'none',
                }}>
                  <div style={{
                    position: 'absolute', top: 0, left: 0,
                    width: '35%', height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
                    animation: 'shimmer-line 2s ease-in-out infinite',
                  }} />
                </div>
              )}

              {loading ? (
                <span style={{ color: '#fff' }}>Qo'shilmoqda...</span>
              ) : success ? (
                <span style={{ color: '#fff' }}>✓ Qo'shildi!</span>
              ) : (
                <>
                  <Plus size={20} color={word.trim() && translation.trim() ? '#fff' : 'rgba(255,255,255,0.3)'} strokeWidth={2.5} />
                  <span>Qo'shish</span>
                </>
              )}
            </button>
          </div>

          {/* Info text */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            marginTop: -8,
          }}>
            <span style={{
              fontSize: 12, color: 'rgba(255,255,255,0.3)',
              textAlign: 'center', fontStyle: 'italic',
            }}>
              So'z qo'shilgandan so'ng SRS tizimi orqali takrorlanadi
            </span>
            <Zap size={12} color="#F5A623" fill="#F5A623"
              style={{ flexShrink: 0, animation: 'blink-zap 1.5s ease-in-out infinite' }} />
          </div>

        </div>
      </div>
    </div>
  )
}