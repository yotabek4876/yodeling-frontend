import { useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import useStore from '../store/useStore'
import { ArrowLeft, Zap, ListTodo, Plus, BookOpen, Star, ChevronRight, Sparkles, TrendingUp } from 'lucide-react'

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Unica+One&display=swap');
  :root { --easing-standard: cubic-bezier(0.4, 0.0, 0.2, 1); }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes twinkle { 0%, 100% { opacity: 0; transform: scale(.7); } 50% { opacity: 0.8; transform: scale(1.1); } }
  @keyframes shimmer { 0% { transform: translateX(-150%); } 100% { transform: translateX(350%); } }
  @keyframes cubeRotate { 0% { transform: rotateX(15deg) rotateY(0deg); } 100% { transform: rotateX(15deg) rotateY(360deg); } }
  @keyframes cubeFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
  @keyframes cubeGlow { 0%, 100% { filter: drop-shadow(0 0 30px rgba(139,92,246,.5)) drop-shadow(0 0 80px rgba(99,102,241,.3)); } 50% { filter: drop-shadow(0 0 50px rgba(139,92,246,.8)) drop-shadow(0 0 120px rgba(167,139,250,.4)); } }
  @keyframes shadowPulse { 0%, 100% { transform: scaleX(1); opacity: 0.5; } 50% { transform: scaleX(0.75); opacity: 0.25; } }
  @keyframes connectorFlow { 0% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: -120; } }
  @keyframes bgConnectorPulse { 0%, 100% { opacity: 0.08; } 50% { opacity: 0.18; } }
  @keyframes pulseSubBoxGreen { 0%, 100% { box-shadow: 0 0 10px rgba(34,197,94,0.1); } 50% { box-shadow: 0 0 25px rgba(34,197,94,0.3); } }
  @keyframes pulseSubBoxOrange { 0%, 100% { box-shadow: 0 0 10px rgba(245,166,35,0.1); } 50% { box-shadow: 0 0 25px rgba(245,166,35,0.3); } }
  @keyframes electricPath { 0% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: -800; } }
  @keyframes electricGlowPulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
  @keyframes textSparkle { 0%, 100% { text-shadow: 0 0 8px rgba(255,255,255,0.3); } 50% { text-shadow: 0 0 18px rgba(255,255,255,0.8); } }
  @keyframes skeletonPulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }
