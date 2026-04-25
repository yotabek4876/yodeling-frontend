import { useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import useStore from '../store/useStore'
import { ArrowLeft, Zap, ListTodo, Plus, BookOpen, Star, ChevronRight, Sparkles, TrendingUp, Search } from 'lucide-react'

// ==========================================
// 1. GLOBAL CSS & ANIMATIONS
// ==========================================
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Unica+One&display=swap'); /* For the B1 font */

  :root {
    --primary-purple: #7c3aed;
    --primary-indigo: #4f46e5;
    --primary-orange: #F5A623;
    --primary-green: #22c55e;
    --primary-green-alt: #10b981;
    --bg-dark-0: #08080f;
    --bg-dark-1: #0a0c14;
    --card-bg: rgba(255, 255, 255, 0.03);
    --border-light: rgba(255, 255, 255, 0.07);
    --easing-standard: cubic-bezier(0.4, 0.0, 0.2, 1);
  }

  /* Core Animations */
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes twinkle { 0%, 100% { opacity: 0; transform: scale(.7); } 50% { opacity: 0.8; transform: scale(1.1); } }
  @keyframes shimmer { 0% { transform: translateX(-150%); } 100% { transform: translateX(350%); } }
  @keyframes rotateBackground { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

  /* 3D Cube Perfected Animations */
  @keyframes cubeRotate { 0% { transform: rotateX(15deg) rotateY(0deg); } 100% { transform: rotateX(15deg) rotateY(360deg); } }
  @keyframes cubeFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
  @keyframes cubeGlow { 0%, 100% { filter: drop-shadow(0 0 30px rgba(139,92,246,.5)) drop-shadow(0 0 80px rgba(99,102,241,.3)); } 50% { filter: drop-shadow(0 0 50px rgba(139,92,246,.8)) drop-shadow(0 0 120px rgba(167,139,250,.4)); } }
  @keyframes shadowPulse { 0%, 100% { transform: scaleX(1); opacity: 0.5; } 50% { transform: scaleX(0.75); opacity: 0.25; } }

  /* Sub-box Flow Connector Animations */
  @keyframes connectorFlow { 0% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: -120; } }
  @keyframes bgConnectorPulse { 0%, 100% { opacity: 0.08; } 50% { opacity: 0.18; } }
  @keyframes pulseSubBoxGreen { 0%, 100% { box-shadow: 0 0 10px rgba(34,197,94,0.1); } 50% { box-shadow: 0 0 25px rgba(34,197,94,0.3); } }
  @keyframes pulseSubBoxOrange { 0%, 100% { box-shadow: 0 0 10px rgba(245,166,35,0.1); } 50% { box-shadow: 0 0 25px rgba(245,166,35,0.3); } }

  /* --- Electric Border (Image 2 style) --- */
  @keyframes electricPath { 0% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: -800; } } /* Adjusted length */
  @keyframes electricGlowPulse { 0%, 100% { opacity: 0.4; filter: blur(2px) drop-shadow(0 0 4px currentColor); } 50% { opacity: 1; filter: blur(2px) drop-shadow(0 0 12px currentColor); } }
  @keyframes textSparkle { 0%, 100% { text-shadow: 0 0 8px rgba(255,255,255,0.3); } 50% { text-shadow: 0 0 18px rgba(255,255,255,0.8); } }
