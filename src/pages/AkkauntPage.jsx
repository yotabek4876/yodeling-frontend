import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import { Zap, Swords, Trophy, XCircle, Star, Flame, Target, User } from 'lucide-react'

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
        @keyframes shimmer-line {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes glow-badge {
          0%, 100% { box-shadow: 0 0 8px rgba(245,166,35,0.3); }
          50% { box-shadow: 0 0 20px rgba(245,166,35,0.6); }
        }
      `}</style>
    </div>
  )
}

// ── ACHIEVEMENT CARD ────────────────────────────────────────
function AchievementCard({ icon, label, unlocked }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 8, padding: '16px 8px',
      background: unlocked
        ? 'rgba(245,166,35,0.08)'
        : 'rgba(255,255,255,0.03)',
      border: unlocked
        ? '1.5px solid rgba(245,166,35,0.35)'
        : '1px solid rgba(255,255,255,0.07)',
      borderRadius: 18,
      backdropFilter: 'blur(12px)',
      animation: unlocked ? 'glow-badge 2.5s ease-in-out infinite' : 'none',
      cursor: 'pointer',
      transition: 'transform 0.15s',
    }}
      onTouchStart={e => e.currentTarget.style.transform = 'scale(0.95)'}
      onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
      onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
      onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 14,
        background: unlocked
          ? 'rgba(245,166,35,0.15)'
          : 'rgba(255,255,255,0.05)',
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

export default function AkkauntPage() {
  const navigate = useNavigate()
  const { user } = useStore()

  const stats = [
    {
      icon: <Swords size={22} color="#F5A623" />,
      iconBg: 'rgba(245,166,35,0.15)',
      value: 3,
      label: 'Janglar',
    },
    {
      icon: <Trophy size={22} color="#22c55e" />,
      iconBg: 'rgba(34,197,94,0.15)',
      value: 2,
      label: 'Yutuglar',
    },
    {
      icon: <XCircle size={22} color="#ef4444" />,
      iconBg: 'rgba(239,68,68,0.15)',
      value: 1,
      label: "Mag'lubiyat",
    },
  ]

  const achievements = [
    { icon: <Star size={22} color="#F5A623" />,   label: "Birinchi so'z",  unlocked: true  },
    { icon: <Trophy size={22} color="#F5A623" />, label: "10 ta so'z",     unlocked: true  },
    { icon: <Target size={22} color="#F5A623" />, label: 'Birinchi jang',  unlocked: true  },
    { icon: <Flame size={22} color="rgba(255,255,255,0.25)" />,  label: '3 kun streak',   unlocked: false },
    { icon: <Star size={22} color="rgba(255,255,255,0.25)" />,   label: "100 ta so'z",    unlocked: false },
    { icon: <Trophy size={22} color="rgba(255,255,255,0.25)" />, label: "10 jang g'alaba", unlocked: false },
  ]

  return (
    <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: 100 }}>
      <StarField />

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── TOP BAR ── */}
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
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>{user.np}</span>
          </div>
        </div>

        {/* ── HERO CARD (Avatar + ism) ── */}
        <div style={{ padding: '0 16px' }}>
          <div style={{
            borderRadius: 24, overflow: 'hidden',
            position: 'relative',
            border: '1px solid rgba(245,166,35,0.15)',
          }}>
            {/* Gradient orqa fon */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(135deg, #1a0e00 0%, #0f1623 40%, #0a1228 70%, #1a1000 100%)',
            }} />
            {/* Ambient glow top */}
            <div style={{
              position: 'absolute', top: '-30%', left: '50%', transform: 'translateX(-50%)',
              width: '300px', height: '200px', borderRadius: '50%',
              background: 'radial-gradient(ellipse, rgba(245,166,35,0.18) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            {/* Ambient glow bottom-left */}
            <div style={{
              position: 'absolute', bottom: '-20%', left: '-10%',
              width: '200px', height: '200px', borderRadius: '50%',
              background: 'radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            {/* Stars inside hero */}
            {Array.from({ length: 20 }, (_, i) => (
              <div key={i} style={{
                position: 'absolute',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: Math.random() * 1.5 + 0.5,
                height: Math.random() * 1.5 + 0.5,
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                opacity: Math.random() * 0.5 + 0.1,
              }} />
            ))}

            {/* Content */}
            <div style={{
              position: 'relative', zIndex: 1,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', padding: '32px 20px 28px',
            }}>
              {/* Avatar ring */}
              <div style={{
                position: 'relative',
                animation: 'float 3s ease-in-out infinite',
              }}>
                {/* Outer rotating ring */}
                <div style={{
                  position: 'absolute', inset: -6,
                  borderRadius: '50%',
                  border: '2.5px solid transparent',
                  borderTopColor: '#F5A623',
                  borderRightColor: 'rgba(245,166,35,0.3)',
                  animation: 'rotate-ring 3s linear infinite',
                }} />
                {/* Inner ring */}
                <div style={{
                  position: 'absolute', inset: -2,
                  borderRadius: '50%',
                  border: '2px solid rgba(245,166,35,0.25)',
                }} />
                {/* Avatar */}
                <div style={{
                  width: 88, height: 88, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #F5A623, #E8820F)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  animation: 'pulse-avatar 2.5s ease-in-out infinite',
                }}>
                  <User size={42} color="#fff" />
                </div>
                {/* Zap badge */}
                <div style={{
                  position: 'absolute', bottom: 2, right: 2,
                  width: 22, height: 22, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #F5A623, #E8820F)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '2px solid #0d1117',
                  boxShadow: '0 2px 8px rgba(245,166,35,0.5)',
                }}>
                  <Zap size={11} color="#fff" fill="#fff" />
                </div>
              </div>

              {/* Ism */}
              <div style={{
                marginTop: 16, fontWeight: 800, fontSize: 22,
                color: '#fff', letterSpacing: 0.3,
              }}>
                {user.firstName || 'Ism'}
              </div>

              {/* Daraja badge */}
              <div style={{
                marginTop: 8,
                background: 'rgba(245,166,35,0.12)',
                border: '1.5px solid rgba(245,166,35,0.4)',
                borderRadius: 20, padding: '4px 18px',
                animation: 'glow-badge 2.5s ease-in-out infinite',
              }}>
                <span style={{ fontSize: 13, color: '#F5A623', fontWeight: 600 }}>Daraja</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── JANG STATISTIKASI ── */}
        <div style={{ padding: '20px 16px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Swords size={18} color="#F5A623" />
            <span style={{
              fontWeight: 800, fontSize: 17,
              background: 'linear-gradient(90deg, #fff 0%, #F5A623 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Jang statistikasi
            </span>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10,
          }}>
            {stats.map((s, i) => (
              <div key={i} style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 8, padding: '16px 8px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 18, backdropFilter: 'blur(12px)',
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 14,
                  background: s.iconBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {s.icon}
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── ACHIEVEMENTS ── */}
        <div style={{ padding: '20px 16px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Star size={18} color="#F5A623" fill="#F5A623" />
            <span style={{
              fontWeight: 800, fontSize: 17,
              background: 'linear-gradient(90deg, #fff 0%, #F5A623 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Achievements
            </span>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10,
          }}>
            {achievements.map((a, i) => (
              <AchievementCard key={i} {...a} />
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}