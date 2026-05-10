import { useEffect, useState, useMemo } from 'react'
import useStore from '../store/useStore'
import { api } from '../api/index'
import { Zap, Swords, Trophy, XCircle, Star, Flame, Target, User } from 'lucide-react'

// ── YULDUZLAR: useMemo bilan bir marta yaratiladi ──────────
function StarField() {
  const stars = useMemo(() =>
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      delay: Math.random() * 4,
      duration: Math.random() * 3 + 2,
    }))
  , [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(160deg, #0a0a1a 0%, #0d1117 40%, #0a0f1a 70%, #110a0a 100%)',
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
        @keyframes pulse-avatar {
          0%, 100% { box-shadow: 0 0 0 0 rgba(245,166,35,0.4), 0 0 24px rgba(245,166,35,0.3); }
          50% { box-shadow: 0 0 0 8px rgba(245,166,35,0.0), 0 0 48px rgba(245,166,35,0.5); }
        }
        @keyframes rotate-ring {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes glow-badge {
          0%, 100% { box-shadow: 0 0 8px rgba(245,166,35,0.3); }
          50% { box-shadow: 0 0 20px rgba(245,166,35,0.6); }
        }
        @keyframes skeletonPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  )
}

function AchievementCard({ icon, label, unlocked, loading }) {
  if (loading) {
    return (
      <div style={{
        height: 90, borderRadius: 18,
        background: 'rgba(255,255,255,0.04)',
        animation: 'skeletonPulse 1.5s ease-in-out infinite',
      }} />
    )
  }
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 8, padding: '16px 8px',
      background: unlocked ? 'rgba(245,166,35,0.08)' : 'rgba(255,255,255,0.03)',
      border: unlocked ? '1.5px solid rgba(245,166,35,0.35)' : '1px solid rgba(255,255,255,0.07)',
      borderRadius: 18, backdropFilter: 'blur(12px)',
      animation: unlocked ? 'glow-badge 2.5s ease-in-out infinite' : 'none',
      cursor: 'pointer', transition: 'transform 0.15s',
    }}
      onTouchStart={e => e.currentTarget.style.transform = 'scale(0.95)'}
      onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
      onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
      onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 14,
        background: unlocked ? 'rgba(245,166,35,0.15)' : 'rgba(255,255,255,0.05)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {icon}
      </div>
      <span style={{
        fontSize: 10, textAlign: 'center', lineHeight: 1.3,
        color: unlocked ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.3)',
        fontWeight: unlocked ? 600 : 400,
      }}>
        {label}
      </span>
    </div>
  )
}

function StatSkeleton() {
  return (
    <div style={{
      height: 110, borderRadius: 18,
      background: 'rgba(255,255,255,0.04)',
      animation: 'skeletonPulse 1.5s ease-in-out infinite',
    }} />
  )
}

