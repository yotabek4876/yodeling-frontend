import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import { api } from '../api/index'
import { ArrowLeft, Zap, Users, Clock, Trophy, Shield } from 'lucide-react'

const GLOBAL_CSS = `
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes twinkle { 0%, 100% { opacity: 0; } 50% { opacity: 0.7; } }
  @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-6px); } }
  @keyframes pulse-blue { 0%, 100% { box-shadow: 0 0 20px rgba(99,102,241,0.3); } 50% { box-shadow: 0 0 40px rgba(99,102,241,0.7); } }
  @keyframes searchPulse { 0%, 100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.05); } }
  @keyframes shimmer { 0% { transform: translateX(-150%); } 100% { transform: translateX(350%); } }
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

function SearchingScreen({ onCancel }) {
  const [dots, setDots] = useState('.')
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '.' : prev + '.')
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 24px', animation: 'fadeIn 0.4s ease' }}>
      <div style={{ position: 'relative', marginBottom: 32 }}>
        <div style={{ width: 120, height: 120, borderRadius: '50%', background: 'rgba(99,102,241,0.1)', border: '2px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'searchPulse 2s ease-in-out infinite' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(99,102,241,0.15)', border: '2px solid rgba(99,102,241,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'searchPulse 2s ease-in-out infinite 0.3s' }}>
            <Users size={36} color="#a78bfa" />
          </div>
        </div>
      </div>

      <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 8 }}>
        Raqib qidirilmoqda{dots}
      </div>
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 40, textAlign: 'center' }}>
        Teng kuchli raqib topilganda jang boshlanadi
      </div>

      <button onClick={onCancel} style={{ padding: '13px 32px', borderRadius: 16, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
        Bekor qilish
      </button>
    </div>
  )
}

function ResultScreen({ result, onBack }) {
  const userWon = result.userScore > result.opponentScore

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
          {result.opponentName} bilan duel
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <div style={{ padding: '16px', borderRadius: 18, background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.2)' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>Siz</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#F5A623' }}>{result.userScore}%</div>
          </div>
          <div style={{ padding: '16px', borderRadius: 18, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>{result.opponentName}</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#a78bfa' }}>{result.opponentScore}%</div>
          </div>
        </div>

        {result.npEarned > 0 && (
          <div style={{ marginBottom: 20, padding: '12px', borderRadius: 14, background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Zap size={16} color="#F5A623" fill="#F5A623" />
            <span style={{ fontWeight: 800, color: '#F5A623', fontSize: 16 }}>+{result.npEarned} NP</span>
          </div>
        )}

        <button onClick={onBack} style={{ width: '100%', padding: '14px', borderRadius: 16, background: 'linear-gradient(135deg,#F5A623,#E8820F)', border: 'none', color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer' }}>
          Jang sahifasiga qaytish
        </button>
      </div>
    </div>
  )
}

export default function DuelPage() {
  const navigate = useNavigate()
  const { user } = useStore()
  const [phase, setPhase] = useState('intro')
  const [searching, setSearching] = useState(false)
  const [questions, setQuestions] = useState([])
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selected, setSelected] = useState(null)
  const [timeLeft, setTimeLeft] = useState(15)
  const [result, setResult] = useState(null)
  const [opponentName, setOpponentName] = useState('AI Rival')
  const [matchMode, setMatchMode] = useState('ai')
  const timerRef = useState(null)
  const foundStartedRef = useRef(false)

  useEffect(() => {
    const id = 'duel-css'
    if (!document.getElementById(id)) {
      const s = document.createElement('style'); s.id = id; s.textContent = GLOBAL_CSS; document.head.appendChild(s)
    }
  }, [])

  const cancelSearch = async () => {
    try {
      await api.delete('/api/pvp/queue')
    } catch (_) {
      /* ignore */
    }
    setSearching(false)
    setPhase('intro')
  }

  const startSearch = async () => {
    setSearching(true)
    setPhase('searching')
    setMatchMode('ai')
    try {
      await api.post('/api/pvp/queue', { mode: 'DUEL' })
      const deadline = Date.now() + 88_000
      while (Date.now() < deadline) {
        const { data } = await api.get('/api/pvp/status')
        if (data.state === 'ready') {
          const opp = (data.members || []).find((m) => !m.isMe)
          setOpponentName(opp?.displayName || 'Raqib')
          setMatchMode('human')
          setPhase('found')
          return
        }
        if (data.state === 'idle') break
        await new Promise((r) => setTimeout(r, 2000))
      }
      try {
        await api.delete('/api/pvp/queue')
      } catch (_) {
        /* ignore */
      }
      setSearching(false)
      setPhase('no_match')
    } catch (_) {
      try {
        await api.delete('/api/pvp/queue')
      } catch (__) {
        /* ignore */
      }
      setPhase('intro')
      setSearching(false)
    }
  }

  useEffect(() => {
    if (phase !== 'found') {
      foundStartedRef.current = false
      return
    }
    if (matchMode !== 'human') return
    if (foundStartedRef.current) return
    foundStartedRef.current = true
    const t = setTimeout(async () => {
      try {
        await api.post('/api/pvp/ack-ready')
      } catch (_) {
        /* ignore */
      }
      startDuel('human')
    }, 1600)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, matchMode])

  const startDuel = async (modeArg) => {
    const mode = modeArg || matchMode
    try {
      if (mode === 'human') {
        const { data } = await api.get('/api/pvp/game')
        if (data.error) {
          alert(data.error)
          setPhase('intro')
          return
        }
        setQuestions(data.questions || [])
      } else {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/ai-test/session`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
        const data = await res.json()
        if (data.error) {
          alert(data.error)
          setPhase('intro')
          return
        }
        setQuestions(data.questions)
      }
      setAnswers([])
      setCurrentQ(0)
      setSelected(null)
      setPhase('playing')
      startTimer()
    } catch {
      setPhase('intro')
    }
  }

  const submitDuel = async (finalAnswers) => {
    try {
      if (matchMode === 'human') {
        const { data: r1 } = await api.post('/api/pvp/submit', { answers: finalAnswers })
        if (r1.error) {
          alert(r1.error)
          setPhase('intro')
          return
        }
        if (r1.phase === 'waiting') {
          for (let i = 0; i < 90; i++) {
            await new Promise((r) => setTimeout(r, 2000))
            const { data: st } = await api.get('/api/pvp/status')
            if (st.state === 'done' && st.result) {
              const raw = st.result
              const players = raw.players || []
              const meRow = players.find((p) => p.userId === user?.id)
              const oppRow = players.find((p) => p.userId !== user?.id)
              setResult({
                userScore: meRow?.score ?? r1.meScore ?? 0,
                opponentScore: oppRow?.score ?? 0,
                opponentName: oppRow?.displayName || opponentName,
                npEarned: raw.npByUserId?.[user?.id] ?? 0,
                aiScore: oppRow?.score ?? 0,
              })
              setPhase('result')
              return
            }
          }
          setPhase('intro')
          return
        }
        if (r1.phase === 'done') {
          setResult({
            userScore: r1.userScore,
            opponentScore: r1.opponentScore,
            opponentName: r1.opponentName,
            npEarned: r1.npEarned ?? 0,
            aiScore: r1.opponentScore,
          })
          setPhase('result')
          return
        }
        setPhase('intro')
        return
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/ai-test/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ answers: finalAnswers }),
      })
      const data = await res.json()
      const opponentScore = data?.aiScore ?? 0
      const duelBonus = data?.userScore > opponentScore ? 5 : 0
      setResult({
        ...data,
        opponentScore,
        opponentName,
        npEarned: (data?.npEarned ?? 0) + duelBonus,
      })
      setPhase('result')
    } catch {
      setPhase('intro')
    }
  }

  const startTimer = () => {
    setTimeLeft(15)
    clearInterval(timerRef[0])
    timerRef[0] = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef[0])
          handleAnswer(-1)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleAnswer = (idx) => {
    if (selected !== null) return
    clearInterval(timerRef[0])
    const q = questions[currentQ]
    setSelected(idx)
    const newAnswers = [...answers, { questionId: q.id, selectedIndex: idx }]
    setAnswers(newAnswers)
    if (currentQ + 1 >= questions.length) {
      setTimeout(() => submitDuel(newAnswers), 1200)
    } else {
      setTimeout(() => { setCurrentQ(p => p + 1); setSelected(null); startTimer() }, 1000)
    }
  }

  if (phase === 'intro') {
    return (
      <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: 100 }}>
        <StarField />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '20px 16px 12px' }}>
            <button onClick={() => navigate('/jang')} style={{ width: 36, height: 36, borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ArrowLeft size={18} color="#fff" />
            </button>
            <span style={{ fontWeight: 700, fontSize: 17, color: '#fff' }}>Duel</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 16px' }}>
            <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse-blue 2.5s ease-in-out infinite, float 3s ease-in-out infinite', boxShadow: '0 0 40px rgba(99,102,241,0.4)', marginBottom: 16 }}>
              <Shield size={44} color="#fff" />
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 8 }}>1 vs 1 Duel</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 32, textAlign: 'center' }}>
              Avval Telegram orqali <b>jonli raqib</b> qidiriladi (2 ta haqiqiy foydalanuvchi).<br />
              Vaqt tugasa jonli duel <b>ochilmaydi</b> — xohlasangiz keyin <b>AI mashq</b>ni alohida tanlaysiz (bu jonli duel emas).
            </div>

            <div style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10, marginBottom: 24 }}>
              {[
                { icon: <Clock size={20} color="#60a5fa" />, label: 'Har savol', value: '15 soniya' },
                { icon: <Trophy size={20} color="#F5A623" />, label: "G'alaba uchun", value: '+15 NP' },
              ].map((item, i) => (
                <div key={i} style={{ padding: '16px', borderRadius: 16, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  {item.icon}
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{item.value}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{item.label}</div>
                </div>
              ))}
            </div>

            <button onClick={startSearch} style={{ width: '100%', padding: '16px', borderRadius: 18, background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', border: 'none', color: '#fff', fontWeight: 800, fontSize: 17, cursor: 'pointer', boxShadow: '0 8px 24px rgba(99,102,241,0.4)', animation: 'pulse-blue 2.5s ease-in-out infinite' }}>
              🗡️ Raqib topish
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'searching') {
    return (
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        <StarField />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '20px 16px 12px' }}>
            <button onClick={cancelSearch} style={{ width: 36, height: 36, borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ArrowLeft size={18} color="#fff" />
            </button>
            <span style={{ fontWeight: 700, fontSize: 17, color: '#fff' }}>Raqib qidirilmoqda</span>
          </div>
          <SearchingScreen onCancel={cancelSearch} />
        </div>
      </div>
    )
  }

  if (phase === 'no_match') {
    return (
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        <StarField />
        <div style={{ position: 'relative', zIndex: 1, padding: '24px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <button onClick={() => { setPhase('intro'); setSearching(false) }} style={{ width: 36, height: 36, borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <ArrowLeft size={18} color="#fff" />
            </button>
            <span style={{ fontWeight: 700, fontSize: 17, color: '#fff' }}>Raqib topilmadi</span>
          </div>
          <div style={{ textAlign: 'center', padding: '12px 0 28px' }}>
            <div style={{ fontSize: 44, marginBottom: 14 }}>🤝</div>
            <div style={{ fontSize: 17, fontWeight: 800, color: '#fff', marginBottom: 10 }}>Hozircha jonli raqib yo‘q</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.55, marginBottom: 28 }}>
              Boshqa foydalanuvchilar hali qo‘shmagan. Bu <b>yolg‘on duel emas</b> — shunchaki navbat bo‘sh.<br />
              AI bilan mashq alohida rejim: ball va raqib <b>simulyatsiya</b>.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button
                type="button"
                onClick={() => { setPhase('searching'); void startSearch() }}
                style={{ width: '100%', padding: '14px', borderRadius: 16, background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', border: 'none', color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer' }}
              >
                Qayta qidirish
              </button>
              <button
                type="button"
                onClick={() => {
                  setMatchMode('ai')
                  setOpponentName('AI · mashq')
                  void startDuel('ai')
                }}
                style={{ width: '100%', padding: '14px', borderRadius: 16, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
              >
                AI bilan mashq (jonli emas)
              </button>
              <button
                type="button"
                onClick={() => navigate('/jang/ai')}
                style={{ width: '100%', padding: '12px', borderRadius: 14, background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.45)', fontSize: 13, cursor: 'pointer' }}
              >
                To‘liq AI jang sahifasiga o‘tish →
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'found') {
    return (
      <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <StarField />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', animation: 'resultPop 0.5s ease' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚔️</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Raqib topildi!</div>
          <div style={{ fontSize: 16, color: '#a78bfa', fontWeight: 700 }}>{opponentName}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>
            Jonli duel — savollar bir xil, raqib haqiqiy foydalanuvchi
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'playing') {
    const q = questions[currentQ]
    const progress = (currentQ / questions.length) * 100

    return (
      <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: 100 }}>
        <StarField />
        <div style={{ position: 'relative', zIndex: 1, padding: '20px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>vs {opponentName}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#F5A623' }}>{currentQ + 1}/{questions.length}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: timeLeft <= 5 ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.06)', border: `1px solid ${timeLeft <= 5 ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.1)'}`, borderRadius: 50, padding: '5px 12px' }}>
              <Clock size={13} color={timeLeft <= 5 ? '#ef4444' : '#fff'} />
              <span style={{ fontSize: 13, fontWeight: 700, color: timeLeft <= 5 ? '#ef4444' : '#fff' }}>{timeLeft}s</span>
            </div>
          </div>

          <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.08)', marginBottom: 24, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg,#4f46e5,#7c3aed)', borderRadius: 2, transition: 'width 0.3s ease' }} />
          </div>

          <div style={{ marginBottom: 24, padding: '24px 20px', borderRadius: 22, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center', animation: 'fadeIn 0.3s ease' }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>So'zni toping</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#fff' }}>{q?.word}</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {q?.options?.map((option, idx) => (
              <button key={idx} onClick={() => handleAnswer(idx)} disabled={selected !== null}
                style={{ width: '100%', padding: '16px 18px', borderRadius: 16, background: selected === idx ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.04)', border: selected === idx ? '1.5px solid rgba(239,68,68,0.5)' : '1px solid rgba(255,255,255,0.08)', color: selected === idx ? '#ef4444' : '#fff', fontWeight: 600, fontSize: 15, textAlign: 'left', cursor: selected !== null ? 'default' : 'pointer', transition: 'all 0.2s', animation: `fadeIn 0.3s ${idx * 0.05}s ease both` }}>
                <span style={{ marginRight: 10, fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>{String.fromCharCode(65 + idx)}.</span>
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'result' && result) {
    return (
      <>
        <StarField />
        <ResultScreen result={result} onBack={() => navigate('/jang')} />
      </>
    )
  }

  return null
}