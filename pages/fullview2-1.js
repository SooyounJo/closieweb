import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

function TaggingGuideModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh',
      background: 'rgba(10,20,40,0.55)', zIndex: 20000, display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.95)', borderRadius: 24, padding: '40px 32px 32px 32px', color: '#222',
        fontSize: 17, fontWeight: 500, textAlign: 'center', boxShadow: '0 8px 32px #000a', maxWidth: 340, lineHeight: 1.7,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        <div style={{ marginBottom: 16, fontWeight: 700, fontSize: 18, color: '#ff9800' }}>
          다음 좌측 태깅 인터랙션을 통해<br/>옷의 디테일한 히스토리를 구경해보세요!
        </div>
        <button
          onClick={onClose}
          style={{
            marginTop: 10, background: '#ff9800', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 32px',
            fontSize: 17, fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 8px #ff980055',
          }}
        >
          확인
        </button>
      </div>
    </div>
  );
}

export default function FullView21() {
  const router = useRouter();
  const [fade, setFade] = useState(false);
  const [showTaggingGuide, setShowTaggingGuide] = useState(false);
  const [isTriangle, setIsTriangle] = useState(false);
  useEffect(() => { setFade(true); return () => setFade(false); }, []);
  useEffect(() => {
    const timer = setTimeout(() => setShowTaggingGuide(true), 5000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div
      style={{
        position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh',
        background: isTriangle
          ? 'conic-gradient(from 90deg at 50% 100%, #ff9800 0deg, #fff0 120deg, #fff0 240deg, #ff9800 360deg)'
          : 'radial-gradient(circle at 50% 50%, #ff9800 0%, #ffb347 60%, #fff0 100%)',
        zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'default',
        transition: 'background 1.5s',
        opacity: fade ? 1 : 0,
        transitionProperty: 'opacity, background',
        transitionDuration: '1.5s',
        animation: isTriangle ? undefined : 'glowCircle 2s infinite alternate',
      }}
    >
      <style>{`
        @keyframes glowCircle {
          0% { box-shadow: 0 0 0px 0px #ff9800; }
          100% { box-shadow: 0 0 80px 40px #ff980088; }
        }
      `}</style>
      <TaggingGuideModal open={showTaggingGuide} onClose={() => setShowTaggingGuide(false)} />
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
      <img src={'/new/tr.png'} alt="full" style={{ height: '100vh', width: 'auto', objectFit: 'contain', display: 'block', margin: '0 auto', zIndex: 10 }} onClick={() => setIsTriangle(v => !v)} />
    </div>
  );
} 