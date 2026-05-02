import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import { api } from '../api/index'
import { ArrowLeft, Zap, Star, Trophy, User } from 'lucide-react'

// ── YULDUZLAR: useMemo bilan bir marta yaratiladi ──────────
const STARS = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.5,
  delay: Math.random() * 4,
  duration: Math.random() * 3 + 2,
}))

function StarField() {
  // useMemo olib tashlandi — STARS tashqarida
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(160deg, #0a0a1a 0%, #0d1117 40%, #0a0f1a 70%, #110a0a 100%)',
      }} />
      <div style={{
        position: 'absolute', bottom: '20%', left: '50%', transform: 'translateX(-50%)',
        width: '500px', height: '300px', borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(245,166,35,0.07) 0%, transparent 70%)',
      }} />
      {STARS.map(s => (
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
        @keyframes pulse-gold {
          0%, 100% { box-shadow: 0 0 16px rgba(245,166,35,0.3); }
          50% { box-shadow: 0 0 36px rgba(245,166,35,0.6), 0 0 60px rgba(245,166,35,0.15); }
        }
        @keyframes shimmer-line {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        @keyframes skeletonPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  )
}


function MedalIcon({ rank }) {
  if (rank === 1) return <div style={{ fontSize: 22 }}>👑</div>
  if (rank === 2) return <Trophy size={20} color="rgba(180,180,180,0.7)" />
  return <Trophy size={20} color="rgba(180,100,40,0.8)" />
}

function Avatar({ size = 44, bg = '#F5A623' }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <User size={size * 0.45} color="#fff" />
    </div>
  )
}

function SkeletonRow() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 18, padding: '14px 16px',
      animation: 'skeletonPulse 1.5s ease-in-out infinite',
    }}>
      <div style={{ width: 32, height: 24, borderRadius: 6, background: 'rgba(255,255,255,0.08)' }} />
      <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} />
      <div style={{ flex: 1, height: 14, borderRadius: 6, background: 'rgba(255,255,255,0.08)' }} />
      <div style={{ width: 60, height: 30, borderRadius: 12, background: 'rgba(255,255,255,0.08)' }} />
    </div>
  )
}

const AVATAR_COLORS = ['#F5A623', '#6366f1', '#06b6d4', '#8b5cf6', '#ec4899', '#10b981']
const rankColors = {
  1: { border: 'rgba(245,166,35,0.5)',   bg: 'rgba(245,166,35,0.08)',  glow: true  },
  2: { border: 'rgba(255,255,255,0.1)',  bg: 'rgba(255,255,255,0.04)', glow: false },
  3: { border: 'rgba(255,255,255,0.08)', bg: 'rgba(255,255,255,0.03)', glow: false },
}

