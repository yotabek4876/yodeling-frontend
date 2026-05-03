import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import {
  ShoppingBag, Languages, FlaskConical, ListTodo,
  Swords, Zap, Trophy, ChevronRight, Sparkles
} from 'lucide-react'

function StarField() {
  const stars = Array.from({ length: 80 }, (_, i) => ({
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
        position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(245,166,35,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '20%', left: '-10%',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%)',
      }} />
      {stars.map(s => (
        <div key={s.id} style={{
          position: 'absolute',
          left: `${s.x}%`, top: `${s.y}%`,
          width: s.size, height: s.size,
          borderRadius: '50%',
          backgroundColor: '#ffffff',
          opacity: 0,
          animation: `twinkle ${s.duration}s ${s.delay}s ease-in-out infinite`,
        }} />
      ))}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0.8); }
          50% { opacity: 0.8; transform: scale(1.2); }
        }
        @keyframes dash-move {
          to { stroke-dashoffset: -40; }
        }
        @keyframes float-up {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(245,166,35,0.3); }
          50% { box-shadow: 0 0 40px rgba(245,166,35,0.6), 0 0 80px rgba(245,166,35,0.2); }
        }
      `}</style>
    </div>
  )
}

function Roadmap({ boxes }) {
  const positions = [
    { left: true  },
    { left: false },
    { left: true  },
    { left: false },
    { left: true  },
    { left: false },
  ]

  const boxH = 110
  const gap = 50
  const totalH = boxes.length * boxH + (boxes.length - 1) * gap + 40

  const getCX = (i) => positions[i % positions.length].left ? 80 : 260
  const getCY = (i) => 20 + i * (boxH + gap) + boxH / 2

  let pathD = ''
  for (let i = 0; i < boxes.length; i++) {
    const x = getCX(i), y = getCY(i)
    if (i === 0) { pathD += `M ${x} ${y} `; continue }
    const px = getCX(i - 1), py = getCY(i - 1)
    pathD += `C ${px} ${py + 60}, ${x} ${y - 60}, ${x} ${y} `
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: totalH }}>
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: totalH }}
        viewBox={`0 0 360 ${totalH}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <path d={pathD} fill="none" stroke="rgba(245,166,35,0.15)"
          strokeWidth="6" strokeLinecap="round" />
        <path d={pathD} fill="none" stroke="#F5A623"
          strokeWidth="2.5" strokeLinecap="round"
          strokeDasharray="12 10"
          style={{ animation: 'dash-move 1.4s linear infinite' }}
        />
        <path d={pathD} fill="none" stroke="rgba(245,166,35,0.4)"
          strokeWidth="1" strokeLinecap="round"
          strokeDasharray="12 10"
          style={{ animation: 'dash-move 1.4s linear infinite', filter: 'blur(2px)' }}
        />
      </svg>

      {boxes.map((b, i) => {
        const isFirst = i === 0
        const isLeft = positions[i % positions.length].left
        const top = 20 + i * (boxH + gap)

        return (
          <div key={b.box} style={{
            position: 'absolute',
            top,
            left: isLeft ? 16 : 'auto',
            right: isLeft ? 'auto' : 16,
            width: 120,
            height: boxH,
            borderRadius: 20,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            background: isFirst
              ? 'linear-gradient(135deg, #F5A623 0%, #E8820F 100%)'
              : 'rgba(255,255,255,0.04)',
            border: isFirst ? 'none' : '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(12px)',
            animation: isFirst
              ? 'pulse-glow 2.5s ease-in-out infinite, float-up 3s ease-in-out infinite'
              : 'float-up 3s ease-in-out infinite',
            animationDelay: `${i * 0.3}s`,
            cursor: 'pointer',
            transition: 'transform 0.2s',
          }}>
            {/* So'z soni ko'rsatiladi (percent emas) */}
            <div style={{
              fontSize: 26, fontWeight: 800,
              color: isFirst ? '#fff' : 'rgba(255,255,255,0.5)',
              letterSpacing: '-0.5px',
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              {b.total}
              {isFirst && <Zap size={14} color="#fff" fill="#fff" />}
            </div>
            <div style={{
              fontSize: 11, marginTop: 4,
              color: isFirst ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.35)',
              fontWeight: 500,
            }}>
              Box {b.box} • {b.percent}%
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function AsosiyPage() {
  const navigate = useNavigate()
  // ✅ fetchProgress ni ham olamiz
  const { user, boxStats, fetchProgress } = useStore()
  const firstName = user?.firstName || user?.first_name || 'Siz'
  const np = user?.npBalance ?? 0

  // ✅ Sahifaga har kelganda progress yangilanadi
  useEffect(() => {
    fetchProgress()
  }, [fetchProgress])

  const menuItems = [
    { icon: <ShoppingBag size={22} color="#F5A623" />, label: 'SHOP',         path: '/shop'         },
    { icon: <Languages   size={22} color="#F5A623" />, label: 'Uz Eng',       path: '/uzeng'        },
    { icon: <FlaskConical size={22} color="#F5A623"/>, label: 'Labaratoriya', path: '/laboratoriya' },
    { icon: <ListTodo    size={22} color="#F5A623" />, label: 'Due list',     path: '/duelist'      },
  ]

  return (
    <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: 100 }}>
      <StarField />

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* HEADER */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 16px 12px',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(245,166,35,0.12)',
            border: '1px solid rgba(245,166,35,0.3)',
            borderRadius: 50, padding: '6px 14px',
            backdropFilter: 'blur(10px)',
          }}>
            <span style={{ color: '#F5A623', fontSize: 11, fontWeight: 700 }}>NP</span>
            <Zap size={13} color="#F5A623" fill="#F5A623" />
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{np}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontWeight: 600, fontSize: 15, color: '#fff' }}>
              Salom, {firstName}!
            </span>
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'linear-gradient(135deg, #F5A623, #E8820F)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, color: '#fff', fontSize: 15,
              boxShadow: '0 0 16px rgba(245,166,35,0.5)',
            }}>
              {firstName?.[0] || 'S'}
            </div>
          </div>
        </div>

        {/* MENU */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 10, padding: '0 16px', marginTop: 4,
        }}>
          {menuItems.map((item) => (
            <button key={item.label} onClick={() => navigate(item.path)}
              style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 8, padding: '16px 8px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 18, cursor: 'pointer',
                backdropFilter: 'blur(12px)',
                transition: 'all 0.2s',
              }}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
              onTouchStart={e => e.currentTarget.style.transform = 'scale(0.95)'}
              onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div style={{
                width: 46, height: 46, borderRadius: 14,
                background: 'rgba(245,166,35,0.1)',
                border: '1px solid rgba(245,166,35,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {item.icon}
              </div>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', textAlign: 'center', lineHeight: 1.3 }}>
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {/* BO'LIMLAR */}
        <div style={{ padding: '12px 16px 0' }}>
          <button onClick={() => navigate('/bolimlar')}
            style={{
              width: '100%', display: 'flex', alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16, padding: '14px 18px',
              cursor: 'pointer', backdropFilter: 'blur(12px)',
              transition: 'all 0.2s',
            }}
            onTouchStart={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            onTouchEnd={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
          >
            <span style={{ fontWeight: 600, fontSize: 14, color: '#fff' }}>Mening bo'limlarim</span>
            <ChevronRight size={18} color="rgba(255,255,255,0.4)" />
          </button>
        </div>

        {/* JAMI SO'ZLAR */}
        <div style={{ padding: '10px 16px 0' }}>
          <button onClick={() => navigate('/jamisozlar')}
            style={{
              width: '100%', display: 'flex', alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16, padding: '14px 18px',
              cursor: 'pointer', backdropFilter: 'blur(12px)',
              transition: 'all 0.2s',
            }}
            onTouchStart={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            onTouchEnd={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
          >
            <span style={{ fontWeight: 600, fontSize: 14, color: '#fff' }}>Jami so'zlar</span>
            <ChevronRight size={18} color="rgba(255,255,255,0.4)" />
          </button>
        </div>

        {/* JANG */}
        <div style={{ padding: '10px 16px 0' }}>
          <div style={{ marginBottom: 8 }}>
            <Sparkles size={18} color="#F5A623" />
          </div>
          <button onClick={() => navigate('/jang')}
            style={{
              width: '100%', display: 'flex', alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(245,166,35,0.06)',
              border: '1.5px solid rgba(245,166,35,0.5)',
              borderRadius: 18, padding: '14px 16px',
              cursor: 'pointer', backdropFilter: 'blur(12px)',
              boxShadow: '0 0 30px rgba(245,166,35,0.08)',
              transition: 'all 0.2s',
            }}
            onTouchStart={e => {
              e.currentTarget.style.background = 'rgba(245,166,35,0.12)'
              e.currentTarget.style.boxShadow = '0 0 40px rgba(245,166,35,0.2)'
            }}
            onTouchEnd={e => {
              e.currentTarget.style.background = 'rgba(245,166,35,0.06)'
              e.currentTarget.style.boxShadow = '0 0 30px rgba(245,166,35,0.08)'
            }}
          >
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>Jang, AI bilan</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 3 }}>
                Janglar yutuglar yutqazish
              </div>
            </div>
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: 'linear-gradient(135deg, #F5A623, #E8820F)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(245,166,35,0.4)',
            }}>
              <Swords size={22} color="#fff" />
            </div>
          </button>
        </div>

        {/* ROADMAP */}
        <div style={{ padding: '20px 16px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <Zap size={18} color="#F5A623" fill="#F5A623" />
            <span style={{
              fontWeight: 800, fontSize: 18, letterSpacing: 1,
              background: 'linear-gradient(90deg, #fff 0%, #F5A623 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              ROADMAP
            </span>
          </div>
          <Roadmap boxes={boxStats} />
        </div>

        {/* PESHQADAMLAR */}
        <div style={{ padding: '24px 16px 0' }}>
          <button onClick={() => navigate('/peshqadam')}
            style={{
              width: '100%', display: 'flex', alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 18, padding: '14px 18px',
              cursor: 'pointer', backdropFilter: 'blur(12px)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Trophy size={20} color="#F5A623" />
              <span style={{ fontWeight: 600, fontSize: 14, color: '#fff' }}>
                Peshqadamlar jadvali
              </span>
            </div>
            <div style={{ display: 'flex' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: `rgba(255,255,255,${0.08 + i * 0.04})`,
                  border: '2px solid rgba(255,255,255,0.1)',
                  marginLeft: i > 0 ? -8 : 0,
                }} />
              ))}
            </div>
          </button>
        </div>

      </div>
    </div>
  )
}