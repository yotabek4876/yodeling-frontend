import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import useStore from '../store/useStore'
import { ArrowLeft, Zap, ListTodo, Plus, BookOpen, Star, ChevronRight, Sparkles, TrendingUp } from 'lucide-react'

const GLOBAL_CSS = `
  :root { --easing-standard: cubic-bezier(0.4, 0.0, 0.2, 1); }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes twinkle { 0%, 100% { opacity: 0; transform: scale(.7); } 50% { opacity: 0.8; transform: scale(1.1); } }
  @keyframes shimmer { 0% { transform: translateX(-150%); } 100% { transform: translateX(350%); } }
  @keyframes pulseSubBoxGreen { 0%, 100% { box-shadow: 0 0 10px rgba(34,197,94,0.1); } 50% { box-shadow: 0 0 25px rgba(34,197,94,0.3); } }
  @keyframes pulseSubBoxOrange { 0%, 100% { box-shadow: 0 0 10px rgba(245,166,35,0.1); } 50% { box-shadow: 0 0 25px rgba(245,166,35,0.3); } }
  @keyframes skeletonPulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }
`

/** Har renderda Math.random qayta ishlamasin — mobil qurilmalarda qotishni oldini oladi */
const BOLIMLAR_STARS = Array.from({ length: 36 }, (_, i) => ({
  id: i,
  x: (i * 17.3) % 100,
  y: (i * 23.7) % 100,
  size: 0.6 + (i % 5) * 0.35,
  delay: (i % 8) * 0.4,
  dur: 2 + (i % 4) * 0.5,
}))

function StarField() {
  const stars = BOLIMLAR_STARS
  return (
    <div style={{ position:'fixed', inset:0, overflow:'hidden', pointerEvents:'none', zIndex:0 }}>
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(160deg,#08080f 0%,#0a0c14 45%,#0b0c16 70%,#0a0a0f 100%)' }} />
      {stars.map(s => (
        <div key={s.id} style={{ position:'absolute', left:`${s.x}%`, top:`${s.y}%`, width:s.size, height:s.size, borderRadius:'50%', backgroundColor:'#fff', opacity:0, animation:`twinkle ${s.dur}s ${s.delay}s ease-in-out infinite` }} />
      ))}
    </div>
  )
}

function ProgressRing({ pct, clr, size=34, sw=3 }) {
  const r=(size-sw*2)/2, c=2*Math.PI*r, off=c-(pct/100)*c
  return (
    <svg width={size} height={size} style={{ transform:'rotate(-90deg)', flexShrink:0, filter:`drop-shadow(0 0 3px ${clr}50)` }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,.1)" strokeWidth={sw}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={clr} strokeWidth={sw} strokeDasharray={c.toFixed(1)} strokeDashoffset={off.toFixed(1)} strokeLinecap="round" style={{ transition:'stroke-dashoffset 0.6s ease' }}/>
    </svg>
  )
}

const BOX_SCHEMA = [
  { n:1, clr:'#F5A623', bg:'rgba(245,166,35,.07)',  lbl:'#F5A623', sub:'rgba(245,166,35,.5)',   active:true  },
  { n:2, clr:'#6366f1', bg:'rgba(99,102,241,.05)',  lbl:'#a5b4fc', sub:'rgba(165,180,252,.45)', active:false },
  { n:3, clr:'#06b6d4', bg:'rgba(6,182,212,.05)',   lbl:'#67e8f9', sub:'rgba(103,232,249,.45)', active:false },
  { n:4, clr:'#8b5cf6', bg:'rgba(139,92,246,.05)',  lbl:'#c4b5fd', sub:'rgba(196,181,253,.45)', active:false },
  { n:5, clr:'#ec4899', bg:'rgba(236,72,153,.05)',  lbl:'#f9a8d4', sub:'rgba(249,168,212,.45)', active:false },
  { n:6, clr:'#10b981', bg:'rgba(16,185,129,.05)',  lbl:'#6ee7b7', sub:'rgba(110,231,183,.45)', active:false },
]

function SubBox({ b, idx }) {
  const pulse = b.active ? 'pulseSubBoxOrange 3s ease-in-out infinite,' : (idx === 0 ? 'pulseSubBoxGreen 3s ease-in-out infinite,' : '')
  return (
    <div style={{ width:'100%', height:72, borderRadius:18, padding:'0 18px', display:'flex', alignItems:'center', gap:14, position:'relative', overflow:'visible', background:b.bg, backdropFilter:'blur(14px)', cursor:'pointer', transition:'transform .15s', animation:`${pulse} fadeIn .5s ${idx*.08}s both` }}
      onMouseDown={e=>e.currentTarget.style.transform='scale(.98)'} onMouseUp={e=>e.currentTarget.style.transform='scale(1)'}
      onTouchStart={e=>e.currentTarget.style.transform='scale(.98)'} onTouchEnd={e=>e.currentTarget.style.transform='scale(1)'}>
      <ProgressRing pct={b.pct} clr={b.clr} size={34} sw={3}/>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:15, fontWeight:700, color:b.lbl, letterSpacing:0.3 }}>Box {b.n}</div>
        <div style={{ fontSize:10.5, color:b.sub, marginTop:2.5, opacity:0.8 }}>{b.pct}% · {b.total} ta so'z</div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:6, flexShrink:0, position:'relative', zIndex:2 }}>
        {b.active && <div style={{ background:'rgba(245,166,35,.25)', border:'1px solid rgba(245,166,35,.45)', borderRadius:20, padding:'3px 9px', fontSize:9, fontWeight:700, color:'#F5A623', display:'flex', alignItems:'center', gap:3.5, textTransform:'uppercase', letterSpacing:0.5 }}><Zap size={9} fill="#F5A623" color="#F5A623"/>ACTIVE</div>}
        <Star size={14} color={b.active?b.clr:'rgba(255,255,255,.16)'} fill={b.active?b.clr:'none'} style={{ filter:b.active?`drop-shadow(0 0 3px ${b.clr}80)`:'none' }}/>
        <ChevronRight size={15} color="rgba(255,255,255,.22)"/>
      </div>
    </div>
  )
}

