import '../styles/global.css';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useState } from 'react';

function GlobalAudio() {
  const audioRef = useRef(null);
  // 오디오 태그가 마운트될 때만 한 번 실행
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.2;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
  }, []);
  return <audio ref={audioRef} src="/1tag/mc.mp3" autoPlay loop hidden />;
}

export default function App({ Component, pageProps }) {
  const router = useRouter();
  // 40초 idle 체크 (intro 페이지 제외)
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
      <GlobalAudio />
      <Component {...pageProps} />
    </>
  );
} 