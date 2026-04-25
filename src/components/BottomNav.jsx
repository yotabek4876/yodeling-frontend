import { useNavigate, useLocation } from 'react-router-dom'
import { Home, BookOpen, Swords, Trophy, UserCircle } from 'lucide-react'

const navItems = [
  { path: '/',          label: 'Asosiy',    icon: Home        },
  { path: '/bolimlar',  label: "Bo'limlar", icon: BookOpen    },
  { path: '/jang',      label: 'Jang',      icon: Swords      },
  { path: '/peshqadam', label: 'Peshqadam', icon: Trophy      },
  { path: '/akkaunt',   label: 'Akkaunt',   icon: UserCircle  },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div style={{
      position: 'fixed', bottom: 0,
      left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 480,
      background: 'rgba(10,10,20,0.85)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(255,255,255,0.07)',
      zIndex: 100,
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-around',
        alignItems: 'center', padding: '10px 8px 14px',
      }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 4,
                padding: '6px 12px', borderRadius: 14,
                background: isActive ? 'rgba(245,166,35,0.12)' : 'transparent',
                border: isActive ? '1px solid rgba(245,166,35,0.2)' : '1px solid transparent',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
              onTouchStart={e => e.currentTarget.style.transform = 'scale(0.92)'}
              onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Icon
                size={22}
                color={isActive ? '#F5A623' : 'rgba(255,255,255,0.35)'}
                fill={isActive && item.path === '/' ? '#F5A623' : 'none'}
                strokeWidth={isActive ? 2 : 1.5}
              />
              <span style={{
                fontSize: 10, fontWeight: isActive ? 600 : 400,
                color: isActive ? '#F5A623' : 'rgba(255,255,255,0.35)',
                transition: 'all 0.2s',
              }}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}