function Connector({ b, nextClr, connH }) {
  return (
    <div style={{ width:'100%', height:connH, position:'relative', zIndex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:0 }}>
      <div style={{ width:2, flex:1, minHeight:8, borderRadius:2, background:`linear-gradient(180deg, ${b.clr}55, ${nextClr}33)` }} />
      <div style={{ width:8, height:8, borderRadius:'50%', background:b.clr, opacity:0.85, boxShadow:`0 0 10px ${b.clr}66` }} />
      <div style={{ width:2, flex:1, minHeight:8, borderRadius:2, background:`linear-gradient(180deg, ${nextClr}33, transparent)` }} />
    </div>
  )
}

function ElecBoxes({ boxStats }) {
  const CONN_H = 42
  const data = BOX_SCHEMA.map((schema, i) => ({
    ...schema,
    pct:   boxStats?.[i]?.percent ?? 0,
    total: boxStats?.[i]?.total   ?? 0,
  }))

  return (
    <div style={{ padding:'0 18px 20px', display:'flex', flexDirection:'column', alignItems:'center', position:'relative', overflow:'visible' }}>
      {data.map((b, i) => (
        <div key={b.n} style={{ width:'100%', display:'flex', flexDirection:'column', alignItems:'center', position:'relative', zIndex:1 }}>
          <SubBox b={b} idx={i} />
          {i < data.length - 1 && <Connector b={b} nextClr={data[i+1]?.clr || b.clr} connH={CONN_H} />}
        </div>
      ))}
    </div>
  )
}

