import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import { ArrowLeft, Zap, Users, Clock, Trophy, Shield, Crown } from 'lucide-react'

// ── Animatsiyalar ──────────────────────────────────────────
const GLOBAL_CSS = `
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes twinkle { 0%, 100% { opacity: 0; } 50% { opacity: 0.7; } }
  @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-6px); } }
  @keyframes pulse-purple { 0%, 100% { box-shadow: 0 0 20px rgba(139,92,246,0.3); } 50% { box-shadow: 0 0 40px rgba(139,92,246,0.7), 0 0 80px rgba(139,92,246,0.2); } }
  @keyframes searchPulse { 0%, 100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.06); } }
  @keyframes shimmer { 0% { transform: translateX(-150%); } 100% { transform: translateX(350%); } }
  @keyframes resultPop { 0% { transform: scale(0.5); opacity: 0; } 60% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
  @keyframes playerJoin { 0% { opacity: 0; transform: translateX(-20px); } 100% { opacity: 1; transform: translateX(0); } }
  @keyframes timerWarning { 0%, 100% { color: #ef4444; } 50% { color: #fff; } }
`

// ── YULDUZLAR — modul darajasida ──────────────────────────
const STARS = Array.from({ length: 55 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.5,
  delay: Math.random() * 5,
  dur: Math.random() * 3 + 2,
}))

