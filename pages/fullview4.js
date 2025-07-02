import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
const imgs = ['/new/foma.png','/new/foma2.png'];
export default function FullView4() {
  const router = useRouter();
  const [img, setImg] = useState(imgs[0]);
  const [fade, setFade] = useState(false);
  useEffect(()=>{ setImg(imgs[Math.floor(Math.random()*imgs.length)]); setFade(true); return () => setFade(false); },[]);
  return (
    <div
      style={{
        position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh',
        background: '#ff9800', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        transition: 'background 1.5s',
        opacity: fade ? 1 : 0,
        transitionProperty: 'opacity, background',
        transitionDuration: '1.5s',
      }}
      onClick={() => router.back()}
    >
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
      <img src={img} alt="full" style={{ width: 'auto', height: '100vh', objectFit: 'contain', maxWidth: '100vw', maxHeight: '100vh' }} />
    </div>
  );
} 