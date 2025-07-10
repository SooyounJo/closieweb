import '../styles/global.css';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

function GlobalAudio({ playTrigger }) {
  const audioRef = useRef(null);
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.2;
      if (playTrigger) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }
      }
    }
  }, [playTrigger]);
  return <audio ref={audioRef} src="/1tag/mc.mp3" autoPlay loop hidden />;
}

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [audioReady, setAudioReady] = useState(false);

  useEffect(() => {
    if (audioReady) return;
    const handler = () => setAudioReady(true);
    window.addEventListener('click', handler, { once: true });
    window.addEventListener('touchstart', handler, { once: true });
    return () => {
      window.removeEventListener('click', handler);
      window.removeEventListener('touchstart', handler);
    };
  }, [audioReady]);

  useEffect(() => {
    if (router.pathname === '/intro') return;
    let timer;
    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (router.pathname !== '/intro') router.push('/intro');
      }, 40000);
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
  }, [router.pathname]);

  return (
    <>
      <GlobalAudio playTrigger={audioReady} />
      {!audioReady && (
        <div style={{
          position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh',
          background: 'rgba(10,20,40,0.85)', color: '#fff', zIndex: 999999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, fontWeight: 700, letterSpacing: 1, textAlign: 'center',
          userSelect: 'none', cursor: 'pointer'
        }}>
          🎵 음악을 들으려면 화면을 한 번 클릭해 주세요
        </div>
      )}
      <Component {...pageProps} />
    </>
  );
} 