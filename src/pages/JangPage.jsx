import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import { ArrowLeft, Zap, Bot, Users } from 'lucide-react'

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
        position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)',
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
        @keyframes pulse-orange {
          0%, 100% { box-shadow: 0 0 24px rgba(245,166,35,0.4); }
          50% { box-shadow: 0 0 48px rgba(245,166,35,0.7), 0 0 80px rgba(245,166,35,0.2); }
        }
        @keyframes shimmer-line {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        @keyframes blink-zap {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}

export default function JangPage() {
  const navigate = useNavigate()
  const { user } = useStore()

  const jangTurlari = [
    {
      id: 'ai',
      title: 'Al ga Qarshi',
      subtitle: "Sun'iy intellekt bilan jang",
      icon: <Bot size={28} color="#92400e" />,
      active: true,
      path: '/jang/ai',
    },
    {
      id: 'duel',
      title: 'Duel',
      subtitle: 'Birga bir jang qiling',
      icon: <Users size={26} color="#F5A623" />,
      active: false,
      path: '/jang/duel',
    },
    {
      id: 'guruh',
      title: 'Guruhli jang',
      subtitle: "4 yoki undan ortiq o'yinchilar bilan",
      icon: <Users size={26} color="#F5A623" />,
      active: false,
      path: '/jang/guruh',
    },
  ]

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
            <Zap size={18} color="#F5A623" fill="#F5A623"
              style={{ animation: 'blink-zap 2s ease-in-out infinite' }} />
            <span style={{ fontWeight: 700, fontSize: 17, color: '#fff' }}>
              Jangni boshlang
            </span>
          </div>
        </div>

        {/* ── SARLAVHA ── */}
        <div style={{ padding: '8px 16px 0' }}>
          <h1 style={{
            fontSize: 26, fontWeight: 800, color: '#fff',
            lineHeight: 1.2, marginBottom: 6,
          }}>
            Jang, va uni boshlang!
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', marginBottom: 4 }}>
            Jang turlarini tanlang:
          </p>
        </div>

        {/* ── JANG TURLARI ── */}
        <div style={{ padding: '14px 16px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {jangTurlari.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              style={{
                width: '100%',
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: 20,
                padding: '20px 18px',
                cursor: 'pointer',
                transition: 'transform 0.15s',
                position: 'relative', overflow: 'hidden',
                ...(item.active ? {
                  background: 'linear-gradient(135deg, #F5A623 0%, #E8820F 100%)',
                  border: 'none',
                  animation: 'pulse-orange 2.5s ease-in-out infinite, float 3s ease-in-out infinite',
                  boxShadow: '0 8px 32px rgba(245,166,35,0.4)',
                } : {
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(12px)',
                }),
              }}
              onTouchStart={e => e.currentTarget.style.transform = 'scale(0.97)'}
              onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              {/* Shimmer (active card) */}
              {item.active && (
                <div style={{
                  position: 'absolute', inset: 0, overflow: 'hidden',
                  borderRadius: 20, pointerEvents: 'none',
                }}>
                  <div style={{
                    position: 'absolute', top: 0, left: 0,
                    width: '40%', height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
                    animation: 'shimmer-line 2.5s ease-in-out infinite',
                  }} />
                </div>
              )}

              {/* Text qismi */}
              <div style={{ textAlign: 'left', flex: 1 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  marginBottom: 5,
                }}>
                  <span style={{
                    fontSize: 18, fontWeight: 800,
                    color: item.active ? '#1a0f00' : '#fff',
                  }}>
                    {item.title}
                  </span>
                  {item.active && (
                    <span style={{ fontSize: 16 }}>✦</span>
                  )}
                </div>
                <span style={{
                  fontSize: 13,
                  color: item.active ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.4)',
                }}>
                  {item.subtitle}
                </span>
              </div>

              {/* Icon qismi */}
              <div style={{
                width: 52, height: 52, borderRadius: 16, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                ...(item.active ? {
                  background: 'rgba(0,0,0,0.15)',
                  border: '1px solid rgba(0,0,0,0.1)',
                } : {
                  background: 'rgba(245,166,35,0.1)',
                  border: '1px solid rgba(245,166,35,0.2)',
                }),
              }}>
                {item.icon}
              </div>
            </button>
          ))}
        </div>

        {/* ── QUOTE ── */}
        <div style={{
          padding: '36px 24px 0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 8,
        }}>
          <span style={{
            fontSize: 13, fontStyle: 'italic',
            color: 'rgba(255,255,255,0.35)',
            textAlign: 'center',
          }}>
            "AI thinks it's winning... prove it wrong."
          </span>
          <Zap size={14} color="#F5A623" fill="#F5A623"
            style={{ flexShrink: 0, animation: 'blink-zap 1.5s ease-in-out infinite' }} />
        </div>

      </div>
    </div>
  )
}