export default function PeshqadamlarPage() {
  const navigate = useNavigate()
  const { user, leaderboard, setLeaderboard } = useStore()

  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  // ── API: Leaderboard ──
  useEffect(() => {
    setLoading(true)
    api.get('/api/stats/leaderboard')
      .then(res => {
        const raw = res.data?.leaderboard ?? res.data ?? []
        const normalized = raw.map((item, i) => ({
          id:       item.id    ?? i + 1,
          rank:     item.rank  ?? i + 1,
          name:     [item.firstName, item.lastName].filter(Boolean).join(' ') || item.name || 'Foydalanuvchi',
          score:    item.score ?? item.np ?? item.wordCount ?? 0,
          avatarBg: AVATAR_COLORS[i % AVATAR_COLORS.length],
        }))
        setLeaderboard(normalized)
      })
      .catch(() => setError("Leaderboard yuklanmadi"))
      .finally(() => setLoading(false))
  }, [])

  const firstName = user?.firstName ?? user?.first_name ?? 'Siz'
  const np        = user?.np ?? 0
  const userRank  = useMemo(() =>
    leaderboard?.findIndex(l => l.id === user?.id) + 1 || '—'
  , [leaderboard, user])

  return (
    <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: 100 }}>
      <StarField />

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* TOP BAR */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '20px 16px 12px' }}>
          <button onClick={() => navigate('/')} style={{
            width: 36, height: 36, borderRadius: 12,
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0,
          }}>
            <ArrowLeft size={18} color="#fff" />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
            <Trophy size={18} color="#F5A623" />
            <span style={{ fontWeight: 700, fontSize: 17, color: '#fff' }}>Peshqadamlar jadvali</span>
          </div>
          {userRank !== '—' && (
            <div style={{
              background: 'rgba(245,166,35,0.12)', border: '1px solid rgba(245,166,35,0.3)',
              borderRadius: 20, padding: '4px 12px', fontSize: 12, color: '#F5A623', fontWeight: 700,
            }}>
              #{userRank}
            </div>
          )}
        </div>

        {/* MENING KARTAM */}
        <div style={{ padding: '4px 16px 0' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14,
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 18, padding: '14px 16px', backdropFilter: 'blur(12px)',
          }}>
            <div style={{ position: 'relative' }}>
              <Avatar size={48} bg="#F5A623" />
              <div style={{
                position: 'absolute', bottom: -2, right: -2,
                width: 18, height: 18, borderRadius: '50%', background: '#F5A623',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid #0d1117',
              }}>
                <Zap size={10} color="#fff" fill="#fff" />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 4 }}>{firstName}</div>
              <div style={{
                display: 'inline-flex', alignItems: 'center',
                background: 'rgba(245,166,35,0.2)', border: '1px solid rgba(245,166,35,0.3)',
                borderRadius: 20, padding: '2px 10px',
              }}>
                <span style={{ fontSize: 11, color: '#F5A623', fontWeight: 600 }}>Daraja</span>
              </div>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)',
              borderRadius: 12, padding: '6px 12px',
            }}>
              <Star size={14} color="#22c55e" fill="#22c55e" />
              <span style={{ fontWeight: 700, fontSize: 15, color: '#22c55e' }}>{np}</span>
            </div>
          </div>
        </div>

        {/* LEADERBOARD */}
        <div style={{ padding: '20px 16px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Zap size={18} color="#F5A623" fill="#F5A623" />
            <span style={{
              fontWeight: 800, fontSize: 17,
              background: 'linear-gradient(90deg, #fff 0%, #F5A623 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Jami so'zlar
            </span>
          </div>

          {error && (
            <div style={{
              padding: '10px 16px', marginBottom: 10,
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 12, fontSize: 12, color: '#fca5a5', textAlign: 'center',
            }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)
            ) : leaderboard.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>
                <Trophy size={32} color="rgba(255,255,255,0.1)" style={{ margin: '0 auto 12px', display: 'block' }} />
                <div>Hali hech kim yo'q</div>
              </div>
            ) : (
              leaderboard.map((item) => {
                const rc = rankColors[item.rank] || { border: 'rgba(255,255,255,0.07)', bg: 'rgba(255,255,255,0.02)', glow: false }
                const isMe = item.id === user?.id
                return (
                  <div key={item.id} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    background: isMe ? 'rgba(245,166,35,0.06)' : rc.bg,
                    border: `1px solid ${isMe ? 'rgba(245,166,35,0.35)' : rc.border}`,
                    borderRadius: 18, padding: '14px 16px',
                    backdropFilter: 'blur(12px)',
                    animation: rc.glow ? 'pulse-gold 2.5s ease-in-out infinite' : 'none',
                    position: 'relative', overflow: 'hidden',
                  }}>
                    {rc.glow && (
                      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 18, pointerEvents: 'none' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '35%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(245,166,35,0.08), transparent)', animation: 'shimmer-line 2.5s ease-in-out infinite' }} />
                      </div>
                    )}
                    <div style={{ width: 32, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MedalIcon rank={item.rank} />
                    </div>
                    <Avatar size={44} bg={item.avatarBg} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: item.rank === 1 ? '#fff' : 'rgba(255,255,255,0.85)', lineHeight: 1.3 }}>
                        {item.name}
                      </div>
                      {isMe && <div style={{ fontSize: 10, color: '#F5A623', fontWeight: 600, marginTop: 2 }}>Siz</div>}
                    </div>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      background: item.rank === 1 ? 'rgba(245,166,35,0.2)' : 'rgba(34,197,94,0.12)',
                      border: `1px solid ${item.rank === 1 ? 'rgba(245,166,35,0.4)' : 'rgba(34,197,94,0.25)'}`,
                      borderRadius: 12, padding: '6px 12px', flexShrink: 0,
                    }}>
                      <Star size={13} color={item.rank === 1 ? '#F5A623' : '#22c55e'} fill={item.rank === 1 ? '#F5A623' : '#22c55e'} />
                      <span style={{ fontWeight: 700, fontSize: 14, color: item.rank === 1 ? '#F5A623' : '#22c55e' }}>
                        {item.score.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

      </div>
    </div>
  )
}