export const metadata = { title: '야구 선수 피드백 시스템' }
export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body style={{margin:0,padding:0,background:'#0d1117',color:'#e6edf3',fontFamily:"'Apple SD Gothic Neo','Malgun Gothic',sans-serif"}}>
        {children}
      </body>
    </html>
  )
}