export default function AkkauntPage() {
  const { user, wordCount } = useStore()

  const [battleStats, setBattleStats] = useState({ total: 0, wins: 0, losses: 0 })
  const [totalWords, setTotalWords]   = useState(wordCount ?? 0)
  const [masteredWords, setMasteredWords] = useState(0)
  const [streak, setStreak]           = useState(0)
  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingWords, setLoadingWords] = useState(true)

  // ── Hero card yulduzlari: bir marta yaratiladi ──
  const heroStars = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      w: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
    }))
  , [])

  // ── API: Profil statistikasi (source of truth) ──
  useEffect(() => {
    setLoadingStats(true)
    api.get('/api/stats/my')
      .then(res => {
        const stats = res.data ?? {}
        setBattleStats({
          total: stats.battles ?? 0,
          wins: stats.wins ?? 0,
          losses: stats.losses ?? 0,
        })
        setStreak(stats.streak ?? 0)
        setTotalWords(stats.totalWords ?? 0)
        setMasteredWords(stats.masteredWords ?? 0)
      })
      .catch(() => {})
      .finally(() => setLoadingStats(false))
  }, [])

  useEffect(() => {
    setLoadingWords(loadingStats)
  }, [loadingStats])

  const firstName = user?.firstName ?? user?.first_name ?? 'Ism'
  const np        = user?.npBalance ?? user?.np ?? 0
  const isLoading = loadingStats || loadingWords

  // ── Stats ──
  const stats = [
    { icon: <Swords size={22} color="#F5A623" />, iconBg: 'rgba(245,166,35,0.15)', value: battleStats.total,  label: 'Janglar'      },
    { icon: <Trophy size={22} color="#22c55e" />, iconBg: 'rgba(34,197,94,0.15)',  value: battleStats.wins,   label: 'Yutuqlar'     },
    { icon: <XCircle size={22} color="#ef4444"/>, iconBg: 'rgba(239,68,68,0.15)', value: battleStats.losses,  label: "Mag'lubiyat"  },
  ]

  // ── Achievements (real data asosida) ──
  const achievements = useMemo(() => [
    { icon: <Star   size={22} color={totalWords >= 1         ? '#F5A623' : 'rgba(255,255,255,0.25)'} />, label: "Birinchi so'z",   unlocked: totalWords >= 1         },
    { icon: <Trophy size={22} color={totalWords >= 10        ? '#F5A623' : 'rgba(255,255,255,0.25)'} />, label: "10 ta so'z",      unlocked: totalWords >= 10        },
    { icon: <Target size={22} color={battleStats.total >= 1  ? '#F5A623' : 'rgba(255,255,255,0.25)'} />, label: 'Birinchi jang',  unlocked: battleStats.total >= 1  },
    { icon: <Flame  size={22} color={streak >= 3             ? '#F5A623' : 'rgba(255,255,255,0.25)'} />, label: '3 kun streak',   unlocked: streak >= 3             },
    { icon: <Star   size={22} color={totalWords >= 100       ? '#F5A623' : 'rgba(255,255,255,0.25)'} />, label: "100 ta so'z",    unlocked: totalWords >= 100       },
    { icon: <Trophy size={22} color={battleStats.wins >= 10  ? '#F5A623' : 'rgba(255,255,255,0.25)'} />, label: "10 jang g'alaba",unlocked: battleStats.wins >= 10  },
  ], [totalWords, battleStats, streak])

  const unlockedCount = achievements.filter(a => a.unlocked).length

  return (
    <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: 100 }}>
      <StarField />

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* TOP BAR */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 16px 12px',
        }}>
          <span style={{ fontWeight: 700, fontSize: 20, color: '#fff' }}>Akkaunt</span>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'rgba(245,166,35,0.12)',
            border: '1px solid rgba(245,166,35,0.3)',
            borderRadius: 50, padding: '5px 12px',
          }}>
            <span style={{ color: '#F5A623', fontSize: 11, fontWeight: 700 }}>NP</span>
            <Zap size={12} color="#F5A623" fill="#F5A623" />
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>{np}</span>
          </div>
        </div>

        {/* HERO CARD */}
        <div style={{ padding: '0 16px' }}>
          <div style={{ borderRadius: 24, overflow: 'hidden', position: 'relative', border: '1px solid rgba(245,166,35,0.15)' }}>
            {/* Gradient fon */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #1a0e00 0%, #0f1623 40%, #0a1228 70%, #1a1000 100%)' }} />
            <div style={{ position: 'absolute', top: '-30%', left: '50%', transform: 'translateX(-50%)', width: '300px', height: '200px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(245,166,35,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

            {/* Hero yulduzlari — useMemo bilan */}
            {heroStars.map(s => (
              <div key={s.id} style={{
                position: 'absolute',
                left: `${s.left}%`, top: `${s.top}%`,
                width: s.w, height: s.w,
                borderRadius: '50%', backgroundColor: '#ffffff', opacity: s.opacity,
              }} />
            ))}

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 20px 28px' }}>
              {/* Avatar */}
              <div style={{ position: 'relative', animation: 'float 3s ease-in-out infinite' }}>
                <div style={{ position: 'absolute', inset: -6, borderRadius: '50%', border: '2.5px solid transparent', borderTopColor: '#F5A623', borderRightColor: 'rgba(245,166,35,0.3)', animation: 'rotate-ring 3s linear infinite' }} />
                <div style={{ position: 'absolute', inset: -2, borderRadius: '50%', border: '2px solid rgba(245,166,35,0.25)' }} />
                <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'linear-gradient(135deg, #F5A623, #E8820F)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse-avatar 2.5s ease-in-out infinite' }}>
                  <User size={42} color="#fff" />
                </div>
                <div style={{ position: 'absolute', bottom: 2, right: 2, width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg, #F5A623, #E8820F)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #0d1117', boxShadow: '0 2px 8px rgba(245,166,35,0.5)' }}>
                  <Zap size={11} color="#fff" fill="#fff" />
                </div>
              </div>

              {/* Ism */}
              <div style={{ marginTop: 16, fontWeight: 800, fontSize: 22, color: '#fff', letterSpacing: 0.3 }}>
                {firstName}
              </div>

              {/* Streak */}
              {streak > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 6 }}>
                  <Flame size={14} color="#F5A623" />
                  <span style={{ fontSize: 12, color: '#F5A623', fontWeight: 700 }}>{streak} kun streak</span>
                </div>
              )}

              {/* Daraja badge */}
              <div style={{ marginTop: 8, background: 'rgba(245,166,35,0.12)', border: '1.5px solid rgba(245,166,35,0.4)', borderRadius: 20, padding: '4px 18px', animation: 'glow-badge 2.5s ease-in-out infinite' }}>
                <span style={{ fontSize: 13, color: '#F5A623', fontWeight: 600 }}>
                  {loadingWords ? 'Yuklanmoqda...' : `${totalWords} so'z · ${masteredWords} o'zlashtirilgan`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* JANG STATISTIKASI */}
        <div style={{ padding: '20px 16px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Swords size={18} color="#F5A623" />
            <span style={{ fontWeight: 800, fontSize: 17, background: 'linear-gradient(90deg, #fff 0%, #F5A623 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Jang statistikasi
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {loadingStats ? (
              Array.from({ length: 3 }).map((_, i) => <StatSkeleton key={i} />)
            ) : (
              stats.map((s, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '16px 8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, backdropFilter: 'blur(12px)' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: s.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {s.icon}
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>{s.label}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ACHIEVEMENTS */}
        <div style={{ padding: '20px 16px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Star size={18} color="#F5A623" fill="#F5A623" />
            <span style={{ fontWeight: 800, fontSize: 17, background: 'linear-gradient(90deg, #fff 0%, #F5A623 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Achievements
            </span>
            <div style={{ marginLeft: 'auto', background: 'rgba(245,166,35,0.12)', border: '1px solid rgba(245,166,35,0.25)', borderRadius: 20, padding: '2px 10px', fontSize: 11, color: '#F5A623', fontWeight: 700 }}>
              {unlockedCount}/{achievements.length}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {achievements.map((a, i) => (
              <AchievementCard key={i} {...a} loading={isLoading} />
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}