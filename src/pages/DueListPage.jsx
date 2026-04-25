import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Zap, Volume2, Check, X } from 'lucide-react'

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
        position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
        width: '400px', height: '300px', borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(245,166,35,0.07) 0%, transparent 70%)',
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
        @keyframes pulse-orange {
          0%, 100% { box-shadow: 0 0 20px rgba(245,166,35,0.35); }
          50% { box-shadow: 0 0 45px rgba(245,166,35,0.65), 0 0 80px rgba(245,166,35,0.15); }
        }
        @keyframes shimmer-line {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        @keyframes blink-zap {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes card-in {
          0% { opacity: 0; transform: translateY(24px) scale(0.97); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes correct-flash {
          0% { background: rgba(34,197,94,0.15); }
          100% { background: rgba(255,255,255,0.05); }
        }
        @keyframes wrong-flash {
          0% { background: rgba(239,68,68,0.15); }
          100% { background: rgba(255,255,255,0.05); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  )
}

// Mock so'zlar ro'yxati
const mockWords = [
  { id: 1, word: 'Apple',      translation: 'Olma'       },
  { id: 2, word: 'Butterfly',  translation: 'Kapalak'    },
  { id: 3, word: 'Mountain',   translation: 'Tog\''      },
  { id: 4, word: 'Knowledge',  translation: 'Bilim'      },
  { id: 5, word: 'Courage',    translation: 'Jasorat'    },
]

export default function DueListPage() {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [focused, setFocused] = useState(false)
  const [result, setResult] = useState(null) // 'correct' | 'wrong' | null
  const [finished, setFinished] = useState(false)
  const [score, setScore] = useState(0)

  const current = mockWords[currentIndex]

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      const utter = new SpeechSynthesisUtterance(current.word)
      utter.lang = 'en-US'
      window.speechSynthesis.speak(utter)
    }
  }

  const handleCheck = () => {
    if (!answer.trim()) return
    const isCorrect = answer.trim().toLowerCase() === current.translation.toLowerCase()
    setResult(isCorrect ? 'correct' : 'wrong')
    if (isCorrect) setScore(s => s + 1)

    setTimeout(() => {
      setResult(null)
      setAnswer('')
      if (currentIndex + 1 >= mockWords.length) {
        setFinished(true)
      } else {
        setCurrentIndex(i => i + 1)
      }
    }, 1000)
  }

  const handleSkip = () => {
    setAnswer('')
    setResult(null)
    if (currentIndex + 1 >= mockWords.length) {
      setFinished(true)
    } else {
      setCurrentIndex(i => i + 1)
    }
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setAnswer('')
    setResult(null)
    setFinished(false)
    setScore(0)
  }

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
            <Zap size={16} color="#F5A623" fill="#F5A623"
              style={{ animation: 'blink-zap 1.8s ease-in-out infinite' }} />
            <span style={{ fontWeight: 700, fontSize: 17, color: '#fff' }}>Due list</span>
          </div>

          {/* Progress */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
              {currentIndex + 1}/{mockWords.length}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ padding: '0 16px', marginBottom: 16 }}>
          <div style={{
            height: 3, borderRadius: 2,
            background: 'rgba(255,255,255,0.07)',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${((currentIndex) / mockWords.length) * 100}%`,
              background: 'linear-gradient(90deg, #F5A623, #E8820F)',
              borderRadius: 2,
              transition: 'width 0.4s ease',
              boxShadow: '0 0 8px rgba(245,166,35,0.5)',
            }} />
          </div>
        </div>

        {/* ── FINISHED ── */}
        {finished ? (
          <div style={{ padding: '40px 16px 0', textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
            <div style={{
              fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 8,
            }}>
              Barakalla!
            </div>
            <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>
              {score}/{mockWords.length} ta to'g'ri
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(245,166,35,0.12)',
              border: '1px solid rgba(245,166,35,0.3)',
              borderRadius: 20, padding: '6px 16px', marginBottom: 32,
            }}>
              <Zap size={14} color="#F5A623" fill="#F5A623" />
              <span style={{ color: '#F5A623', fontWeight: 700 }}>
                +{score * 10} NP
              </span>
            </div>
            <button onClick={handleRestart} style={{
              display: 'block', width: '100%',
              padding: '16px', borderRadius: 18,
              background: 'linear-gradient(135deg, #F5A623, #E8820F)',
              border: 'none', color: '#fff',
              fontWeight: 700, fontSize: 16,
              cursor: 'pointer',
              boxShadow: '0 4px 24px rgba(245,166,35,0.4)',
              animation: 'pulse-orange 2.5s ease-in-out infinite',
            }}>
              Qayta boshlash
            </button>
          </div>
        ) : (

        <div style={{ padding: '0 16px' }}>
          {/* ── SO'Z KARTASI ── */}
          <div style={{
            borderRadius: 24, overflow: 'hidden',
            background: result === 'correct'
              ? 'rgba(34,197,94,0.08)'
              : result === 'wrong'
              ? 'rgba(239,68,68,0.08)'
              : 'rgba(255,255,255,0.05)',
            border: result === 'correct'
              ? '1.5px solid rgba(34,197,94,0.4)'
              : result === 'wrong'
              ? '1.5px solid rgba(239,68,68,0.4)'
              : '1px solid rgba(255,255,255,0.09)',
            backdropFilter: 'blur(14px)',
            padding: '32px 20px 24px',
            animation: 'card-in 0.35s ease',
            transition: 'all 0.3s',
          }}>
            {/* So'z + ovoz */}
            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 12, marginBottom: 10,
            }}>
              <span style={{
                fontSize: 30, fontWeight: 800, color: '#fff',
                animation: 'float 3s ease-in-out infinite',
              }}>
                {current.word}
              </span>
              <button onClick={handleSpeak} style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'linear-gradient(135deg, #F5A623, #E8820F)',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 12px rgba(245,166,35,0.4)',
                flexShrink: 0,
              }}>
                <Volume2 size={16} color="#fff" />
              </button>
            </div>

            {/* Subtitle */}
            <div style={{
              textAlign: 'center', fontSize: 13,
              color: 'rgba(255,255,255,0.4)', marginBottom: 20,
            }}>
              So'zning tarjimasini eslang
            </div>

            {/* Divider with zap */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20,
            }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
              <Zap size={14} color="#F5A623" fill="#F5A623"
                style={{ animation: 'blink-zap 1.8s ease-in-out infinite' }} />
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
            </div>

            {/* Input label */}
            <div style={{
              fontWeight: 700, fontSize: 13, color: '#fff', marginBottom: 10,
            }}>
              Yozish uchun qism
            </div>

            {/* Input */}
            <input
              type="text"
              placeholder="Tarjimasini yozing..."
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={e => e.key === 'Enter' && handleCheck()}
              style={{
                width: '100%',
                background: focused
                  ? 'rgba(245,166,35,0.06)'
                  : 'rgba(255,255,255,0.04)',
                border: focused
                  ? '1.5px solid rgba(245,166,35,0.45)'
                  : '1px solid rgba(255,255,255,0.08)',
                borderRadius: 14, padding: '13px 16px',
                fontSize: 15, color: '#fff', outline: 'none',
                backdropFilter: 'blur(12px)',
                transition: 'all 0.25s',
                fontFamily: 'inherit',
              }}
            />

            {/* Result message */}
            {result && (
              <div style={{
                marginTop: 10, textAlign: 'center',
                fontSize: 13, fontWeight: 600,
                color: result === 'correct' ? '#22c55e' : '#ef4444',
                animation: 'card-in 0.3s ease',
              }}>
                {result === 'correct'
                  ? `✓ To'g'ri! "${current.translation}"`
                  : `✗ Noto'g'ri. To'g'ri javob: "${current.translation}"`}
              </div>
            )}
          </div>

          {/* ── TUGMALAR ── */}
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            {/* Tekshirish */}
            <button
              onClick={handleCheck}
              disabled={!answer.trim() || !!result}
              style={{
                flex: 1, padding: '16px',
                borderRadius: 18, cursor: answer.trim() ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                fontWeight: 700, fontSize: 16, color: '#fff',
                transition: 'all 0.2s',
                position: 'relative', overflow: 'hidden',
                background: answer.trim()
                  ? 'linear-gradient(135deg, #F5A623, #E8820F)'
                  : 'rgba(255,255,255,0.06)',
                border: answer.trim()
                  ? 'none'
                  : '1px solid rgba(255,255,255,0.1)',
                boxShadow: answer.trim()
                  ? '0 4px 24px rgba(245,166,35,0.4)'
                  : 'none',
                animation: answer.trim() ? 'pulse-orange 2.5s ease-in-out infinite' : 'none',
              }}
              onTouchStart={e => { if (answer.trim()) e.currentTarget.style.transform = 'scale(0.97)' }}
              onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
              onMouseDown={e => { if (answer.trim()) e.currentTarget.style.transform = 'scale(0.97)' }}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              {/* Shimmer */}
              {answer.trim() && (
                <div style={{
                  position: 'absolute', inset: 0, overflow: 'hidden',
                  borderRadius: 18, pointerEvents: 'none',
                }}>
                  <div style={{
                    position: 'absolute', top: 0, left: 0,
                    width: '35%', height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
                    animation: 'shimmer-line 2s ease-in-out infinite',
                  }} />
                </div>
              )}
              <Check size={20} color={answer.trim() ? '#fff' : 'rgba(255,255,255,0.3)'} strokeWidth={2.5} />
              <span style={{ color: answer.trim() ? '#fff' : 'rgba(255,255,255,0.3)' }}>
                Tekshirish
              </span>
            </button>

            {/* Skip (X) */}
            <button
              onClick={handleSkip}
              style={{
                width: 54, height: 54, borderRadius: 16, flexShrink: 0,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
              onTouchStart={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
              onTouchEnd={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              onMouseDown={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
              onMouseUp={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            >
              <X size={20} color="rgba(255,255,255,0.5)" />
            </button>
          </div>

        </div>
        )}

      </div>
    </div>
  )
}