import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/index'
import {
  ArrowLeft, Zap, Package, Gift, Crown,
  Star, Flame, BookOpen, MessageCircle, Box,
  Sparkles, Lock, Check
} from 'lucide-react'

const GLOBAL_CSS = `
  @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes twinkle { 0%, 100% { opacity: 0; } 50% { opacity: 0.7; } }
  @keyframes shimmer { 0% { transform: translateX(-150%); } 100% { transform: translateX(350%); } }
  @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-6px); } }
  @keyframes glow { 0%, 100% { box-shadow: 0 0 20px rgba(245,166,35,0.3); } 50% { box-shadow: 0 0 40px rgba(245,166,35,0.6); } }
  @keyframes mysteryPulse { 0%, 100% { box-shadow: 0 0 30px rgba(139,92,246,0.4); } 50% { box-shadow: 0 0 60px rgba(139,92,246,0.8); } }
  @keyframes rewardPop { 0% { transform: scale(0) rotate(-10deg); opacity: 0; } 60% { transform: scale(1.15) rotate(3deg); } 100% { transform: scale(1) rotate(0deg); opacity: 1; } }
  @keyframes confetti { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(200px) rotate(720deg); opacity: 0; } }
  @keyframes skeletonPulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }
  @keyframes rotateSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`

const SHOP_STARS = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: (i * 19.1) % 100,
  y: (i * 27.3) % 100,
  size: 0.55 + (i % 5) * 0.35,
  delay: (i % 9) * 0.35,
  dur: 2.2 + (i % 4) * 0.45,
}))

// ── YULDUZLAR ──────────────────────────────────────────────
function StarField() {
  const stars = SHOP_STARS
  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg,#08080f 0%,#0a0c14 45%,#0b0c16 70%,#0a0a0f 100%)' }} />
      {stars.map(s => (
        <div key={s.id} style={{ position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, borderRadius: '50%', backgroundColor: '#fff', opacity: 0, animation: `twinkle ${s.dur}s ${s.delay}s ease-in-out infinite` }} />
      ))}
    </div>
  )
}

// ── MYSTERY BOX MODAL ──────────────────────────────────────
function MysteryBoxModal({ reward, onClose }) {
  if (!reward) return null
  const rarityColors = {
    COMMON: '#9ca3af',
    RARE: '#60a5fa',
    EPIC: '#a78bfa',
    LEGENDARY: '#F5A623',
  }
  const rarityEmoji = {
    COMMON: '⭐', RARE: '💫', EPIC: '✨', LEGENDARY: '🌟'
  }
  const clr = rarityColors[reward.rarity] || '#F5A623'

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
      <div style={{ width: '85%', maxWidth: 340, borderRadius: 28, padding: '32px 24px', background: 'linear-gradient(135deg,#1a0e30 0%,#0f1623 50%,#1a1000 100%)', border: `2px solid ${clr}40`, boxShadow: `0 0 60px ${clr}30`, animation: 'rewardPop 0.5s ease-out both', textAlign: 'center' }}>
        <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 3, color: clr, textTransform: 'uppercase', marginBottom: 8 }}>
          {rarityEmoji[reward.rarity]} {reward.rarity}
        </div>
        <div style={{ fontSize: 64, marginBottom: 12, animation: 'float 3s ease-in-out infinite' }}>
          {reward.type === 'NP' ? '⚡' : reward.type === 'BADGE' ? '🏅' : '🎁'}
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 8 }}>
          {reward.type === 'NP' ? `+${reward.amount} NP` : reward.itemName || 'Sovg\'a!'}
        </div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 24 }}>
          {reward.type === 'NP' ? 'NP balansingizga qo\'shildi!' : 'Inventaringizga qo\'shildi!'}
        </div>
        <button onClick={onClose} style={{ width: '100%', padding: '14px', borderRadius: 16, background: `linear-gradient(135deg,${clr},${clr}99)`, border: 'none', color: '#fff', fontWeight: 800, fontSize: 16, cursor: 'pointer' }}>
          Zo'r! 🎉
        </button>
      </div>
    </div>
  )
}