`

// ==========================================
// 2. HELPER COMPONENTS
// ==========================================

// Subtle Star Field Background
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

// Perfected 3D Cube (Interactivity and Aesthetics from Image 0)
function Cube3D({ currentBox = 1 }) {
  const cubeRef = useRef(null)
  const st = useRef({ dragging:false, sx:0, sy:0, rotY:-25, rotX:15, autoTimer:null })
  const FACE_SIZE = 150
  const FACE_ROUNDING = 16

  const FACE = { position:'absolute', width:FACE_SIZE, height:FACE_SIZE, borderRadius:FACE_ROUNDING }

  useEffect(() => {
    const el = cubeRef.current; if (!el) return; const s = st.current
    
    // Smooth interaction handling
    const startAutoRotation = () => {
        el.style.animation='cubeRotate 15s linear infinite, cubeFloat 5s ease-in-out infinite, cubeGlow 4s ease-in-out infinite'
    }

    const onDown=(cx,cy)=>{ 
        clearTimeout(s.autoTimer); 
        s.dragging=true; 
        el.style.animation='cubeFloat 5s ease-in-out infinite'; // Stop rotation but keep float
        el.style.transition = 'none'; // Instant response
        s.sx=cx; s.sy=cy 
    }
    const onMove=(cx,cy)=>{ if(!s.dragging)return; s.rotY+=(cx-s.sx)*.7; s.rotX-=(cy-s.sy)*.5; s.rotX=Math.max(-60,Math.min(60,s.rotX)); el.style.transform=`rotateX(${s.rotX}deg) rotateY(${s.rotY}deg)`; s.sx=cx; s.sy=cy }
    const onUp=()=>{ 
        if(!s.dragging)return; 
        s.dragging=false; 
        el.style.transition = 'transform 0.5s var(--easing-standard)'; // Smooth return if needed
        s.autoTimer=setTimeout(startAutoRotation, 3000) 
    }
    const md=e=>onDown(e.clientX,e.clientY), mm=e=>onMove(e.clientX,e.clientY)
    const ts=e=>onDown(e.touches[0].clientX,e.touches[0].clientY)
    const tm=e=>{ e.preventDefault(); onMove(e.touches[0].clientX,e.touches[0].clientY) }
    
    el.addEventListener('mousedown',md); el.addEventListener('touchstart',ts,{passive:true})
    document.addEventListener('mousemove',mm); document.addEventListener('mouseup',onUp)
    document.addEventListener('touchmove',tm,{passive:false}); document.addEventListener('touchend',onUp)
    
    // Initial start
    startAutoRotation();

    return ()=>{ el.removeEventListener('mousedown',md); el.removeEventListener('touchstart',ts); document.removeEventListener('mousemove',mm); document.removeEventListener('mouseup',onUp); document.removeEventListener('touchmove',tm); document.removeEventListener('touchend',onUp) }
  }, [])

  const ShimmerEffect = () => (
    <div style={{ position:'absolute', inset:0, borderRadius:FACE_ROUNDING, overflow:'hidden', pointerEvents:'none', zIndex:1 }}>
      <div style={{ position:'absolute', top:0, left:0, width:'45%', height:'100%', background:'linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent)', animation:'shimmer 2.5s ease-in-out infinite' }} />
    </div>
  )

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'20px 0 10px', animation:'fadeIn .5s .3s var(--easing-standard) both' }}>
      <div style={{ perspective:1000, perspectiveOrigin:'50% 45%' }}>
        <div ref={cubeRef} style={{ width:FACE_SIZE, height:FACE_SIZE, position:'relative', transformStyle:'preserve-3d', cursor:'grab', transition: 'transform 0.5s var(--easing-standard)' }}>
          {/* FRONT: Active B1, Image 0 style text */}
          <div style={{ ...FACE, transform:`translateZ(${FACE_SIZE/2}px)`, background:'linear-gradient(135deg,#7c3aed 0%,#6d28d9 35%,#4f46e5 100%)', border:'1.5px solid rgba(167,139,250,.9)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:8, overflow:'hidden' }}>
            <ShimmerEffect />
            <div style={{ fontFamily: '"Unica One", sans-serif', fontSize:56, fontWeight:400, color:'#fff', textShadow:'0 0 35px rgba(255,255,255,.6)', letterSpacing:-3, lineHeight:1, animation: 'textSparkle 3s ease-in-out infinite' }}>B1</div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,.75)', fontWeight:700, letterSpacing:3.5, textTransform:'uppercase' }}>active box</div>
            <div style={{ position:'absolute', bottom:14, right:14 }}>
              <svg width={32} height={32} style={{ transform:'rotate(-90deg)' }}>
                <circle cx={16} cy={16} r={13} fill="none" stroke="rgba(255,255,255,.15)" strokeWidth={3}/>
                <circle cx={16} cy={16} r={13} fill="none" stroke="rgba(255,255,255,1)" strokeWidth={3} strokeDasharray={82} strokeDashoffset={26} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.5s ease' }}/>
              </svg>
            </div>
          </div>
          {/* BACK: Book Icon */}
          <div style={{ ...FACE, transform:`translateZ(-${FACE_SIZE/2}px) rotateY(180deg)`, background:'#110a20', border:'1.5px solid rgba(139,92,246,.5)', display:'flex', alignItems:'center', justifyContent:'center' }}><span style={{ fontSize:42, opacity:.4 }}>📚</span></div>
          {/* RIGHT: Spaced Repetition Label */}
          <div style={{ ...FACE, transform:`rotateY(90deg) translateZ(${FACE_SIZE/2}px)`, background:'linear-gradient(180deg,#6d28d9,#4f46e5)', border:'1.2px solid rgba(99,102,241,.6)', display:'flex', alignItems:'center', justifyContent:'center' }}><span style={{ fontSize:11, color:'rgba(255,255,255,.5)', fontWeight:700, writingMode:'vertical-rl', letterSpacing:2.5, textTransform:'uppercase' }}>Spaced Rep repetition</span></div>
          {/* LEFT: Box number */}
          <div style={{ ...FACE, transform:`rotateY(-90deg) translateZ(${FACE_SIZE/2}px)`, background:'linear-gradient(180deg,#5b21b6,#3730a3)', border:'1.2px solid rgba(139,92,246,.4)', display:'flex', alignItems:'center', justifyContent:'center' }}><span style={{ fontSize:11, color:'rgba(255,255,255,.4)', fontWeight:700, writingMode:'vertical-rl', letterSpacing:2, textTransform:'uppercase' }}>{`Box ${currentBox}`}</span></div>
          {/* TOP: Indicator dots */}
          <div style={{ ...FACE, transform:`rotateX(90deg) translateZ(${FACE_SIZE/2}px)`, background:'linear-gradient(135deg,#a78bfa,#7c3aed)', border:'1.5px solid rgba(196,181,253,.75)', display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, padding:20, alignItems:'center', justifyItems:'center' }}>
            {Array.from({length:9}).map((_,i)=><div key={i} style={{ width:5, height:5, borderRadius:'50%', background:'rgba(255,255,255,.5)' }}/>)}
          </div>
          {/* BOTTOM: Deep purple */}
          <div style={{ ...FACE, transform:`rotateX(-90deg) translateZ(${FACE_SIZE/2}px)`, background:'linear-gradient(135deg,#2e1065,#1e1b4b)', border:'1.2px solid rgba(99,102,241,.3)' }}/>
        </div>
      </div>
      <div style={{ width:160, height:20, marginTop:5, borderRadius:'50%', background:'radial-gradient(ellipse,rgba(139,92,246,.55) 0%,transparent 72%)', animation:'shadowPulse 5s ease-in-out infinite' }}/>
      <div style={{ marginTop:12, fontSize:10.5, fontWeight:700, letterSpacing:3.5, color:'rgba(167,139,250,.85)', textTransform:'uppercase' }}>Takrorlash Tizimi (SRS)</div>
    </div>
  )
}

// Progress Ring with dynamic color and size
function ProgressRing({ pct, clr, size=34, sw=3 }) {
  const r=(size-sw*2)/2, c=2*Math.PI*r, off=c-(pct/100)*c
  return (
    <svg width={size} height={size} style={{ transform:'rotate(-90deg)', flexShrink:0, filter: `drop-shadow(0 0 3px ${clr}50)` }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,.1)" strokeWidth={sw}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={clr} strokeWidth={sw} strokeDasharray={c.toFixed(1)} strokeDashoffset={off.toFixed(1)} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.6s ease' }}/>
    </svg>
  )
}

// Electric Border for Sub-boxes (Comfortable flow from Image 2, color from Image 2)
function ElecBorder({ clr, idx }) {
    // Colors inspired by Image 2, applied softly
    const baseElecColor = '#FAD09E'; // Image 2 glow color
    const duration = 5 + idx * 0.5; // slow movement, varied by index for non-uniformity

    return (
        <svg style={{ position:'absolute', inset: -3, width:'calc(100% + 6px)', height:'calc(100% + 6px)', pointerEvents:'none', zIndex:1, overflow:'visible' }} preserveAspectRatio="none">
            <defs>
                {/* Glow filter adapted for electric effect */}
                <filter id={`elecGlow_${idx}`} x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2.5" result="blur"/>
                    <feFlood floodColor={baseElecColor} floodOpacity="0.8"/>
                    <feComposite in2="blur" operator="in" result="glow"/>
                    <feMerge>
                        <feMergeNode in="glow"/>
                        <feMergeNode in="glow"/> {/* Stack glow */}
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            <rect 
                rx={17} ry={17} // Matching sub-box rounding
                fill="none" 
                stroke={baseElecColor} 
                strokeWidth={1} 
                opacity={0.7}
                filter={`url(#elecGlow_${idx})`}
                // Path length estimation for rect: 2*(width+height)
                style={{ 
                    animation:`electricPath ${duration}s linear infinite, electricGlowPulse 4s ease-in-out infinite`,
                    strokeDasharray: 800, // Sufficient length for the rect
                    strokeDashoffset: 0,
                    color: baseElecColor, // Used by drop-shadow in animation
                }}
            />
        </svg>
    )
}

