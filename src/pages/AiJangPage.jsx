import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import { api } from '../api/index'
import { ArrowLeft, Zap, Bot, Clock } from 'lucide-react'

const GLOBAL_CSS = `
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes twinkle { 0%, 100% { opacity: 0; } 50% { opacity: 0.7; } }
  @keyframes pulse-orange { 0%, 100% { box-shadow: 0 0 20px rgba(245,166,35,0.3); } 50% { box-shadow: 0 0 40px rgba(245,166,35,0.6); } }
  @keyframes shimmer { 0% { transform: translateX(-150%); } 100% { transform: translateX(350%); } }
  @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-6px); } }
  @keyframes resultPop { 0% { transform: scale(0.5); opacity: 0; } 60% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
`

function StarField() {
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 100,
    size: Math.random() * 2 + 0.5, delay: Math.random() * 4, dur: Math.random() * 3 + 2,
  }))
  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg,#08080f 0%,#0a0c14 45%,#0b0c16 70%,#0a0a0f 100%)' }} />
      {stars.map(s => (
        <div key={s.id} style={{ position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, borderRadius: '50%', backgroundColor: '#fff', opacity: 0, animation: `twinkle ${s.dur}s ${s.delay}s ease-in-out infinite` }} />
      ))}
    </div>
  )
}

