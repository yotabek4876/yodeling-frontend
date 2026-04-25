import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import { ArrowLeft, Zap, Star, Trophy, User } from 'lucide-react'

function StarField() {
  const stars = Array.from({ length: 60 }, (_, i) => ({
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
        position: 'absolute', bottom: '20%', left: '50%', transform: 'translateX(-50%)',
        width: '500px', height: '300px', borderRadius: '50%',
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
        @keyframes pulse-gold {
          0%, 100% { box-shadow: 0 0 16px rgba(245,166,35,0.3); }
          50% { box-shadow: 0 0 36px rgba(245,166,35,0.6), 0 0 60px rgba(245,166,35,0.15); }
        }
        @keyframes shimmer-line {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  )
}

// Medal icon: 1-oltin, 2-kumush, 3-bronza
function MedalIcon({ rank }) {
  if (rank === 1) return (
    <div style={{ fontSize: 22 }}>👑</div>
  )
  if (rank === 2) return (
    <Trophy size={20} color="rgba(180,180,180,0.7)" />
  )
  return (
    <Trophy size={20} color="rgba(180,100,40,0.8)" />
  )
}

// Avatar
function Avatar({ name, size = 44, bg = '#F5A623', textColor = '#fff' }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, position: 'relative',
    }}>
      <User size={size * 0.45} color={textColor} />
    </div>
  )
}

export default function PeshqadamlarPage() {
  const navigate = useNavigate()
  const { user } = useStore()

  // Mock leaderboard data
  const leaderboard = [
    { id: 1, rank: 1, name: 'Ism familya jami so\'zlari', score: 6457, avatarBg: '#F5A623', isTop: true },
    { id: 2, rank: 2, name: 'Ism familya jami so\'zlari', score: 6025, avatarBg: '#4b5563', isTop: false },
    { id: 3, rank: 3, name: 'Ism familya jami so\'zlari', score: 5700, avatarBg: '#374151', isTop: false },
  ]

  const rankColors = {
    1: { border: 'rgba(245,166,35,0.5)', bg: 'rgba(245,166,35,0.08)', glow: true },
    2: { border: 'rgba(255,255,255,0.1)', bg: 'rgba(255,255,255,0.04)', glow: false },
    3: { border: 'rgba(255,255,255,0.08)', bg: 'rgba(255,255,255,0.03)', glow: false },
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
          <button onClick={() => navigate('/')} style={{
            width: 36, height: 36, borderRadius: 12,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0,
          }}>
            <ArrowLeft size={18} color="#fff" />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Trophy size={18} color="#F5A623" />
            <span style={{ fontWeight: 700, fontSize: 17, color: '#fff' }}>
              Jami so'zlar
            </span>
          </div>
        </div>

        {/* ── MENING KARTAM (current user) ── */}
        <div style={{ padding: '4px 16px 0' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 18, padding: '14px 16px',
            backdropFilter: 'blur(12px)',
          }}>
            {/* Avatar with zap badge */}
            <div style={{ position: 'relative' }}>
              <Avatar size={48} bg="#F5A623" />
              <div style={{
                position: 'absolute', bottom: -2, right: -2,
                width: 18, height: 18, borderRadius: '50%',
                background: '#F5A623',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid #0d1117',
              }}>
                <Zap size={10} color="#fff" fill="#fff" />
              </div>
            </div>

            {/* Ism + daraja */}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 4 }}>
                {user.firstName || 'Ism'}
              </div>
              <div style={{
                display: 'inline-flex', alignItems: 'center',
                background: 'rgba(245,166,35,0.2)',
                border: '1px solid rgba(245,166,35,0.3)',
                borderRadius: 20, padding: '2px 10px',
              }}>
                <span style={{ fontSize: 11, color: '#F5A623', fontWeight: 600 }}>Daraja</span>
              </div>
            </div>

            {/* Score */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(34,197,94,0.1)',
              border: '1px solid rgba(34,197,94,0.25)',
              borderRadius: 12, padding: '6px 12px',
            }}>
              <Star size={14} color="#22c55e" fill="#22c55e" />
              <span style={{ fontWeight: 700, fontSize: 15, color: '#22c55e' }}>
                {user.np || 203}
              </span>
            </div>
          </div>
        </div>

        {/* ── JAMI SO'ZLAR SARLAVHA ── */}
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

          {/* ── LEADERBOARD ROWS ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {leaderboard.map((item) => {
              const rc = rankColors[item.rank] || rankColors[3]
              return (
                <div key={item.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  background: rc.bg,
                  border: `1px solid ${rc.border}`,
                  borderRadius: 18, padding: '14px 16px',
                  backdropFilter: 'blur(12px)',
                  animation: rc.glow ? 'pulse-gold 2.5s ease-in-out infinite' : 'none',
                  position: 'relative', overflow: 'hidden',
                  transition: 'transform 0.15s',
                }}>
                  {/* Shimmer (faqat 1-o'rin) */}
                  {rc.glow && (
                    <div style={{
                      position: 'absolute', inset: 0, overflow: 'hidden',
                      borderRadius: 18, pointerEvents: 'none',
                    }}>
                      <div style={{
                        position: 'absolute', top: 0, left: 0,
                        width: '35%', height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(245,166,35,0.08), transparent)',
                        animation: 'shimmer-line 2.5s ease-in-out infinite',
                      }} />
                    </div>
                  )}

                  {/* Medal */}
                  <div style={{
                    width: 32, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <MedalIcon rank={item.rank} />
                  </div>

                  {/* Avatar */}
                  <Avatar
                    size={44}
                    bg={item.avatarBg}
                  />

                  {/* Ism */}
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontWeight: 700, fontSize: 14,
                      color: item.rank === 1 ? '#fff' : 'rgba(255,255,255,0.85)',
                      lineHeight: 1.3,
                    }}>
                      {item.name}
                    </div>
                  </div>

                  {/* Score badge */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    background: item.rank === 1
                      ? 'rgba(245,166,35,0.2)'
                      : 'rgba(34,197,94,0.12)',
                    border: `1px solid ${item.rank === 1
                      ? 'rgba(245,166,35,0.4)'
                      : 'rgba(34,197,94,0.25)'}`,
                    borderRadius: 12, padding: '6px 12px',
                    flexShrink: 0,
                  }}>
                    <Star
                      size={13}
                      color={item.rank === 1 ? '#F5A623' : '#22c55e'}
                      fill={item.rank === 1 ? '#F5A623' : '#22c55e'}
                    />
                    <span style={{
                      fontWeight: 700, fontSize: 14,
                      color: item.rank === 1 ? '#F5A623' : '#22c55e',
                    }}>
                      {item.score.toLocaleString()}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}