// Main Box Container with dynamic glow and electric border
function SubBox({ b, idx, dataLen }) {
    // Dynamic glow pulse based on status (green or orange)
    const dynamicPulseAnimation = b.active 
        ? 'pulseSubBoxOrange 3s ease-in-out infinite,'
        : (idx === 0 ? 'pulseSubBoxGreen 3s ease-in-out infinite,' : '');

    return (
        <div style={{ width:'100%', height:72, borderRadius:18, padding:'0 18px', display:'flex', alignItems:'center', gap:14, position:'relative', overflow:'visible', background:b.bg, backdropFilter:'blur(14px)', cursor:'pointer', transition:'transform .15s var(--easing-standard)', animation:`${dynamicPulseAnimation} boxAppear .5s ${idx*.08}s var(--easing-standard) both` }}
            onMouseDown={e=>e.currentTarget.style.transform='scale(.98)'} onMouseUp={e=>e.currentTarget.style.transform='scale(1)'}
            onTouchStart={e=>e.currentTarget.style.transform='scale(.98)'} onTouchEnd={e=>e.currentTarget.style.transform='scale(1)'}>
            
            {/* Electric border (comfortable flow, only on active/first box or subtle on all) */}
            {(b.active || idx === 0) && <ElecBorder clr={b.clr} idx={idx}/>}
            
            <ProgressRing pct={b.pct} clr={b.clr} size={34} sw={3}/>
            
            <div style={{ flex:1 }}>
                <div style={{ fontSize:15, fontWeight:700, color:b.lbl, letterSpacing:0.3 }}>Box {b.n}</div>
                <div style={{ fontSize:10.5, color:b.sub, marginTop:2.5, opacity:0.8 }}>{b.pct}% · {b.total} ta so'z</div>
            </div>
            
            <div style={{ display:'flex', alignItems:'center', gap:6, flexShrink:0, position:'relative', zIndex:2 }}>
                {b.active && <div style={{ background:'rgba(245,166,35,.25)', border:'1px solid rgba(245,166,35,.45)', borderRadius:20, padding:'3px 9px', fontSize:9, fontWeight:700, color:'#F5A623', display:'flex', alignItems:'center', gap:3.5, textTransform:'uppercase', letterSpacing:0.5 }}><Zap size={9} fill="#F5A623" color="#F5A623"/>ACTIVE</div>}
                <Star size={14} color={b.active?b.clr:'rgba(255,255,255,.16)'} fill={b.active?b.clr:'none'} style={{ filter: b.active ? `drop-shadow(0 0 3px ${b.clr}80)` : 'none' }}/>
                <ChevronRight size={15} color="rgba(255,255,255,.22)"/>
            </div>
        </div>
    )
}