`

function StarField() {
  const stars = Array.from({ length: 70 }, (_, i) => ({
    id: i, x: Math.random()*100, y: Math.random()*100,
    size: Math.random()*2 + 0.5, delay: Math.random()*5, dur: Math.random()*3+2,
  }))
  return (
    <div style={{ position:'fixed', inset:0, overflow:'hidden', pointerEvents:'none', zIndex:0 }}>
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(160deg,#08080f 0%,#0a0c14 45%,#0b0c16 70%,#0a0a0f 100%)' }} />
      {stars.map(s => (
        <div key={s.id} style={{ position:'absolute', left:`${s.x}%`, top:`${s.y}%`, width:s.size, height:s.size, borderRadius:'50%', backgroundColor:'#fff', opacity:0, animation:`twinkle ${s.dur}s ${s.delay}s ease-in-out infinite` }} />
      ))}
    </div>
  )
}

function Cube3D({ currentBox = 1 }) {
  const cubeRef = useRef(null)
  const st = useRef({ dragging:false, sx:0, sy:0, rotY:-25, rotX:15, autoTimer:null })
  const FACE_SIZE = 150, FACE_ROUNDING = 16
  const FACE = { position:'absolute', width:FACE_SIZE, height:FACE_SIZE, borderRadius:FACE_ROUNDING }

  useEffect(() => {
    const el = cubeRef.current; if (!el) return; const s = st.current
    const startAuto = () => { el.style.animation='cubeRotate 15s linear infinite, cubeFloat 5s ease-in-out infinite, cubeGlow 4s ease-in-out infinite' }
    const onDown=(cx,cy)=>{ clearTimeout(s.autoTimer); s.dragging=true; el.style.animation='cubeFloat 5s ease-in-out infinite'; el.style.transition='none'; s.sx=cx; s.sy=cy }
    const onMove=(cx,cy)=>{ if(!s.dragging)return; s.rotY+=(cx-s.sx)*.7; s.rotX-=(cy-s.sy)*.5; s.rotX=Math.max(-60,Math.min(60,s.rotX)); el.style.transform=`rotateX(${s.rotX}deg) rotateY(${s.rotY}deg)`; s.sx=cx; s.sy=cy }
    const onUp=()=>{ if(!s.dragging)return; s.dragging=false; el.style.transition='transform 0.5s'; s.autoTimer=setTimeout(startAuto,3000) }
    const md=e=>onDown(e.clientX,e.clientY), mm=e=>onMove(e.clientX,e.clientY)
    const ts=e=>onDown(e.touches[0].clientX,e.touches[0].clientY)
    const tm=e=>{
      // Sahifa scrollini faqat cube drag paytida bloklaymiz.
      if (!s.dragging) return
      e.preventDefault()
      onMove(e.touches[0].clientX,e.touches[0].clientY)
    }
    el.addEventListener('mousedown',md); el.addEventListener('touchstart',ts,{passive:true})
    document.addEventListener('mousemove',mm); document.addEventListener('mouseup',onUp)
    document.addEventListener('touchmove',tm,{passive:false}); document.addEventListener('touchend',onUp)
    startAuto()
    return ()=>{ el.removeEventListener('mousedown',md); el.removeEventListener('touchstart',ts); document.removeEventListener('mousemove',mm); document.removeEventListener('mouseup',onUp); document.removeEventListener('touchmove',tm); document.removeEventListener('touchend',onUp) }
  }, [])

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'20px 0 10px', animation:'fadeIn .5s .3s both' }}>
      <div style={{ perspective:1000, perspectiveOrigin:'50% 45%' }}>
        <div ref={cubeRef} style={{ width:FACE_SIZE, height:FACE_SIZE, position:'relative', transformStyle:'preserve-3d', cursor:'grab' }}>
          <div style={{ ...FACE, transform:`translateZ(${FACE_SIZE/2}px)`, background:'linear-gradient(135deg,#7c3aed 0%,#6d28d9 35%,#4f46e5 100%)', border:'1.5px solid rgba(167,139,250,.9)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:8, overflow:'hidden' }}>
            <div style={{ position:'absolute', inset:0, borderRadius:FACE_ROUNDING, overflow:'hidden', pointerEvents:'none', zIndex:1 }}>
              <div style={{ position:'absolute', top:0, left:0, width:'45%', height:'100%', background:'linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent)', animation:'shimmer 2.5s ease-in-out infinite' }} />
            </div>
            <div style={{ fontFamily:'"Unica One", sans-serif', fontSize:56, fontWeight:400, color:'#fff', textShadow:'0 0 35px rgba(255,255,255,.6)', letterSpacing:-3, lineHeight:1, animation:'textSparkle 3s ease-in-out infinite' }}>B{currentBox}</div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,.75)', fontWeight:700, letterSpacing:3.5, textTransform:'uppercase' }}>active box</div>
          </div>
          <div style={{ ...FACE, transform:`translateZ(-${FACE_SIZE/2}px) rotateY(180deg)`, background:'#110a20', border:'1.5px solid rgba(139,92,246,.5)', display:'flex', alignItems:'center', justifyContent:'center' }}><span style={{ fontSize:42, opacity:.4 }}>📚</span></div>
          <div style={{ ...FACE, transform:`rotateY(90deg) translateZ(${FACE_SIZE/2}px)`, background:'linear-gradient(180deg,#6d28d9,#4f46e5)', border:'1.2px solid rgba(99,102,241,.6)', display:'flex', alignItems:'center', justifyContent:'center' }}><span style={{ fontSize:11, color:'rgba(255,255,255,.5)', fontWeight:700, writingMode:'vertical-rl', letterSpacing:2.5, textTransform:'uppercase' }}>Spaced Repetition</span></div>
          <div style={{ ...FACE, transform:`rotateY(-90deg) translateZ(${FACE_SIZE/2}px)`, background:'linear-gradient(180deg,#5b21b6,#3730a3)', border:'1.2px solid rgba(139,92,246,.4)', display:'flex', alignItems:'center', justifyContent:'center' }}><span style={{ fontSize:11, color:'rgba(255,255,255,.4)', fontWeight:700, writingMode:'vertical-rl', letterSpacing:2, textTransform:'uppercase' }}>Box {currentBox}</span></div>
          <div style={{ ...FACE, transform:`rotateX(90deg) translateZ(${FACE_SIZE/2}px)`, background:'linear-gradient(135deg,#a78bfa,#7c3aed)', border:'1.5px solid rgba(196,181,253,.75)', display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, padding:20, alignItems:'center', justifyItems:'center' }}>
            {Array.from({length:9}).map((_,i)=><div key={i} style={{ width:5, height:5, borderRadius:'50%', background:'rgba(255,255,255,.5)' }}/>)}
          </div>
          <div style={{ ...FACE, transform:`rotateX(-90deg) translateZ(${FACE_SIZE/2}px)`, background:'linear-gradient(135deg,#2e1065,#1e1b4b)', border:'1.2px solid rgba(99,102,241,.3)' }}/>
        </div>
      </div>
      <div style={{ width:160, height:20, marginTop:5, borderRadius:'50%', background:'radial-gradient(ellipse,rgba(139,92,246,.55) 0%,transparent 72%)', animation:'shadowPulse 5s ease-in-out infinite' }}/>
      <div style={{ marginTop:12, fontSize:10.5, fontWeight:700, letterSpacing:3.5, color:'rgba(167,139,250,.85)', textTransform:'uppercase' }}>Takrorlash Tizimi (SRS)</div>
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

function ElecBorder({ idx }) {
  const clr = '#FAD09E'
  const dur = 5 + idx * 0.5
  return (
    <svg style={{ position:'absolute', inset:-3, width:'calc(100% + 6px)', height:'calc(100% + 6px)', pointerEvents:'none', zIndex:1, overflow:'visible' }} preserveAspectRatio="none">
      <defs>
        <filter id={`eg_${idx}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur"/>
          <feFlood floodColor={clr} floodOpacity="0.8"/>
          <feComposite in2="blur" operator="in" result="glow"/>
          <feMerge><feMergeNode in="glow"/><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <rect rx={17} ry={17} fill="none" stroke={clr} strokeWidth={1} opacity={0.7} filter={`url(#eg_${idx})`}
        style={{ animation:`electricPath ${dur}s linear infinite, electricGlowPulse 4s ease-in-out infinite`, strokeDasharray:800, strokeDashoffset:0 }}/>
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
      {(b.active || idx === 0) && <ElecBorder idx={idx}/>}
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

