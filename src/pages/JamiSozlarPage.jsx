import { useState, useMemo, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getWords, deleteWord } from '../api/index'
import {
  ArrowLeft, Zap, Search, Filter, Trash2,
  BookOpen, ChevronDown, X, Volume2, Star
} from 'lucide-react'

// ── YULDUZLAR — modul darajasida (re-render muammosi yo'q) ─
const STARS = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.5,
  delay: Math.random() * 4,
  duration: Math.random() * 3 + 2,
}))

function StarField() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(160deg, #0a0a1a 0%, #0d1117 40%, #0a0f1a 70%, #110a0a 100%)',
      }} />
      <div style={{
        position: 'absolute', top: '5%', left: '50%', transform: 'translateX(-50%)',
        width: '400px', height: '300px', borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(245,166,35,0.06) 0%, transparent 70%)',
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
        @keyframes card-in {
          0% { opacity: 0; transform: translateY(16px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes blink-zap {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes delete-out {
          0% { opacity: 1; transform: translateX(0) scale(1); }
          100% { opacity: 0; transform: translateX(60px) scale(0.9); }
        }
        @keyframes skeletonPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  )
}

const boxColors = {
  1: { bg: 'rgba(245,166,35,0.15)',  border: 'rgba(245,166,35,0.4)',  text: '#F5A623'  },
  2: { bg: 'rgba(99,102,241,0.15)', border: 'rgba(99,102,241,0.4)',  text: '#818cf8'  },
  3: { bg: 'rgba(6,182,212,0.15)',  border: 'rgba(6,182,212,0.4)',   text: '#22d3ee'  },
  4: { bg: 'rgba(139,92,246,0.15)', border: 'rgba(139,92,246,0.4)',  text: '#a78bfa'  },
  5: { bg: 'rgba(236,72,153,0.15)', border: 'rgba(236,72,153,0.4)',  text: '#f472b6'  },
  6: { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.4)',  text: '#34d399'  },
}

function BoxBadge({ box }) {
  const c = boxColors[box] || boxColors[1]
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center',
      background: c.bg, border: `1px solid ${c.border}`,
      borderRadius: 8, padding: '2px 8px',
      fontSize: 10, fontWeight: 700, color: c.text, flexShrink: 0,
    }}>
      B{box}
    </div>
  )
}

function SkeletonCard() {
  return (
    <div style={{
      borderRadius: 16, height: 56,
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.06)',
      animation: 'skeletonPulse 1.5s ease-in-out infinite',
    }} />
  )
}