// Flow Connector Component between Sub-boxes (Arrow from Image 3)
function Connector({ b, nextClr, idx, connH, boxH }) {
    const startY = boxH / 2;
    const endY = connH + boxH / 2;
    const midY = startY + connH / 2;

    return (
        <div style={{ width:'100%', height:connH, position:'relative', zIndex:1, overflow:'visible' }}>
            <svg width="100%" height={connH} viewBox={`0 0 350 ${connH}`} style={{ position:'absolute', top:0, left:0, overflow:'visible' }}>
                <defs>
                    <filter id={`connectorGlow_${idx}`}><feGaussianBlur stdDeviation={3} result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                </defs>
                {/* Thick background glow */}
                <line x1={175} y1={0} x2={175} y2={connH} stroke={b.clr} strokeWidth={32} opacity={.04} style={{ animation:`bgConnectorPulse ${2.5+idx*.3}s ease-in-out infinite` }}/>
                
                {/* Flowing electric line */}
                <line x1={175} y1={5} x2={175} y2={connH-15} stroke={b.clr} strokeWidth={2.5} strokeDasharray="6 7" strokeLinecap="round" opacity={.7} style={{ animation:'connectorFlow 1.2s linear infinite', filter:`url(#connectorGlow_${idx})` }}/>
                <line x1={175} y1={midY} x2={175} y2={connH-15} stroke={nextClr} strokeWidth={2.5} strokeDasharray="6 7" strokeLinecap="round" opacity={.5} style={{ animation:'connectorFlow 1.2s linear infinite' }}/>
                
                {/* Junction nodes (like Image 3) */}
                <circle cx={175} cy={8} r={6} fill={b.clr} opacity={0.9} style={{ filter: `drop-shadow(0 0 4px ${b.clr})` }}/>
                <circle cx={175} cy={8} r={10} fill={b.clr} opacity={.15}/>
                
                {/* Arrow pointing down (like Image 3) */}
                <polygon points="168,${connH-18} 182,${connH-18} 175,${connH-2}" fill={nextClr} opacity={0.9} style={{ filter: `drop-shadow(0 0 3px ${nextClr})` }}/>
            </svg>
        </div>
    )
}