function Connector({ b, nextClr, idx, connH }) {
  const midY = connH / 2
  return (
    <div style={{ width:'100%', height:connH, position:'relative', zIndex:1, overflow:'visible' }}>
      <svg width="100%" height={connH} viewBox={`0 0 350 ${connH}`} style={{ position:'absolute', top:0, left:0, overflow:'visible' }}>
        <defs><filter id={`cg_${idx}`}><feGaussianBlur stdDeviation={3} result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
        <line x1={175} y1={0} x2={175} y2={connH} stroke={b.clr} strokeWidth={32} opacity={.04} style={{ animation:`bgConnectorPulse ${2.5+idx*.3}s ease-in-out infinite` }}/>
        <line x1={175} y1={5} x2={175} y2={connH-15} stroke={b.clr} strokeWidth={2.5} strokeDasharray="6 7" strokeLinecap="round" opacity={.7} style={{ animation:'connectorFlow 1.2s linear infinite', filter:`url(#cg_${idx})` }}/>
        <line x1={175} y1={midY} x2={175} y2={connH-15} stroke={nextClr} strokeWidth={2.5} strokeDasharray="6 7" strokeLinecap="round" opacity={.5} style={{ animation:'connectorFlow 1.2s linear infinite' }}/>
        <circle cx={175} cy={8} r={6} fill={b.clr} opacity={0.9} style={{ filter:`drop-shadow(0 0 4px ${b.clr})` }}/>
        <circle cx={175} cy={8} r={10} fill={b.clr} opacity={.15}/>
      </svg>
    </div>
  )
}

function ElecBoxes({ boxStats }) {
  const BOX_H = 72, CONN_H = 42
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
          {i < data.length - 1 && <Connector b={b} nextClr={data[i+1]?.clr || b.clr} idx={i} connH={CONN_H} boxH={BOX_H} />}
        </div>
      ))}
    </div>
  )
}

export default function BolimlarPage() {
  const navigate = useNavigate()
  const { user, boxStats, wordCount } = useStore()
  const np = user?.npBalance ?? user?.np ?? 0
  const activeBox = (boxStats?.findIndex(b => (b.percent ?? 0) < 100) + 1) || 1

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

        <Cube3D currentBox={activeBox} />
        <ElecBoxes boxStats={boxStats} />

      </div>
    </div>
  )
}