function ResultScreen({ result, onRestart, onBack, remaining }) {
  const userWon = result.userScore > result.aiScore
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)' }}>
      <div style={{ width: '88%', maxWidth: 360, borderRadius: 28, padding: '32px 24px', background: 'linear-gradient(135deg,#1a0e30 0%,#0f1623 50%,#1a1000 100%)', border: `2px solid ${userWon ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'}`, textAlign: 'center', animation: 'resultPop 0.5s ease-out both' }}>
        <div style={{ fontSize: 64, marginBottom: 8, animation: 'float 3s ease-in-out infinite' }}>
          {userWon ? '🏆' : '😤'}
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, color: userWon ? '#22c55e' : '#ef4444', marginBottom: 4 }}>
          {userWon ? "G'ALABA!" : 'Yutqazdingiz!'}
        </div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 24 }}>
          {userWon ? 'AI ni yengdingiz! 💪' : 'Keyingi safar yaxshiroq! 💡'}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <div style={{ padding: '16px', borderRadius: 18, background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.2)' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>Siz</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#F5A623' }}>{result.userScore}%</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{result.correctCount}/{result.totalQuestions} to'g'ri</div>
          </div>
          <div style={{ padding: '16px', borderRadius: 18, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>AI</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#a78bfa' }}>{result.aiScore}%</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>Sun'iy intellekt</div>
          </div>
        </div>

        {result.npEarned > 0 && (
          <div style={{ marginBottom: 20, padding: '12px', borderRadius: 14, background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Zap size={16} color="#F5A623" fill="#F5A623" />
            <span style={{ fontWeight: 800, color: '#F5A623', fontSize: 16 }}>+{result.npEarned} NP qo'shildi!</span>
          </div>
        )}

        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 20 }}>
          Bugun qolgan janglar: {remaining}
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onBack} style={{ flex: 1, padding: '13px', borderRadius: 14, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
            Chiqish
          </button>
          {remaining > 0 && (
            <button onClick={onRestart} style={{ flex: 1, padding: '13px', borderRadius: 14, background: 'linear-gradient(135deg,#F5A623,#E8820F)', border: 'none', color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>
              Yana jang! ⚔️
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AiJangPage() {
  const navigate = useNavigate()
  const { fetchProgress } = useStore()

  const [phase, setPhase] = useState('intro')
  const [questions, setQuestions] = useState([])
  // ✅ correctAnswers ni alohida saqlaymiz (foydalanuvchiga ko'rsatilmaydi)
  const [correctAnswers, setCorrectAnswers] = useState([])
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selected, setSelected] = useState(null)
  const [result, setResult] = useState(null)
  const [remaining, setRemaining] = useState(3)
  const [isVip, setIsVip] = useState(false)
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState(null)
  const [timeLeft, setTimeLeft] = useState(15)
  const timerRef = useRef(null)

  useEffect(() => {
    const id = 'aijang-css'
    if (!document.getElementById(id)) {
      const s = document.createElement('style'); s.id = id; s.textContent = GLOBAL_CSS; document.head.appendChild(s)
    }
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await api.get('/api/ai-test/stats')
      setStats(res.data)
      setRemaining(res.data.remaining)
      setIsVip(res.data.isVip)
    } catch {}
  }

  const startGame = async () => {
    setLoading(true)
    try {
      const res = await api.get('/api/ai-test/session')
      // ✅ questions — variantlar bilan (correctIndex yo'q)
      // Backend _answers ni serverda saqlaydi, lekin biz
      // frontend da ham correctIndex ni saqlab qo'yamiz (agar kelsa)
      setQuestions(res.data.questions)
      // ✅ Backend _answers ni yuborayotgan bo'lsa olamiz
      // Aks holda bo'sh array
      setCorrectAnswers(res.data._answers || [])
      setRemaining(res.data.remaining)
      setIsVip(res.data.isVip)
      setAnswers([])
      setCurrentQ(0)
      setSelected(null)
      setPhase('playing')
      startTimer()
    } catch (err) {
      alert(err.response?.data?.error || 'Xatolik')
    } finally {
      setLoading(false)
    }
  }

  const startTimer = () => {
    setTimeLeft(15)
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          handleAnswer(-1)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleAnswer = (idx) => {
    if (selected !== null) return
    clearInterval(timerRef.current)

    const q = questions[currentQ]
    setSelected(idx)

    const newAnswers = [...answers, { questionId: q.id, selectedIndex: idx }]
    setAnswers(newAnswers)

    if (currentQ + 1 >= questions.length) {
      setTimeout(() => submitGame(newAnswers), 1400)
    } else {
      setTimeout(() => {
        setCurrentQ(prev => prev + 1)
        setSelected(null)
        startTimer()
      }, 1200)
    }
  }

  const submitGame = async (finalAnswers) => {
    setLoading(true)
    try {
      const res = await api.post('/api/ai-test/answer', { answers: finalAnswers })
      setResult(res.data)
      setRemaining(prev => Math.max(0, prev - 1))
      setPhase('result')
      fetchProgress()
    } catch (err) {
      alert(err.response?.data?.error || 'Xatolik')
    } finally {
      setLoading(false)
    }
  }

  const handleRestart = () => {
    setPhase('intro')
    setResult(null)
    fetchStats()
  }

  // ── INTRO ────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: 100 }}>
        <StarField />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '20px 16px 12px' }}>
            <button onClick={() => navigate('/jang')} style={{ width: 36, height: 36, borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ArrowLeft size={18} color="#fff" />
            </button>
            <span style={{ fontWeight: 700, fontSize: 17, color: '#fff' }}>AI ga Qarshi</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 16px' }}>
            <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg,#6d28d9,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse-orange 2.5s ease-in-out infinite, float 3s ease-in-out infinite', boxShadow: '0 0 40px rgba(99,102,241,0.4)', marginBottom: 16 }}>
              <Bot size={48} color="#fff" />
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 6 }}>AIDA</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 24, textAlign: 'center' }}>
              Sun'iy intellekt raqibingiz tayyor!<br />10 ta savol • Har savol 15 soniya
            </div>

            {stats && (
              <div style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 24 }}>
                {[
                  { label: 'Janglar', value: stats.totalGames },
                  { label: "G'alabalar", value: stats.wins },
                  { label: 'Win rate', value: `${stats.winRate}%` },
                ].map((s, i) => (
                  <div key={i} style={{ padding: '14px 8px', borderRadius: 16, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#F5A623' }}>{s.value}</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ width: '100%', padding: '12px 16px', borderRadius: 14, background: 'rgba(245,166,35,0.06)', border: '1px solid rgba(245,166,35,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>Bugungi janglar</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#F5A623' }}>{remaining} ta qoldi {isVip ? '(VIP)' : ''}</span>
            </div>

            {remaining > 0 ? (
              <button onClick={startGame} disabled={loading} style={{ width: '100%', padding: '16px', borderRadius: 18, background: 'linear-gradient(135deg,#F5A623,#E8820F)', border: 'none', color: '#fff', fontWeight: 800, fontSize: 17, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, boxShadow: '0 8px 24px rgba(245,166,35,0.4)', animation: 'pulse-orange 2.5s ease-in-out infinite' }}>
                {loading ? 'Yuklanmoqda...' : '⚔️ Jangni boshlash'}
              </button>
            ) : (
              <div style={{ width: '100%', padding: '16px', borderRadius: 18, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', textAlign: 'center', fontSize: 14 }}>
                Bugungi janglar tugadi. Ertaga qaytib keling! 🌙
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── PLAYING ──────────────────────────────────────────────
  if (phase === 'playing') {
    const q = questions[currentQ]
    const progress = (currentQ / questions.length) * 100

    // ✅ To'g'ri indeksni aniqlaymiz
    // Backend _answers yuborsa — undan olamiz
    // Aks holda submitdan keyin bilib olamiz (result screen da)
    const correctAnswer = correctAnswers.find(a => a.id === q?.id)
    const correctIdx = correctAnswer?.correctIndex ?? null

    return (
      <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: 100 }}>
        <StarField />
        <div style={{ position: 'relative', zIndex: 1, padding: '20px 16px' }}>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Bot size={20} color="#a78bfa" />
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>AIDA</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#F5A623' }}>
              {currentQ + 1} / {questions.length}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: timeLeft <= 5 ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.06)', border: `1px solid ${timeLeft <= 5 ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.1)'}`, borderRadius: 50, padding: '5px 12px' }}>
              <Clock size={13} color={timeLeft <= 5 ? '#ef4444' : '#fff'} />
              <span style={{ fontSize: 13, fontWeight: 700, color: timeLeft <= 5 ? '#ef4444' : '#fff' }}>{timeLeft}s</span>
            </div>
          </div>

          <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.08)', marginBottom: 24, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg,#F5A623,#E8820F)', borderRadius: 2, transition: 'width 0.3s ease' }} />
          </div>

          <div style={{ marginBottom: 24, padding: '24px 20px', borderRadius: 22, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', animation: 'fadeIn 0.3s ease' }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>So'zni toping</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#fff', textAlign: 'center', letterSpacing: 1 }}>
              {q?.word}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {q?.options?.map((option, idx) => {
              // ✅ Rang logikasi — faqat tanlagandan keyin ishlaydi
              let bg     = 'rgba(255,255,255,0.04)'
              let border = '1px solid rgba(255,255,255,0.08)'
              let color  = '#fff'

              if (selected !== null) {
                const isThisCorrect = correctIdx !== null
                  ? idx === correctIdx
                  : false
                const isSelected = idx === selected

                if (isThisCorrect) {
                  // ✅ To'g'ri javob — YASHIL
                  bg     = 'rgba(34,197,94,0.15)'
                  border = '1.5px solid rgba(34,197,94,0.6)'
                  color  = '#22c55e'
                } else if (isSelected) {
                  // ❌ Tanlangan lekin xato — QIZIL
                  bg     = 'rgba(239,68,68,0.12)'
                  border = '1.5px solid rgba(239,68,68,0.5)'
                  color  = '#ef4444'
                }
                // Qolganlar — o'zgarmaydi (kulrang)
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={selected !== null}
                  style={{
                    width: '100%', padding: '16px 18px', borderRadius: 16,
                    background: bg, border, color,
                    fontWeight: 600, fontSize: 15, textAlign: 'left',
                    cursor: selected !== null ? 'default' : 'pointer',
                    transition: 'all 0.25s',
                    animation: `fadeIn 0.3s ${idx * 0.05}s ease both`,
                  }}
                  onTouchStart={e => { if (selected === null) e.currentTarget.style.transform = 'scale(0.98)' }}
                  onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <span style={{ marginRight: 10, fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  {option}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // ── RESULT ───────────────────────────────────────────────
  if (phase === 'result' && result) {
    return (
      <>
        <StarField />
        <ResultScreen
          result={result}
          onRestart={handleRestart}
          onBack={() => navigate('/jang')}
          remaining={remaining}
        />
      </>
    )
  }

  return null
}