// Full Electric boxes section with perfected flow (combining data and subcomponents)
function ElecBoxes({ boxStats }) {
    // Corrected data combining with default icons/colors from Image 3/2
    const data = [
        { n:1, pct:68, total:42, active:true,  clr:'#F5A623', bg:'rgba(245,166,35,.07)',  lbl:'#F5A623', sub:'rgba(245,166,35,.5)' },
        { n:2, pct:0,  total:0,  active:false, clr:'#6366f1', bg:'rgba(99,102,241,.05)',  lbl:'#a5b4fc', sub:'rgba(165,180,252,.45)' },
        { n:3, pct:0,  total:0,  active:false, clr:'#06b6d4', bg:'rgba(6,182,212,.05)',  lbl:'#67e8f9', sub:'rgba(103,232,249,.45)' },
        { n:4, pct:0,  total:0,  active:false, clr:'#8b5cf6', bg:'rgba(139,92,246,.05)',  lbl:'#c4b5fd', sub:'rgba(196,181,253,.45)' },
        { n:5, pct:0,  total:0,  active:false, clr:'#ec4899', bg:'rgba(236,72,153,.05)',  lbl:'#f9a8d4', sub:'rgba(249,168,212,.45)' },
        { n:6, pct:0,  total:0,  active:false, clr:'#10b981', bg:'rgba(16,185,129,.05)',  lbl:'#6ee7b7', sub:'rgba(110,231,183,.45)' },
    ].map((d, i) => ({
        ...d,
        pct: boxStats?.[i]?.percent || d.pct,
        total: boxStats?.[i]?.total || d.total,
    }));

    const BOX_H = 72;
    const CONN_H = 42;

    return (
        <div style={{ padding:'0 18px 20px', display:'flex', flexDirection:'column', alignItems:'center', position:'relative', overflow:'visible' }}>
            {data.map((b, i) => (
                <div key={b.n} style={{ width:'100%', display:'flex', flexDirection:'column', alignItems:'center', position:'relative', zIndex:1 }}>
                    {/* The Sub Box */}
                    <SubBox b={b} idx={i} dataLen={data.length} />
                    
                    {/* The Flow Connector to the next box */}
                    {i < data.length - 1 && (
                        <Connector 
                            b={b} 
                            nextClr={data[i+1]?.clr || b.clr} 
                            idx={i} 
                            connH={CONN_H} 
                            boxH={BOX_H} 
                        />
                    )}
                </div>
            ))}
        </div>
    )
}