export default function JamiSozlarPage() {
  const navigate = useNavigate()

  // ── Real state ──────────────────────────────────────────
  const [words, setWords]           = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)
  const [search, setSearch]         = useState('')
  const [activeBox, setActiveBox]   = useState(0)
  const [showFilter, setShowFilter] = useState(false)
  const [sortBy, setSortBy]         = useState('default')
  const [deletingId, setDeletingId] = useState(null)
  const [expandedId, setExpandedId] = useState(null)

  // ── API: So'zlarni yuklash ───────────────────────────────
  const fetchWords = useCallback(() => {
    setLoading(true)
    setError(null)
    getWords()
      .then(res => {
        // Backend: { words: [...] } yoki to'g'ridan array
        const raw = res.data?.words ?? res.data ?? []
        const normalized = raw.map(w => ({
          id:          w.id,
          word:        w.word ?? w.english ?? w.term ?? '',
          translation: w.translation ?? w.uzbek ?? w.meaning ?? '',
          box:         w.box ?? w.srsBox ?? w.level ?? 1,
          learned:     w.learned ?? w.mastered ?? (w.box >= 6) ?? false,
        }))
        setWords(normalized)
      })
      .catch(() => setError("So'zlar yuklanmadi"))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchWords() }, [fetchWords])

  // ── API: O'chirish ──────────────────────────────────────
  const handleDelete = (id, e) => {
    e.stopPropagation()
    setDeletingId(id)
    deleteWord(id)
      .then(() => {
        setTimeout(() => {
          setWords(ws => ws.filter(w => w.id !== id))
          setDeletingId(null)
        }, 350)
      })
      .catch(() => {
        setDeletingId(null)
        // Fallback: UI dan olib tashlash
        setTimeout(() => {
          setWords(ws => ws.filter(w => w.id !== id))
        }, 350)
      })
  }

  // ── Ovoz ────────────────────────────────────────────────
  const handleSpeak = (word, e) => {
    e.stopPropagation()
    if ('speechSynthesis' in window) {
      const utter = new SpeechSynthesisUtterance(word)
      utter.lang = 'en-US'
      window.speechSynthesis.speak(utter)
    }
  }

  // ── Filter + search + sort ───────────────────────────────
  const filtered = useMemo(() => {
    let result = [...words]
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(w =>
        w.word.toLowerCase().includes(q) ||
        w.translation.toLowerCase().includes(q)
      )
    }
    if (activeBox !== 0) result = result.filter(w => w.box === activeBox)
    if (sortBy === 'az')  result.sort((a, b) => a.word.localeCompare(b.word))
    if (sortBy === 'za')  result.sort((a, b) => b.word.localeCompare(a.word))
    if (sortBy === 'box') result.sort((a, b) => a.box - b.box)
    return result
  }, [words, search, activeBox, sortBy])

  const boxCounts = useMemo(() => {
    const counts = { 0: words.length }
    for (let i = 1; i <= 6; i++) counts[i] = words.filter(w => w.box === i).length
    return counts
  }, [words])

  return (
    <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: 100 }}>
      <StarField />

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* TOP BAR */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '20px 16px 12px' }}>
          <button onClick={() => navigate('/bolimlar')} style={{
            width: 36, height: 36, borderRadius: 12,
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0,
          }}>
            <ArrowLeft size={18} color="#fff" />
          </button>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
            <BookOpen size={18} color="#F5A623" />
            <span style={{ fontWeight: 700, fontSize: 17, color: '#fff' }}>Jami so'zlar</span>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'rgba(245,166,35,0.12)', border: '1px solid rgba(245,166,35,0.25)',
            borderRadius: 20, padding: '4px 12px',
          }}>
            <Zap size={12} color="#F5A623" fill="#F5A623"
              style={{ animation: 'blink-zap 2s ease-in-out infinite' }} />
            <span style={{ color: '#F5A623', fontWeight: 700, fontSize: 13 }}>
              {loading ? '...' : words.length}
            </span>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div style={{ margin: '0 16px 10px', padding: '10px 16px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, fontSize: 12, color: '#fca5a5', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <span>⚠️ {error}</span>
            <button onClick={fetchWords} style={{ background: 'none', border: 'none', color: '#F5A623', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Qayta urinish</button>
          </div>
        )}

        {/* QIDIRUV */}
        <div style={{ padding: '0 16px', marginBottom: 12 }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} color="rgba(255,255,255,0.3)"
              style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="So'z qidirish..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.05)',
                border: search ? '1.5px solid rgba(245,166,35,0.4)' : '1px solid rgba(255,255,255,0.08)',
                borderRadius: 14, padding: '12px 40px 12px 40px',
                fontSize: 14, color: '#fff', outline: 'none',
                backdropFilter: 'blur(12px)', transition: 'all 0.25s', fontFamily: 'inherit',
              }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center',
              }}>
                <X size={15} color="rgba(255,255,255,0.4)" />
              </button>
            )}
          </div>
        </div>

        {/* BOX FILTER TABS */}
        <div style={{ display: 'flex', gap: 8, padding: '0 16px', overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
          {[0, 1, 2, 3, 4, 5, 6].map(box => {
            const isActive = activeBox === box
            const c = box === 0 ? null : boxColors[box]
            return (
              <button key={box} onClick={() => setActiveBox(box)} style={{
                flexShrink: 0, padding: '6px 14px', borderRadius: 20,
                fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                background: isActive ? (c ? c.bg : 'rgba(245,166,35,0.15)') : 'rgba(255,255,255,0.04)',
                border: isActive ? `1.5px solid ${c ? c.border : 'rgba(245,166,35,0.4)'}` : '1px solid rgba(255,255,255,0.08)',
                color: isActive ? (c ? c.text : '#F5A623') : 'rgba(255,255,255,0.4)',
              }}>
                {box === 0 ? 'Hammasi' : `Box ${box}`}
                <span style={{ marginLeft: 5, opacity: 0.7 }}>{boxCounts[box] || 0}</span>
              </button>
            )
          })}
        </div>

        {/* SORT FILTER */}
        <div style={{ padding: '10px 16px 0', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowFilter(f => !f)} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: showFilter ? 'rgba(245,166,35,0.1)' : 'rgba(255,255,255,0.04)',
            border: showFilter ? '1px solid rgba(245,166,35,0.3)' : '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12, padding: '6px 12px', cursor: 'pointer', transition: 'all 0.2s',
          }}>
            <Filter size={14} color={showFilter ? '#F5A623' : 'rgba(255,255,255,0.4)'} />
            <span style={{ fontSize: 12, color: showFilter ? '#F5A623' : 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Saralash</span>
            <ChevronDown size={13} color={showFilter ? '#F5A623' : 'rgba(255,255,255,0.4)'}
              style={{ transform: showFilter ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>
        </div>

        {showFilter && (
          <div style={{ margin: '8px 16px 0', padding: '4px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, backdropFilter: 'blur(12px)', animation: 'fade-in 0.2s ease' }}>
            {[
              { key: 'default', label: "Qo'shilgan tartibda" },
              { key: 'az',      label: 'A → Z' },
              { key: 'za',      label: 'Z → A' },
              { key: 'box',     label: "Box bo'yicha" },
            ].map(opt => (
              <button key={opt.key} onClick={() => { setSortBy(opt.key); setShowFilter(false) }}
                style={{
                  width: '100%', padding: '10px 14px',
                  background: sortBy === opt.key ? 'rgba(245,166,35,0.1)' : 'transparent',
                  border: 'none', borderRadius: 10, textAlign: 'left', cursor: 'pointer',
                  fontSize: 13, fontWeight: sortBy === opt.key ? 700 : 400,
                  color: sortBy === opt.key ? '#F5A623' : 'rgba(255,255,255,0.6)',
                  transition: 'all 0.15s',
                }}>
                {opt.label}{sortBy === opt.key && ' ✓'}
              </button>
            ))}
          </div>
        )}

        {/* SO'ZLAR RO'YXATI */}
        <div style={{ padding: '12px 16px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'rgba(255,255,255,0.3)', fontSize: 14, animation: 'fade-in 0.3s ease' }}>
              <BookOpen size={32} color="rgba(255,255,255,0.15)" style={{ margin: '0 auto 12px', display: 'block' }} />
              <div>So'z topilmadi</div>
            </div>
          ) : (
            filtered.map((w, idx) => {
              const c = boxColors[w.box] || boxColors[1]
              const isExpanded = expandedId === w.id
              const isDeleting = deletingId === w.id

              return (
                <div key={w.id}
                  onClick={() => setExpandedId(isExpanded ? null : w.id)}
                  style={{
                    borderRadius: 16, overflow: 'hidden',
                    background: 'rgba(255,255,255,0.04)',
                    border: isExpanded ? `1.5px solid ${c.border}` : '1px solid rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(12px)', cursor: 'pointer', transition: 'all 0.25s',
                    animation: isDeleting ? 'delete-out 0.35s ease forwards' : `card-in 0.3s ease ${idx * 0.03}s both`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px' }}>
                    <BoxBadge box={w.box} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {w.word}
                      </div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {w.translation}
                      </div>
                    </div>
                    {w.learned && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 8, padding: '2px 7px', flexShrink: 0 }}>
                        <Star size={10} color="#22c55e" fill="#22c55e" />
                        <span style={{ fontSize: 9, color: '#22c55e', fontWeight: 600 }}>O'rganildi</span>
                      </div>
                    )}
                    <ChevronDown size={15} color="rgba(255,255,255,0.3)"
                      style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s', flexShrink: 0 }} />
                  </div>

                  {isExpanded && (
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '12px 14px', animation: 'fade-in 0.2s ease' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                        <div>
                          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 3 }}>Inglizcha</div>
                          <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{w.word}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 3 }}>O'zbekcha</div>
                          <div style={{ fontSize: 18, fontWeight: 800, color: c.text }}>{w.translation}</div>
                        </div>
                      </div>
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 5 }}>
                          <span>SRS Progress</span><span>Box {w.box}/6</span>
                        </div>
                        <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                          <div style={{ height: '100%', borderRadius: 2, width: `${(w.box / 6) * 100}%`, background: `linear-gradient(90deg, ${c.text}, ${c.border})`, transition: 'width 0.6s ease', boxShadow: `0 0 6px ${c.border}` }} />
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={e => handleSpeak(w.word, e)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.25)', borderRadius: 12, padding: '9px', cursor: 'pointer', transition: 'all 0.2s' }}
                          onMouseDown={e => { e.stopPropagation(); e.currentTarget.style.background = 'rgba(245,166,35,0.2)' }}
                          onMouseUp={e => e.currentTarget.style.background = 'rgba(245,166,35,0.1)'}>
                          <Volume2 size={15} color="#F5A623" />
                          <span style={{ fontSize: 12, color: '#F5A623', fontWeight: 600 }}>Tinglash</span>
                        </button>
                        <button onClick={e => handleDelete(w.id, e)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: '9px', cursor: 'pointer', transition: 'all 0.2s' }}
                          onMouseDown={e => { e.stopPropagation(); e.currentTarget.style.background = 'rgba(239,68,68,0.18)' }}
                          onMouseUp={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}>
                          <Trash2 size={15} color="#ef4444" />
                          <span style={{ fontSize: 12, color: '#ef4444', fontWeight: 600 }}>O'chirish</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>

        {filtered.length > 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '16px', fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>
            {filtered.length} ta so'z ko'rsatilmoqda
          </div>
        )}

      </div>
    </div>
  )
}