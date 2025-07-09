import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
export default function FullView32() {
  const router = useRouter();
  const [fade, setFade] = useState(false);
  const [showTaggingGuide, setShowTaggingGuide] = useState(false);
  const idleTimeout = 40000; // 40초
  useEffect(() => { setFade(true); return () => setFade(false); }, []);
  useEffect(() => {
    const timer = setTimeout(() => setShowTaggingGuide(true), 3000);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    let timer;
    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => router.push('/intro'), idleTimeout);
    };
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('mousedown', resetTimer);
    window.addEventListener('touchstart', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('scroll', resetTimer);
    resetTimer();
    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('mousedown', resetTimer);
      window.removeEventListener('touchstart', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('scroll', resetTimer);
    };
  }, []);
  return (
    <div
      style={{
        position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh',
        background: '#7ed957', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'default',
        transition: 'background 1.5s',
        opacity: fade ? 1 : 0,
        transitionProperty: 'opacity, background',
        transitionDuration: '1.5s',
      }}
    >
      {showTaggingGuide && <TaggingGuideModal open={showTaggingGuide} />}
      {/* 뒤로가기 버튼 */}
      <button
        onClick={e => { e.stopPropagation(); router.back(); }}
        style={{
          position: 'fixed', left: 24, top: 24, zIndex: 100000,
          background: '#fff', border: 'none', borderRadius: '50%', width: 48, height: 48,
          display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px #0003', cursor: 'pointer',
        }}
        aria-label="뒤로가기"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M15.5 19L8.5 12L15.5 5" stroke="#ff9800" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      {/* 다른 옷과 만나기 버튼 */}
      <button
        onClick={e => { e.stopPropagation(); router.push('/intro'); }}
        style={{
          position: 'fixed', right: 32, bottom: 32, zIndex: 100000,
          background: '#fff', color: '#ff9800', border: 'none', borderRadius: 16, fontWeight: 700,
          fontSize: 20, padding: '18px 36px', boxShadow: '0 2px 8px #0003', cursor: 'pointer',
        }}
      >
        다른 옷과 만나기
      </button>
      <img src={'/new/go2.png'} alt="full" style={{ height: '100vh', width: 'auto', objectFit: 'contain', display: 'block', margin: '0 auto' }} />
    </div>
  );
}

function TaggingGuideModal({ open }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh',
      background: 'rgba(10,20,40,0.55)', zIndex: 20000, display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.97)', borderRadius: 32, padding: '56px 48px 48px 48px', color: '#222',
        fontSize: 22, fontWeight: 500, textAlign: 'center', boxShadow: '0 12px 48px #000a', maxWidth: 440, lineHeight: 1.7,
        display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: 80, position: 'relative',
      }}>
        <svg width="120" height="120" viewBox="0 0 120 120" style={{ position: 'absolute', left: -110, top: '50%', transform: 'translateY(-50%)' }}>
          <polyline points="120,60 20,20 40,60 20,100 120,60" fill="#ff9800" stroke="#ff9800" strokeWidth="4" />
        </svg>
        <div style={{ marginBottom: 24, fontWeight: 700, fontSize: 28, color: '#ff9800' }}>
          좌측 클로지 케이스에 붙어있는 패치에<br/>핸드폰을 태깅해보세요!
        </div>
        <div style={{ fontSize: 18, color: '#444', marginBottom: 0 }}>
          NFC 태깅이 잘 안될 경우<br/>패치에 핸드폰을 밀착해보세요.
        </div>
      </div>
    </div>
  );
} 