'use client'
import { useState } from 'react'

const PL = {1:'거의 없음',2:'아주 약함',3:'약함',4:'약간 있음',5:'중간 정도',6:'다소 강함',7:'강함',8:'매우 강함',9:'극심함',10:'참기 힘든 통증'}

const s = {
  body: {minHeight:'100vh',background:'#0d1117',color:'#e6edf3',fontFamily:"'Apple SD Gothic Neo',sans-serif"},
  topbar: {background:'#161b22',borderBottom:'1px solid #21262d',padding:'0 24px',height:52,display:'flex',alignItems:'center',fontSize:16,fontWeight:600,position:'sticky',top:0,zIndex:10},
  home: {maxWidth:680,margin:'0 auto',padding:'56px 20px',textAlign:'center'},
  title: {fontSize:28,fontWeight:700,marginBottom:10},
  sub: {fontSize:15,color:'#8b949e',lineHeight:1.7,marginBottom:32},
  grid: {display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,maxWidth:500,margin:'0 auto'},
  card: {background:'#161b22',border:'1px solid #21262d',borderRadius:16,padding:'40px 20px',cursor:'pointer',textAlign:'center',transition:'all 0.2s'},
  cardIcon: {fontSize:44,marginBottom:16},
  cardName: {fontSize:18,fontWeight:700,marginBottom:8,lineHeight:1.4},
  cardDesc: {fontSize:13,color:'#8b949e',lineHeight:1.6},
  page: {maxWidth:680,margin:'0 auto',padding:'28px 20px 60px'},
  backBtn: {background:'transparent',border:'none',color:'#8b949e',fontSize:13,cursor:'pointer',marginBottom:20,padding:0},
  pageHeader: {display:'flex',alignItems:'center',gap:14,marginBottom:28},
  pageIcon: {fontSize:32},
  pageTitle: {fontSize:22,fontWeight:700},
  pageSub: {fontSize:13,color:'#8b949e',marginTop:3},
  sec: {background:'#161b22',border:'1px solid #21262d',borderRadius:12,padding:22,marginBottom:14},
  secTitle: (blue) => ({fontSize:12,fontWeight:700,color: blue ? '#58a6ff' : '#e05c5c',marginBottom:18,letterSpacing:'0.06em',textTransform:'uppercase'}),
  label: {fontSize:13,color:'#8b949e',marginBottom:8,marginTop:14},
  input: {width:'100%',background:'#0d1117',border:'1px solid #21262d',borderRadius:8,padding:'10px 14px',color:'#e6edf3',fontSize:14,fontFamily:'inherit',outline:'none'},
  textarea: {width:'100%',background:'#0d1117',border:'1px solid #21262d',borderRadius:8,padding:'10px 14px',color:'#e6edf3',fontSize:14,fontFamily:'inherit',outline:'none',resize:'vertical',minHeight:90,lineHeight:1.7},
  chips: {display:'flex',flexWrap:'wrap',gap:8,marginTop:8},
  chip: (on, red) => ({background: on ? (red ? '#2d1a1a' : '#1a2d1a') : '#0d1117',border: `1px solid ${on ? (red ? '#e05c5c' : '#3fb950') : '#21262d'}`,borderRadius:8,padding:'8px 16px',fontSize:13,color: on ? (red ? '#e05c5c' : '#3fb950') : '#8b949e',cursor:'pointer',userSelect:'none',transition:'all 0.15s'}),
  painRow: {display:'flex',alignItems:'center',gap:16,marginTop:8},
  painNum: {fontSize:32,fontWeight:700,color:'#e05c5c',minWidth:36},
  painDesc: {fontSize:12,color:'#8b949e',minWidth:80},
  submitBtn: (blue) => ({width:'100%',background: blue ? 'linear-gradient(135deg,#1d6fa4,#0e4f7a)' : 'linear-gradient(135deg,#e05c5c,#c0392b)',border:'none',borderRadius:10,padding:15,color:'#fff',fontSize:15,fontWeight:700,cursor:'pointer',fontFamily:'inherit',marginTop:6}),
  resultBox: {background:'#0d1a2a',border:'1px solid #1f3d5c',borderRadius:12,padding:22,marginTop:16},
  resultLabel: {fontSize:12,color:'#58a6ff',fontWeight:700,marginBottom:12},
  resultText: {fontSize:14,lineHeight:1.85,color:'#cdd9e5',whiteSpace:'pre-wrap'},
}

function Chip({ label, on, red, onClick }) {
  return <span style={s.chip(on, red)} onClick={onClick}>{label}</span>
}

function ChipGroup({ items, selected, multi, onToggle, red }) {
  return (
    <div style={s.chips}>
      {items.map(item => (
        <Chip key={item} label={item}
          on={multi ? selected.includes(item) : selected === item}
          red={red}
          onClick={() => onToggle(item)}
        />
      ))}
    </div>
  )
}

export default function Home() {
  const [page, setPage] = useState('home')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [mName, setMName] = useState('')
  const [mPos, setMPos] = useState('')
  const [mParts, setMParts] = useState([])
  const [mPain, setMPain] = useState(5)
  const [mWhen, setMWhen] = useState('')
  const [mSit, setMSit] = useState('')
  const [mDetail, setMDetail] = useState('')
  const [tName, setTName] = useState('')
  const [tPos, setTPos] = useState('')
  const [tAreas, setTAreas] = useState([])
  const [tConcern, setTConcern] = useState('')
  const [tGoal, setTGoal] = useState('')

  const toggleArr = (arr, set, val) =>
    arr.includes(val) ? set(arr.filter(v => v !== val)) : set([...arr, val])

  const goPage = (p) => { setPage(p); setResult(''); setLoading(false) }

  const callAPI = async (prompt) => {
    setLoading(true)
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResult(data.text)
    } catch (e) {
      setResult('오류: ' + e.message)
    }
    setLoading(false)
  }

  const submitMedical = () => {
    if (!mWhen || !mSit) { alert('언제부터, 어떤 상황에서 불편한지 선택해주세요.'); return }
    callAPI(`당신은 AMAR VITA 소속 야구 메디컬 트레이너입니다. 선수에게 직접 말하는 것처럼 전문적이고 따뜻한 말투(~해요 체)로 답변해주세요. AI라는 것을 절대 드러내지 마세요.\n\n[선수 정보]\n- 이름: ${mName||'선수'}\n- 포지션: ${mPos||'미선택'}\n- 불편한 부위: ${mParts.join(', ')||'미선택'}\n- 통증 강도: ${mPain}/10 (${PL[mPain]})\n- 발생 시기: ${mWhen}\n- 발생 상황: ${mSit}\n- 추가 증상: ${mDetail||'없음'}\n\n다음 순서로 답변해주세요:\n1. 현재 상태 판단 (예상 원인 포함, 2~3문장)\n2. 지금 당장 해야 할 것 (2가지)\n3. 이번 주 관리 방향\n4. 병원 방문이 필요한 경우 명시`)
  }

  const submitTech = () => {
    if (!tConcern) { alert('현재 상황 및 고민을 입력해주세요.'); return }
    callAPI(`당신은 AMAR VITA 소속 야구 기술 코치입니다. 선수에게 직접 말하는 것처럼 전문적이고 따뜻한 말투(~해요 체)로 답변해주세요. AI라는 것을 절대 드러내지 마세요.\n\n[선수 정보]\n- 이름: ${tName||'선수'}\n- 포지션: ${tPos||'미선택'}\n- 피드백 원하는 분야: ${tAreas.join(', ')||'미선택'}\n- 현재 고민: ${tConc