export default function BolimlarPage() {
  const navigate = useNavigate()
  const { user, boxStats, wordCount } = useStore()
  const np = user?.npBalance ?? user?.np ?? 0

  useEffect(() => {
    const id = 'bolimlar-css'
    if (!document.getElementById(id)) {
      const s = document.createElement('style')
      s.id = id
      s.textContent = GLOBAL_CSS
      document.head.appendChild(s)
    }
  }, [])

  const headerBtn = { width:38, height:38, borderRadius:12, background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.11)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', transition:'all .2s' }

  return (
    <div style={{ position:'relative', minHeight:'100vh', paddingBottom:110, color:'#fff', overflowX:'hidden' }}>
      <StarField/>
      <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle at 50% -10%, rgba(124,58,237,0.1) 0%, transparent 60%), radial-gradient(circle at 10% 80%, rgba(245,166,35,0.06) 0%, transparent 50%)', pointerEvents:'none' }} />

      <div style={{ position:'relative', zIndex:1 }}>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'22px 18px 14px', animation:'fadeIn .4s both' }}>
          <button onClick={()=>navigate('/')} style={headerBtn}
            onTouchStart={e=>{e.currentTarget.style.background='rgba(255,255,255,.09)';e.currentTarget.style.transform='scale(.95)'}}
            onTouchEnd={e=>{e.currentTarget.style.background='rgba(255,255,255,.05)';e.currentTarget.style.transform='scale(1)'}}>
            <ArrowLeft size={20} color="#fff"/>
          </button>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontWeight:700, fontSize:19, color:'#fff', letterSpacing:0.3 }}>Mening bo'limlarim</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,.45)', marginTop:2, fontWeight:500 }}>
              {wordCount > 0 ? `${wordCount} ta so'z qo'shilgan` : "So'z qo'shing"}
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:6.5, background:'linear-gradient(135deg,rgba(245,166,35,0.18),rgba(245,166,35,0.08))', border:'1px solid rgba(245,166,35,.4)', borderRadius:50, padding:'7px 14px', boxShadow:'0 2px 10px rgba(245,166,35,0.1)' }}>
            <span style={{ color:'#F5A623', fontSize:11.5, fontWeight:800, textTransform:'uppercase', letterSpacing:1 }}>NP</span>
            <Zap size={13} color="#F5A623" fill="#F5A623"/>
            <span style={{ color:'#fff', fontWeight:800, fontSize:15, letterSpacing:0.5 }}>{np}</span>
          </div>
        </div>

        <div style={{ padding:'8px 18px 10px', display:'flex', flexDirection:'column', gap:10 }}>
          <button onClick={()=>navigate('/duelist')} style={{ width:'100%', display:'flex', alignItems:'center', gap:14, background:'rgba(245,166,35,.03)', border:'1.2px solid rgba(245,166,35,.15)', borderLeft:'4px solid #F5A623', borderRadius:20, padding:'14px 16px', cursor:'pointer', backdropFilter:'blur(10px)', transition:'all 0.2s', animation:'fadeIn .5s .1s both', boxShadow:'0 4px 15px rgba(0,0,0,0.15)' }}
            onTouchStart={e=>e.currentTarget.style.background='rgba(245,166,35,.07)'} onTouchEnd={e=>e.currentTarget.style.background='rgba(245,166,35,.03)'}>
            <div style={{ width:48, height:48, borderRadius:15, flexShrink:0, background:'rgba(245,166,35,.15)', border:'1px solid rgba(245,166,35,.35)', display:'flex', alignItems:'center', justifyContent:'center' }}><ListTodo size={23} color="#F5A623"/></div>
            <div style={{ flex:1, textAlign:'left' }}>
              <div style={{ fontWeight:700, fontSize:16, color:'#fff', letterSpacing:0.3 }}>Due list</div>
              <div style={{ fontSize:11.5, color:'rgba(255,255,255,.4)', marginTop:3 }}>Takrorlash vaqti kelgan so'zlar</div>
            </div>
            <ChevronRight size={18} color="rgba(255,255,255,.28)"/>
          </button>

          <button onClick={()=>navigate('/sozqoshish')} style={{ width:'100%', display:'flex', alignItems:'center', gap:14, background:'linear-gradient(135deg,rgba(34,197,94,.12) 0%,rgba(16,185,129,.06) 100%)', border:'1.5px solid rgba(34,197,94,.45)', borderRadius:20, padding:'16px 16px', cursor:'pointer', backdropFilter:'blur(10px)', transition:'transform 0.2s', animation:'fadeIn .5s .16s both', position:'relative', overflow:'hidden', boxShadow:'0 4px 15px rgba(34,197,94,0.15)' }}
            onTouchStart={e=>e.currentTarget.style.transform='scale(.98)'} onTouchEnd={e=>e.currentTarget.style.transform='scale(1)'}>
            <div style={{ position:'absolute', inset:0, overflow:'hidden', borderRadius:20, pointerEvents:'none' }}><div style={{ position:'absolute', top:0, left:0, width:'40%', height:'100%', background:'linear-gradient(90deg,transparent,rgba(34,197,94,.1),transparent)', animation:'shimmer 2.8s ease-in-out infinite' }}/></div>
            <div style={{ width:50, height:50, borderRadius:16, flexShrink:0, background:'linear-gradient(135deg,#22c55e,#10b981)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 3px 16px rgba(34,197,94,.4)', position:'relative', zIndex:1 }}><Plus size={25} color="#fff" strokeWidth={3}/></div>
            <div style={{ flex:1, textAlign:'left', position:'relative', zIndex:1 }}>
              <div style={{ fontWeight:800, fontSize:16, color:'#22c55e', letterSpacing:0.3 }}>So'z qo'shish</div>
              <div style={{ fontSize:11.5, color:'rgba(255,255,255,.4)', marginTop:3 }}>Yangi so'z qo'shing</div>
            </div>
            <ChevronRight size={18} color="rgba(34,197,94,.6)" style={{ position:'relative', zIndex:1 }}/>
          </button>

          <button onClick={()=>navigate('/jamisozlar')} style={{ width:'100%', display:'flex', alignItems:'center', gap:14, background:'rgba(255,255,255,.03)', border:'1.2px solid rgba(255,255,255,.09)', borderLeft:'4px solid rgba(245,166,35,.45)', borderRadius:20, padding:'14px 16px', cursor:'pointer', backdropFilter:'blur(10px)', transition:'all 0.2s', animation:'fadeIn .5s .22s both', boxShadow:'0 4px 15px rgba(0,0,0,0.15)' }}
            onTouchStart={e=>e.currentTarget.style.background='rgba(255,255,255,.07)'} onTouchEnd={e=>e.currentTarget.style.background='rgba(255,255,255,.03)'}>
            <div style={{ width:48, height:48, borderRadius:15, flexShrink:0, background:'rgba(245,166,35,.12)', border:'1px solid rgba(245,166,35,.28)', display:'flex', alignItems:'center', justifyContent:'center' }}><BookOpen size={23} color="#F5A623"/></div>
            <div style={{ flex:1, textAlign:'left' }}>
              <div style={{ fontWeight:700, fontSize:16, color:'#fff', letterSpacing:0.3 }}>Jami so'zlar</div>
              <div style={{ fontSize:11.5, color:'rgba(255,255,255,.4)', marginTop:3 }}>Barcha qo'shilgan so'zlar</div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:6, paddingRight:5 }}>
              <TrendingUp size={14} color="rgba(245,166,35,.6)"/>
              <span style={{ fontSize:15, fontWeight:800, color:'rgba(255,255,255,.5)' }}>{wordCount ?? 0}</span>
            </div>
          </button>
        </div>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'26px 18px 8px', animation:'fadeIn .5s .3s both' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <Zap size={19} color="#F5A623" fill="#F5A623" style={{ filter:'drop-shadow(0 0 4px #F5A62380)' }}/>
            <span style={{ fontWeight:800, fontSize:19, letterSpacing:0.5, background:'linear-gradient(90deg,#fff 0%,#F5A623 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Bo'limlar bo'yicha</span>
          </div>
          <Sparkles size={17} color="#F5A623" style={{ opacity:0.8 }}/>
        </div>

        <ElecBoxes boxStats={boxStats} />

      </div>
    </div>
  )
}