function StarField() {
  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg,#08080f 0%,#0a0c14 45%,#0b0c16 70%,#0a0a0f 100%)' }} />
      <div style={{ position: 'absolute', top: '-10%', left: '30%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(139,92,246,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '20%', right: '-5%', width: '250px', height: '250px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(245,166,35,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
      {STARS.map(s => (
        <div key={s.id} style={{ position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, borderRadius: '50%', backgroundColor: '#fff', opacity: 0, animation: `twinkle ${s.dur}s ${s.delay}s ease-in-out infinite` }} />
      ))}
    </div>
  )
}

// ── RAQIB KARTOCHA ─────────────────────────────────────────
function PlayerCard({ player, isMe, score, answered }) {
  const colors = isMe
    ? { bg: 'rgba(245,166,35,0.08)', border: 'rgba(245,166,35,0.35)', text: '#F5A623', avatar: 'linear-gradient(135deg,#F5A623,#E8820F)' }
    : { bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.35)', text: '#a78bfa', avatar: 'linear-gradient(135deg,#7c3aed,#4f46e5)' }

  return (
    <div style={{ flex: 1, padding: '12px 10px', borderRadius: 16, background: colors.bg, border: `1.5px solid ${colors.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, animation: 'playerJoin 0.4s ease both' }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', background: colors.avatar, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 12px ${colors.border}` }}>
        <span style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>
          {player?.name?.[0] ?? '?'}
        </span>
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#fff', textAlign: 'center', maxWidth: 70, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {player?.name ?? 'Kutilmoqda...'}
      </div>
      <div style={{ fontSize: 18, fontWeight: 800, color: colors.text }}>{score ?? 0}</div>
      {answered && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />}
    </div>
  )
}

// ── QIDIRUV EKRANI ─────────────────────────────────────────
function SearchingScreen({ onCancel, teamCount }) {
  const [dots, setDots] = useState('.')
  useEffect(() => {
    const iv = setInterval(() => setDots(p => p.length >= 3 ? '.' : p + '.'), 500)
    return () => clearInterval(iv)
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '50px 24px', animation: 'fadeIn 0.4s ease' }}>
      {/* Pulsating ring */}
      <div style={{ position: 'relative', marginBottom: 28 }}>
        <div style={{ width: 130, height: 130, borderRadius: '50%', background: 'rgba(139,92,246,0.08)', border: '2px solid rgba(139,92,246,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'searchPulse 2s ease-in-out infinite' }}>
          <div style={{ width: 90, height: 90, borderRadius: '50%', background: 'rgba(139,92,246,0.12)', border: '2px solid rgba(139,92,246,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'searchPulse 2s ease-in-out infinite 0.4s' }}>
            <Users size={38} color="#a78bfa" />
          </div>
        </div>
      </div>

      <div style={{ fontSize: 21, fontWeight: 800, color: '#fff', marginBottom: 8 }}>
        Jamoa qidirilmoqda{dots}
      </div>
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 12, textAlign: 'center', lineHeight: 1.6 }}>
        2 vs 2 guruhli jang uchun<br />teng kuchli jamoalar topilmoqda
      </div>

      {/* Found players indicator */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ width: 36, height: 36, borderRadius: '50%', background: i < teamCount ? (i < 2 ? 'rgba(245,166,35,0.3)' : 'rgba(139,92,246,0.3)') : 'rgba(255,255,255,0.06)', border: `1.5px solid ${i < teamCount ? (i < 2 ? 'rgba(245,166,35,0.5)' : 'rgba(139,92,246,0.5)') : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.4s ease' }}>
            {i < teamCount && <div style={{ width: 8, height: 8, borderRadius: '50%', background: i < 2 ? '#F5A623' : '#a78bfa' }} />}
          </div>
        ))}
      </div>

      <button onClick={onCancel} style={{ padding: '12px 32px', borderRadius: 16, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
        Bekor qilish
      </button>
    </div>
  )
}

// ── NATIJA EKRANI ──────────────────────────────────────────
function ResultScreen({ result, onBack }) {
  const myTeamWon = result.myTeamScore > result.enemyTeamScore

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(12px)' }}>
      <div style={{ width: '90%', maxWidth: 380, borderRadius: 28, padding: '32px 22px', background: 'linear-gradient(135deg,#120a28 0%,#0f1623 50%,#1a1000 100%)', border: `2px solid ${myTeamWon ? 'rgba(34,197,94,0.45)' : 'rgba(239,68,68,0.45)'}`, textAlign: 'center', animation: 'resultPop 0.5s ease-out both' }}>

        <div style={{ fontSize: 56, marginBottom: 8, animation: 'float 3s ease-in-out infinite' }}>
          {myTeamWon ? '🏆' : '😤'}
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: myTeamWon ? '#22c55e' : '#ef4444', marginBottom: 4 }}>
          {myTeamWon ? "Jamoangiz g'alaba qozondi!" : 'Jamoangiz yutqazdi!'}
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginBottom: 20 }}>2 vs 2 Guruhli jang natijasi</div>

        {/* Score grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 8, marginBottom: 18, alignItems: 'center' }}>
          {/* My team */}
          <div style={{ padding: '14px 8px', borderRadius: 16, background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.2)' }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', marginBottom: 5 }}>Sizning jamoa</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#F5A623' }}>{result.myTeamScore}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>to'g'ri</div>
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'rgba(255,255,255,0.3)' }}>vs</div>
          {/* Enemy team */}
          <div style={{ padding: '14px 8px', borderRadius: 16, background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', marginBottom: 5 }}>Raqib jamoa</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#a78bfa' }}>{result.enemyTeamScore}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>to'g'ri</div>
          </div>
        </div>

        {/* My score */}
        <div style={{ marginBottom: 14, padding: '10px 14px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Sizning natija</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{result.myScore}/{result.totalQuestions} to'g'ri</span>
        </div>

        {/* NP */}
        {result.npEarned > 0 && (
          <div style={{ marginBottom: 18, padding: '11px', borderRadius: 14, background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Zap size={15} color="#F5A623" fill="#F5A623" />
            <span style={{ fontWeight: 800, color: '#F5A623', fontSize: 15 }}>+{result.npEarned} NP</span>
          </div>
        )}

        <button onClick={onBack} style={{ width: '100%', padding: '14px', borderRadius: 16, background: 'linear-gradient(135deg,#8b5cf6,#7c3aed)', border: 'none', color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer', boxShadow: '0 4px 20px rgba(139,92,246,0.35)' }}>
          Jang sahifasiga qaytish
        </button>
      </div>
    </div>
  )
}

// ── ASOSIY SAHIFA ──────────────────────────────────────────
export default function GuruhliJangPage() {
  const navigate = useNavigate()
  const { user } = useStore()

  const [phase, setPhase] = useState('intro') // intro | searching | found | playing | result
  const [teamCount, setTeamCount] = useState(1) // found players count simulation
  const [questions, setQuestions] = useState([])
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selected, setSelected] = useState(null)
  const [timeLeft, setTimeLeft] = useState(15)
  const [result, setResult] = useState(null)
  const [myScore, setMyScore] = useState(0)
  const [teammates, setTeammates] = useState([])
  const [enemies, setEnemies] = useState([])
  const timerRef = useState(null)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

  useEffect(() => {
    const id = 'guruh-css'
    if (!document.getElementById(id)) {
      const s = document.createElement('style'); s.id = id; s.textContent = GLOBAL_CSS; document.head.appendChild(s)
    }
  }, [])

  // ── Qidiruv boshlash ──
  const startSearch = () => {
    setPhase('searching')
    setTeamCount(1)

    // Simulate players joining
    const names = ['Alibek', 'Jasur', 'Dilnoza', 'Sardor', 'Malika', 'Bobur', 'Zulfiya', 'Otabek']
    const shuffle = arr => [...arr].sort(() => Math.random() - 0.5)
    const picked = shuffle(names).slice(0, 3)

    // Progressively show players joining
    let count = 1
    const joinInterval = setInterval(() => {
      count++
      setTeamCount(count)
      if (count >= 4) {
        clearInterval(joinInterval)
        const myTeammate = picked[0]
        const enemy1 = picked[1]
        const enemy2 = picked[2]
        setTeammates([{ name: myTeammate }])
        setEnemies([{ name: enemy1 }, { name: enemy2 }])
        setTimeout(() => {
          setPhase('found')
          setTimeout(() => startBattle(), 2200)
        }, 600)
      }
    }, 800 + Math.random() * 600)
  }

  // ── Jang boshlash ──
  const startBattle = async () => {
    try {
      const res = await fetch(`${API_URL}/api/ai-test/session`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      const data = await res.json()
      if (data.error || !data.questions) {
        setPhase('intro')
        return
      }
      setQuestions(data.questions)
      setAnswers([])
      setCurrentQ(0)
      setSelected(null)
      setMyScore(0)
      setPhase('playing')
      startTimer()
    } catch {
      setPhase('intro')
    }
  }

  // ── Timer ──
  const startTimer = () => {
    setTimeLeft(15)
    clearInterval(timerRef[0])
    timerRef[0] = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timerRef[0]); handleAnswer(-1); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  // ── Javob berish ──
  const handleAnswer = (idx) => {
    if (selected !== null) return
    clearInterval(timerRef[0])
    const q = questions[currentQ]
    setSelected(idx)
    const isCorrect = idx === q?.correctIndex
    if (isCorrect) setMyScore(s => s + 1)
    const newAnswers = [...answers, { questionId: q?.id, selectedIndex: idx }]
    setAnswers(newAnswers)

    if (currentQ + 1 >= questions.length) {
      setTimeout(() => submitBattle(newAnswers, myScore + (isCorrect ? 1 : 0)), 1000)
    } else {
      setTimeout(() => {
        setCurrentQ(p => p + 1)
        setSelected(null)
        startTimer()
      }, 900)
    }
  }

  // ── Natija yuborish ──
  const submitBattle = async (finalAnswers, finalScore) => {
    try {
      const res = await fetch(`${API_URL}/api/ai-test/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ answers: finalAnswers, mode: 'group' })
      })
      const data = await res.json()

      // Simulate teammate & enemy scores
      const teammateScore = Math.floor(Math.random() * questions.length * 0.6) + 2
      const enemy1Score   = Math.floor(Math.random() * questions.length * 0.5) + 2
      const enemy2Score   = Math.floor(Math.random() * questions.length * 0.5) + 2
      const myTeamScore   = finalScore + teammateScore
      const enemyTeamScore = enemy1Score + enemy2Score

      setResult({
        myScore: finalScore,
        totalQuestions: questions.length,
        myTeamScore,
        enemyTeamScore,
        npEarned: myTeamScore > enemyTeamScore ? (data.npEarned ?? 10) + 5 : (data.npEarned ?? 3),
      })
      setPhase('result')
    } catch {
      setPhase('intro')
    }
  }

  // ════════════════════════════════════════
  // INTRO
  // ════════════════════════════════════════
  if (phase === 'intro') return (
    <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: 100 }}>
      <StarField />
      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '20px 16px 12px' }}>
          <button onClick={() => navigate('/jang')} style={{ width: 36, height: 36, borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <ArrowLeft size={18} color="#fff" />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={18} color="#8b5cf6" />
            <span style={{ fontWeight: 700, fontSize: 17, color: '#fff' }}>Guruhli jang</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 16px' }}>
          {/* Icon */}
          <div style={{ width: 110, height: 110, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse-purple 2.5s ease-in-out infinite, float 3s ease-in-out infinite', boxShadow: '0 0 40px rgba(139,92,246,0.4)', marginBottom: 16 }}>
            <Users size={48} color="#fff" />
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 6 }}>2 vs 2 Guruhli Jang</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 24, textAlign: 'center', lineHeight: 1.6 }}>
            Random jamoadosh bilan birgalikda<br />raqib jamoaga qarshi jang!
          </div>

          {/* Info kartalar */}
          <div style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10, marginBottom: 14 }}>
            {[
              { icon: <Users size={20} color="#a78bfa" />, label: 'Format', value: '2 vs 2' },
              { icon: <Clock size={20} color="#60a5fa" />, label: 'Har savol', value: '15 soniya' },
              { icon: <Trophy size={20} color="#F5A623" />, label: "G'alaba", value: '+25 NP' },
              { icon: <Shield size={20} color="#22c55e" />, label: 'Savollar', value: '10 ta' },
            ].map((item, i) => (
              <div key={i} style={{ padding: '14px', borderRadius: 16, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, animation: `fadeIn 0.4s ${i * 0.08}s ease both` }}>
                {item.icon}
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{item.value}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{item.label}</div>
              </div>
            ))}
          </div>

          {/* Qoidalar */}
          <div style={{ width: '100%', padding: '14px 16px', borderRadius: 16, background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)', marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: '#a78bfa', fontWeight: 700, marginBottom: 8 }}>Qoidalar</div>
            {[
              'Har bir o\'yinchi 10 ta savolga javob beradi',
              'Jamoaning umumiy to\'g\'ri javoblari hisoblanadi',
              'Ko\'p to\'g\'ri javob bergan jamoa g\'alaba qozonadi',
              'Kuniga 3 ta bepul, VIP — 30 ta',
            ].map((rule, i) => (
              <div key={i} style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 5, display: 'flex', gap: 8 }}>
                <span style={{ color: '#8b5cf6', flexShrink: 0 }}>•</span>
                <span>{rule}</span>
              </div>
            ))}
          </div>

          {/* Boshlash tugmasi */}
          <button onClick={startSearch} style={{ width: '100%', padding: '16px', borderRadius: 18, background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', border: 'none', color: '#fff', fontWeight: 800, fontSize: 17, cursor: 'pointer', boxShadow: '0 8px 28px rgba(139,92,246,0.4)', animation: 'pulse-purple 2.5s ease-in-out infinite', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 18, pointerEvents: 'none' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '35%', height: '100%', background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)', animation: 'shimmer 2.5s ease-in-out infinite' }} />
            </div>
            👥 Jamoa topish
          </button>
        </div>
      </div>
    </div>
  )

  // ════════════════════════════════════════
  // SEARCHING
  // ════════════════════════════════════════
  if (phase === 'searching') return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <StarField />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '20px 16px 12px' }}>
          <button onClick={() => setPhase('intro')} style={{ width: 36, height: 36, borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <ArrowLeft size={18} color="#fff" />
          </button>
          <span style={{ fontWeight: 700, fontSize: 17, color: '#fff' }}>Jamoa qidirilmoqda</span>
        </div>
        <SearchingScreen onCancel={() => setPhase('intro')} teamCount={teamCount} />
      </div>
    </div>
  )

  // ════════════════════════════════════════
  // FOUND
  // ════════════════════════════════════════
  if (phase === 'found') return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <StarField />
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 24px', animation: 'resultPop 0.5s ease' }}>
        <div style={{ fontSize: 52, marginBottom: 12 }}>⚔️</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 16 }}>Jamoalar topildi!</div>

        {/* Teams display */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 12, alignItems: 'center', marginBottom: 16 }}>
          {/* My team */}
          <div style={{ padding: '12px', borderRadius: 16, background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.25)' }}>
            <div style={{ fontSize: 10, color: '#F5A623', fontWeight: 700, marginBottom: 6 }}>SIZNING JAMOA</div>
            <div style={{ fontSize: 12, color: '#fff', marginBottom: 3 }}>{user?.firstName ?? 'Siz'}</div>
            {teammates.map((t, i) => (
              <div key={i} style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{t.name}</div>
            ))}
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'rgba(255,255,255,0.4)' }}>vs</div>
          {/* Enemy team */}
          <div style={{ padding: '12px', borderRadius: 16, background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.25)' }}>
            <div style={{ fontSize: 10, color: '#a78bfa', fontWeight: 700, marginBottom: 6 }}>RAQIB JAMOA</div>
            {enemies.map((e, i) => (
              <div key={i} style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{e.name}</div>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', animation: 'fadeIn 0.5s 0.3s ease both' }}>
          Jang boshlanmoqda...
        </div>
      </div>
    </div>
  )

  // ════════════════════════════════════════
  // PLAYING
  // ════════════════════════════════════════
  if (phase === 'playing') {
    const q = questions[currentQ]
    const progress = (currentQ / questions.length) * 100

    return (
      <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: 100 }}>
        <StarField />
        <div style={{ position: 'relative', zIndex: 1, padding: '16px 16px' }}>

          {/* Scoreboard header */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <PlayerCard player={{ name: user?.firstName ?? 'Siz' }} isMe={true} score={myScore} />
            <PlayerCard player={teammates[0]} isMe={true} score={Math.floor(Math.random() * myScore + 1)} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>vs</div>
            <PlayerCard player={enemies[0]} isMe={false} score={Math.floor(Math.random() * myScore + 1)} />
            <PlayerCard player={enemies[1]} isMe={false} score={Math.floor(Math.random() * myScore + 1)} />
          </div>

          {/* Timer + progress */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{currentQ + 1}/{questions.length}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: timeLeft <= 5 ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.06)', border: `1px solid ${timeLeft <= 5 ? 'rgba(239,68,68,0.35)' : 'rgba(255,255,255,0.1)'}`, borderRadius: 50, padding: '5px 12px' }}>
              <Clock size={13} color={timeLeft <= 5 ? '#ef4444' : '#a78bfa'} />
              <span style={{ fontSize: 13, fontWeight: 700, color: timeLeft <= 5 ? '#ef4444' : '#fff' }}>{timeLeft}s</span>
            </div>
          </div>

          <div style={{ height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.07)', marginBottom: 16, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg,#7c3aed,#4f46e5)', borderRadius: 2, transition: 'width 0.3s ease' }} />
          </div>

          {/* Question card */}
          <div style={{ marginBottom: 16, padding: '22px 18px', borderRadius: 20, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center', animation: 'fadeIn 0.3s ease' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1.5 }}>So'zni toping</div>
            <div style={{ fontSize: 30, fontWeight: 800, color: '#fff', animation: 'float 3s ease-in-out infinite' }}>{q?.word}</div>
          </div>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {q?.options?.map((option, idx) => {
              const isSelected = selected === idx
              const isCorrect = selected !== null && idx === q?.correctIndex
              const isWrong = isSelected && idx !== q?.correctIndex
              return (
                <button key={idx} onClick={() => handleAnswer(idx)} disabled={selected !== null}
                  style={{
                    width: '100%', padding: '14px 16px', borderRadius: 16,
                    background: isCorrect ? 'rgba(34,197,94,0.12)' : isWrong ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.04)',
                    border: isCorrect ? '1.5px solid rgba(34,197,94,0.5)' : isWrong ? '1.5px solid rgba(239,68,68,0.5)' : '1px solid rgba(255,255,255,0.08)',
                    color: isCorrect ? '#22c55e' : isWrong ? '#ef4444' : '#fff',
                    fontWeight: 600, fontSize: 14, textAlign: 'left',
                    cursor: selected !== null ? 'default' : 'pointer',
                    transition: 'all 0.2s',
                    animation: `fadeIn 0.3s ${idx * 0.06}s ease both`,
                    display: 'flex', alignItems: 'center', gap: 10,
                  }}>
                  <span style={{ width: 24, height: 24, borderRadius: 8, background: isCorrect ? 'rgba(34,197,94,0.2)' : isWrong ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'rgba(255,255,255,0.5)', flexShrink: 0 }}>
                    {String.fromCharCode(65 + idx)}
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

  // ════════════════════════════════════════
  // RESULT
  // ════════════════════════════════════════
  if (phase === 'result' && result) return (
    <>
      <StarField />
      <ResultScreen result={result} onBack={() => navigate('/jang')} />
    </>
  )

  return null
}