// ── SHOP ITEM CARD ─────────────────────────────────────────
function ShopCard({ item, npBalance, onBuy, loading }) {
  const typeIcons = {
    XP_BOOSTER: <Flame size={22} color="#F5A623" />,
    PROFILE_FRAME: <Star size={22} color="#a78bfa" />,
    BADGE: <Crown size={22} color="#F5A623" />,
    SMART_BOOK: <BookOpen size={22} color="#60a5fa" />,
    CHAT_ACCESS: <MessageCircle size={22} color="#34d399" />,
    VIP: <Crown size={22} color="#F5A623" />,
    MYSTERY_BOX: <Box size={22} color="#a78bfa" />,
  }
  const tierColors = {
    FREE: '#F5A623',
    PREMIUM: '#a78bfa',
    VIP: '#F5A623',
  }
  const clr = tierColors[item.tier] || '#F5A623'
  const canAfford = npBalance >= (item.npPrice || 0)
  const meta = item.metadata || {}
  const emoji = meta.emoji || null
  const isVip = item.type === 'VIP'
  const isBooster = item.type === 'XP_BOOSTER'
  const copies = item.ownedCopies ?? 0

  return (
    <div style={{
      borderRadius: 20, padding: '18px 16px',
      background: item.owned ? 'rgba(34,197,94,0.06)' : `rgba(${item.tier === 'PREMIUM' ? '139,92,246' : item.tier === 'VIP' ? '245,166,35' : '245,166,35'},0.05)`,
      border: item.owned ? '1.5px solid rgba(34,197,94,0.3)' : `1.5px solid ${clr}25`,
      backdropFilter: 'blur(12px)',
      animation: 'fadeIn 0.4s ease both',
      position: 'relative', overflow: 'hidden',
    }}>
      {!item.owned && !isVip && (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 20, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '35%', height: '100%', background: `linear-gradient(90deg,transparent,${clr}08,transparent)`, animation: 'shimmer 3s ease-in-out infinite' }} />
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, flexShrink: 0, background: `${clr}18`, border: `1px solid ${clr}35`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          {emoji && <span style={{ fontSize: 22, lineHeight: 1 }}>{emoji}</span>}
          <div style={{ opacity: emoji ? 0.85 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {typeIcons[item.type] || <Package size={20} color={clr} />}
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>{item.name}</span>
            {item.tier !== 'FREE' && (
              <span style={{ fontSize: 9, fontWeight: 700, color: clr, background: `${clr}20`, border: `1px solid ${clr}40`, borderRadius: 20, padding: '2px 7px', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {item.tier}
              </span>
            )}
          </div>
          <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.45)', lineHeight: 1.4, marginBottom: 8 }}>
            {item.description}
          </div>
          {meta.durationMinutes && (
            <div style={{ fontSize: 10, color: clr, marginBottom: 6 }}>
              ⏱ {meta.durationMinutes} daqiqa
            </div>
          )}
          {meta.topic && (
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginBottom: 6 }}>
              📂 {String(meta.topic)}
            </div>
          )}

          {isVip && (
            <div style={{ marginTop: 4, marginBottom: 8 }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#F5A623' }}>
                {item.realPrice != null ? `$${Number(item.realPrice).toFixed(2)}` : '—'} <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)' }}>{meta.currency || 'USD'}</span>
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>
                To‘lov integratsiyasi tez orada — @support yoki bot orqali
              </div>
            </div>
          )}

          {isBooster && copies > 0 && (
            <div style={{ fontSize: 10, color: 'rgba(245,166,35,0.75)', marginBottom: 8 }}>
              Inventarda aktiv yozuvlar: <b>{copies}</b> (har sotib olish yangi muddat)
            </div>
          )}

          {item.owned ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#22c55e', fontSize: 12, fontWeight: 700 }}>
              <Check size={14} /> Sizda bor
            </div>
          ) : isVip ? (
            <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.25)' }}>NP emas — to‘lov</div>
          ) : item.npPrice ? (
            <button
              onClick={() => onBuy(item)}
              disabled={loading || !canAfford}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: canAfford ? `linear-gradient(135deg,${clr},${clr}bb)` : 'rgba(255,255,255,0.08)',
                border: 'none', borderRadius: 12, padding: '8px 14px',
                color: canAfford ? '#fff' : 'rgba(255,255,255,0.3)',
                fontWeight: 700, fontSize: 13, cursor: canAfford ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
              }}
            >
              {!canAfford && <Lock size={12} />}
              <Zap size={13} fill={canAfford ? '#fff' : 'rgba(255,255,255,0.3)'} color={canAfford ? '#fff' : 'rgba(255,255,255,0.3)'} />
              {item.npPrice} NP
            </button>
          ) : (
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>Tez kunda...</div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── MYSTERY BOX SECTION ────────────────────────────────────
function MysteryBoxSection({ onClaim, onOpen, boxes, loading, onPremiumHint }) {
  const hasUnopenedBox = boxes?.some(b => !b.isOpened)

  return (
    <div style={{ padding: '0 16px', marginBottom: 8 }}>
      <div style={{ borderRadius: 24, padding: '24px 20px', background: 'linear-gradient(135deg,rgba(139,92,246,0.12),rgba(99,102,241,0.06))', border: '1.5px solid rgba(139,92,246,0.35)', animation: 'mysteryPulse 3s ease-in-out infinite', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-30%', right: '-10%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(ellipse,rgba(139,92,246,0.15) 0%,transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ fontSize: 40, animation: 'float 3s ease-in-out infinite' }}>🎁</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, color: '#fff' }}>Mystery Box</div>
            <div style={{ fontSize: 12, color: 'rgba(167,139,250,0.8)', marginTop: 2 }}>Har oyda 1 ta bepul!</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          {hasUnopenedBox ? (
            <button onClick={() => onOpen(boxes.find(b => !b.isOpened)?.id)} disabled={loading}
              style={{ flex: 1, padding: '12px', borderRadius: 14, background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', border: 'none', color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Sparkles size={16} /> Ochish!
            </button>
          ) : (
            <button onClick={onClaim} disabled={loading}
              style={{ flex: 1, padding: '12px', borderRadius: 14, background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', border: 'none', color: '#fff', fontWeight: 800, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Gift size={16} /> Bepul olish
            </button>
          )}
          <button type="button" onClick={onPremiumHint} style={{ padding: '12px 16px', borderRadius: 14, background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', color: '#a78bfa', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
            💎 Pullik (tez orada)
          </button>
        </div>
      </div>
    </div>
  )
}

// ── MAIN PAGE ──────────────────────────────────────────────
export default function ShopPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [npBalance, setNpBalance] = useState(0)
  const [boxes, setBoxes] = useState([])
  const [loading, setLoading] = useState(true)
  const [buyLoading, setBuyLoading] = useState(false)
  const [reward, setReward] = useState(null)
  const [activeTab, setActiveTab] = useState('all')
  const [toast, setToast] = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const loadShop = async (showSpinner = true) => {
    if (showSpinner) setLoading(true)
    try {
      const shopRes = await api.get('/api/shop')
      setItems(shopRes.data.items || [])
      setNpBalance(shopRes.data.npBalance || 0)
      setBoxes(shopRes.data.mysteryBoxes || [])
    } catch (err) {
      showToast('Yuklanmadi', 'error')
    } finally {
      if (showSpinner) setLoading(false)
    }
  }

  useEffect(() => {
    const id = 'shop-css'
    if (!document.getElementById(id)) {
      const s = document.createElement('style'); s.id = id; s.textContent = GLOBAL_CSS; document.head.appendChild(s)
    }
    loadShop(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleBuy = async (item) => {
    setBuyLoading(true)
    try {
      await api.post('/api/shop/buy', { itemId: item.id })
      await loadShop(false)
      showToast(`✅ ${item.name} sotib olindi!`)
    } catch (err) {
      showToast(err.response?.data?.error || 'Xatolik', 'error')
    } finally {
      setBuyLoading(false)
    }
  }

  const handleClaimBox = async () => {
    setBuyLoading(true)
    try {
      const res = await api.post('/api/shop/mystery-box/claim')
      setBoxes(prev => [...prev, res.data.box])
      showToast('🎁 Mystery Box olindi! Ochish tugmasini bosing!')
    } catch (err) {
      showToast(err.response?.data?.error || 'Xatolik', 'error')
    } finally {
      setBuyLoading(false)
    }
  }

  const handleOpenBox = async (boxId) => {
    if (!boxId) return
    setBuyLoading(true)
    try {
      const res = await api.post('/api/shop/mystery-box/open', { boxId })
      setReward(res.data.reward)
      setBoxes(prev => prev.map(b => b.id === boxId ? { ...b, isOpened: true } : b))
      if (res.data.reward.type === 'NP') {
        setNpBalance(prev => prev + (res.data.reward.amount || 0))
      }
    } catch (err) {
      showToast(err.response?.data?.error || 'Xatolik', 'error')
    } finally {
      setBuyLoading(false)
    }
  }

  const catalogItems = useMemo(() => items.filter((i) => i.type !== 'VIP'), [items])
  const vipItems = useMemo(() => items.filter((i) => i.type === 'VIP'), [items])

  const tabs = [
    { key: 'all', label: 'Hammasi' },
    { key: 'XP_BOOSTER', label: '⚡ Booster' },
    { key: 'PROFILE_FRAME', label: '🖼 Frame' },
    { key: 'BADGE', label: '🏅 Badge' },
    { key: 'SMART_BOOK', label: '📚 Kitob' },
    { key: 'CHAT_ACCESS', label: '💬 Chat' },
  ]

  const filtered = activeTab === 'all' ? catalogItems : catalogItems.filter((i) => i.type === activeTab)

  return (
    <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: 110, color: '#fff', overflow: 'hidden' }}>
      <StarField />

      {/* Reward Modal */}
      {reward && <MysteryBoxModal reward={reward} onClose={() => setReward(null)} />}

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 99, background: toast.type === 'error' ? 'rgba(239,68,68,0.95)' : 'rgba(34,197,94,0.95)', backdropFilter: 'blur(10px)', borderRadius: 14, padding: '12px 20px', fontSize: 13, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', animation: 'fadeIn 0.3s ease' }}>
          {toast.msg}
        </div>
      )}

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* TOP BAR */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 16px 14px' }}>
          <button onClick={() => navigate('/')} style={{ width: 38, height: 38, borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.11)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <ArrowLeft size={20} color="#fff" />
          </button>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 800, fontSize: 19, color: '#fff' }}>Shop</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Kuchingizni oshiring</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(245,166,35,0.12)', border: '1px solid rgba(245,166,35,0.3)', borderRadius: 50, padding: '7px 13px' }}>
            <Zap size={13} color="#F5A623" fill="#F5A623" />
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>{npBalance}</span>
          </div>
        </div>

        {/* NP EARN INFO */}
        <div style={{ margin: '0 16px 16px', padding: '14px 16px', borderRadius: 16, background: 'rgba(245,166,35,0.06)', border: '1px solid rgba(245,166,35,0.15)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Zap size={20} color="#F5A623" fill="#F5A623" />
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>NP qanday topiladi?</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>So'z o'rganish • SRS sessiya • Jang g'alabasi</div>
          </div>
        </div>

        {/* MYSTERY BOX */}
        <MysteryBoxSection
          onClaim={handleClaimBox}
          onOpen={handleOpenBox}
          boxes={boxes}
          loading={buyLoading}
          onPremiumHint={() => showToast('Pullik Mystery box tez orada — hozircha oylik bepul box ishlatiladi.', 'error')}
        />

        {vipItems.length > 0 && (
          <div style={{ margin: '12px 16px 0' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#F5A623', marginBottom: 10, letterSpacing: 0.4 }}>VIP — real narx (NP emas)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {vipItems.map((v) => (
                <ShopCard key={v.id} item={v} npBalance={npBalance} onBuy={() => {}} loading={buyLoading} />
              ))}
            </div>
          </div>
        )}

        {/* TABS */}
        <div style={{ padding: '4px 16px 12px', display: 'flex', gap: 8, overflowX: 'auto' }}>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              style={{ flexShrink: 0, padding: '7px 14px', borderRadius: 50, background: activeTab === tab.key ? 'rgba(245,166,35,0.2)' : 'rgba(255,255,255,0.05)', border: activeTab === tab.key ? '1.5px solid rgba(245,166,35,0.5)' : '1px solid rgba(255,255,255,0.1)', color: activeTab === tab.key ? '#F5A623' : 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ITEMS */}
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ height: 100, borderRadius: 20, background: 'rgba(255,255,255,0.04)', animation: `skeletonPulse 1.5s ${i * 0.1}s ease-in-out infinite` }} />
            ))
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>
              Bu bo'limda hozircha itemlar yo'q
            </div>
          ) : (
            filtered.map(item => (
              <ShopCard key={item.id} item={item} npBalance={npBalance} onBuy={handleBuy} loading={buyLoading} />
            ))
          )}
        </div>

      </div>
    </div>
  )
}