// ==========================================
// 3. MAIN PAGE COMPONENT
// ==========================================
export default function BolimlarPage() {
  const navigate = useNavigate()
  // Mock store data based on requirements (should connect to actual store)
  const user = { np: 222 };
  const wordCount = 0;
  const boxStats = [{ n:1, percent: 68, total: 42 }, { n:2, percent: 0, total: 0 }, { n:3, percent: 0, total: 0 }];

  useEffect(() => {
    // Inject global styles on mount
    const id = 'bolimlar-css-perfected'
    if (!document.getElementById(id)) {
      const s = document.createElement('style'); s.id = id; s.textContent = GLOBAL_CSS; document.head.appendChild(s)
    }
  }, [])

  const headerBtnStyle = { 
    width:38, height:38, borderRadius:12, 
    background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.11)', 
    display:'flex', alignItems:'center', justifyContent:'center', 
    cursor:'pointer', transition:'all .2s' 
  };

  return (
    <div style={{ position:'relative', minHeight:'100vh', paddingBottom:110, color:'#fff', overflow:'hidden' }}>
      <StarField/>
      
      {/* Background radial gradient mask for overall texture */}
      <div style={{ position:'absolute', inset:0, background: 'radial-gradient(circle at 50% -10%, rgba(124,58,237,0.1) 0%, transparent 60%), radial-gradient(circle at 10% 80%, rgba(245,166,35,0.06) 0%, transparent 50%)', pointerEvents:'none' }} />

      <div style={{ position:'relative', zIndex:1 }}>
        {/* --- TOP BAR (Image 3 style) --- */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'22px 18px 14px', animation:'fadeIn .4s var(--easing-standard) both' }}>
          <button 
            onClick={()=>navigate('/')} 
            style={headerBtnStyle} 
            onTouchStart={e=>{e.currentTarget.style.background='rgba(255,255,255,.09)';e.currentTarget.style.transform='scale(.95)'}} 
            onTouchEnd={e=>{e.currentTarget.style.background='rgba(255,255,255,.05)';e.currentTarget.style.transform='scale(1)'}}>
            <ArrowLeft size={20} color="#fff"/>
          </button>
          
          <div style={{ textAlign:'center' }}>
            <div style={{ fontWeight:700, fontSize:19, color:'#fff', letterSpacing:0.3 }}>Mening bo'limlarim</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,.45)', marginTop:2, fontWeight:500 }}>{wordCount||0} ta so'z qo'shilgan</div>
          </div>
          
          <div style={{ display:'flex', alignItems:'center', gap:6.5, background:'linear-gradient(135deg, rgba(245,166,35,0.18), rgba(245,166,35,0.08))', border:'1px solid rgba(245,166,35,.4)', borderRadius:50, padding:'7px 14px', boxShadow:'0 2px 10px rgba(245,166,35,0.1)' }}>
            <span style={{ color:'#F5A623', fontSize:11.5, fontWeight:800, textTransform:'uppercase', letterSpacing:1 }}>NP</span>
            <Zap size={13} color="#F5A623" fill="#F5A623"/>
            <span style={{ color:'#fff', fontWeight:800, fontSize:15, letterSpacing:0.5 }}>{user?.np??0}</span>
          </div>
        </div>

        {/* --- MAIN ACTION BUTTONS (Perfected from Image 3, with glows) --- */}
        <div style={{ padding:'8px 18px 10px', display:'flex', flexDirection:'column', gap:10 }}>
          {/* Due List - Orange accent */}
          <button onClick={()=>navigate('/duelist')} style={{ width:'100%', display:'flex', alignItems:'center', gap:14, background:'rgba(245,166,35,.03)', border:'1.2px solid rgba(245,166,35,.15)', borderLeft:'4px solid #F5A623', borderRadius:20, padding:'14px 16px', cursor:'pointer', backdropFilter:'blur(10px)', transition:'all 0.2s', animation:'fadeIn .5s .1s var(--easing-standard) both', boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }} 
            onTouchStart={e=>e.currentTarget.style.background='rgba(245,166,35,.07)'} onTouchEnd={e=>e.currentTarget.style.background='rgba(245,166,35,.03)'}>
            <div style={{ width:48, height:48, borderRadius:15, flexShrink:0, background:'rgba(245,166,35,.15)', border:'1px solid rgba(245,166,35,.35)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 0 10px rgba(245,166,35,0.1)` }}><ListTodo size={23} color="#F5A623"/></div>
            <div style={{ flex:1, textAlign:'left' }}>
              <div style={{ fontWeight:700, fontSize:16, color:'#fff', letterSpacing:0.3 }}>Due list</div>
              <div style={{ fontSize:11.5, color:'rgba(255,255,255,.4)', marginTop:3, fontWeight:500 }}>Takrorlash vaqti kelgan so'zlar</div>
            </div>
            <ChevronRight size={18} color="rgba(255,255,255,.28)"/>
          </button>

          {/* So'z Qo'shish - Green accent, specialized shimmer, pulse from original */}
          <button onClick={()=>navigate('/sozqoshish')} style={{ width:'100%', display:'flex', alignItems:'center', gap:14, background:'linear-gradient(135deg,rgba(34,197,94,.12) 0%,rgba(16,185,129,.06) 100%)', border:'1.5px solid rgba(34,197,94,.45)', borderRadius:20, padding:'16px 16px', cursor:'pointer', backdropFilter:'blur(10px)', transition:'transform 0.2s', animation:'pulse-green-alt 3.5s ease-in-out infinite,fadeIn .5s .16s var(--easing-standard) both', position:'relative', overflow:'hidden', boxShadow: '0 4px 15px rgba(34,197,94,0.15)' }} 
            onTouchStart={e=>e.currentTarget.style.transform='scale(.98)'} onTouchEnd={e=>e.currentTarget.style.transform='scale(1)'}>
            <div style={{ position:'absolute', inset:0, overflow:'hidden', borderRadius:20, pointerEvents:'none', zIndex:0 }}><div style={{ position:'absolute', top:0, left:0, width:'40%', height:'100%', background:'linear-gradient(90deg,transparent,rgba(34,197,94,.1),transparent)', animation:'shimmer 2.8s ease-in-out infinite' }}/></div>
            <div style={{ width:50, height:50, borderRadius:16, flexShrink:0, background:'linear-gradient(135deg,#22c55e,#10b981)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 3px 16px rgba(34,197,94,.4)', position:'relative', zIndex:1 }}><Plus size={25} color="#fff" strokeWidth={3}/></div>
            <div style={{ flex:1, textAlign:'left', position:'relative', zIndex:1 }}>
              <div style={{ fontWeight:800, fontSize:16, color:'#22c55e', letterSpacing:0.3, textShadow:'0 0 10px rgba(34,197,94,0.3)' }}>So'z qo'shish</div>
              <div style={{ fontSize:11.5, color:'rgba(255,255,255,.4)', marginTop:3, fontWeight:500 }}>Yangi so'z qo'shing</div>
            </div>
            <ChevronRight size={18} color="rgba(34,197,94,.6)" style={{ position:'relative', zIndex:1 }}/>
          </button>

          {/* Jami So'zlar - Orange accent, minimal */}
          <button onClick={()=>navigate('/jamisozlar')} style={{ width:'100%', display:'flex', alignItems:'center', gap:14, background:'rgba(255,255,255,.03)', border:'1.2px solid rgba(255,255,255,.09)', borderLeft:'4px solid rgba(245,166,35,.45)', borderRadius:20, padding:'14px 16px', cursor:'pointer', backdropFilter:'blur(10px)', transition:'all 0.2s', animation:'fadeIn .5s .22s var(--easing-standard) both', boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }} 
            onTouchStart={e=>e.currentTarget.style.background='rgba(255,255,255,.07)'} onTouchEnd={e=>e.currentTarget.style.background='rgba(255,255,255,.03)'}>
            <div style={{ width:48, height:48, borderRadius:15, flexShrink:0, background:'rgba(245,166,35,.12)', border:'1px solid rgba(245,166,35,.28)', display:'flex', alignItems:'center', justifyContent:'center' }}><BookOpen size={23} color="#F5A623"/></div>
            <div style={{ flex:1, textAlign:'left' }}>
              <div style={{ fontWeight:700, fontSize:16, color:'#fff', letterSpacing:0.3 }}>Jami so'zlar</div>
              <div style={{ fontSize:11.5, color:'rgba(255,255,255,.4)', marginTop:3, fontWeight:500 }}>Barcha qo'shilgan so'zlar</div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:6, paddingRight:5 }}><TrendingUp size={14} color="rgba(245,166,35,.6)"/><span style={{ fontSize:15, fontWeight:800, color:'rgba(255,255,255,.5)', letterSpacing:0.5 }}>{wordCount||0}</span></div>
          </button>
        </div>

        {/* --- SECTION HEADER (Image 3 style header, dynamic text) --- */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'26px 18px 8px', animation:'fadeIn .5s .3s var(--easing-standard) both' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <Zap size={19} color="#F5A623" fill="#F5A623" style={{ filter: `drop-shadow(0 0 4px ${'#F5A623'}80)` }}/>
            <span style={{ fontWeight:800, fontSize:19, letterSpacing:0.5, background:'linear-gradient(90deg,#fff 0%,#F5A623 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', textShadow:'0 1px 1px rgba(0,0,0,0.3)' }}>Bo'limlar bo'yicha</span>
          </div>
          <Sparkles size={17} color="#F5A623" style={{ opacity:0.8 }}/>
        </div>

        {/* --- PERFECTED 3D CUBE (Image 0 integration) --- */}
        <Cube3D currentBox={boxStats?.[0]?.n ?? 1} />

        {/* --- ELECTRIC FLOWING BOXES (Image 2 + Image 3 flow) --- */}
        <ElecBoxes boxStats={boxStats}/>
      </div>
    </div>
  )
}