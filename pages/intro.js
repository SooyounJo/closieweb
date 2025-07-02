import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Intro() {
  const router = useRouter();
  const [started, setStarted] = useState(false);

  // 터치/클릭 시 메인 화면으로 전환
  const handleStart = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('introSeen', 'true');
    }
    setStarted(true);
  };

  return (
    <>
      <Head>
        <title>Find Your Closie</title>
      </Head>
      <div
        style={{
          width: '100vw',
          height: '100vh',
          background: 'url(/main.png) center center / cover no-repeat',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          cursor: started ? 'default' : 'pointer',
        }}
        onClick={!started ? handleStart : undefined}
        onTouchStart={!started ? handleStart : undefined}
      >
        {/* 어두운 오버레이 (started 상태에서만) */}
        {started && (
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.6)',
            zIndex: 1,
            transition: 'background 0.5s',
          }} />
        )}
        {/* 터치 유도 인터랙션 */}
        {!started && (
          <div style={{
            position: 'absolute',
            left: 0,
            width: '100%',
            bottom: '8%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            flexDirection: 'column',
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 1,
            animation: 'fadeIn 1s',
            userSelect: 'none',
          }}>
            {/* da.png 이미지 터치해야만 시작 */}
            <img
              src="/da.png"
              alt="터치 시작"
              style={{
                width: 120,
                height: 120,
                marginBottom: 14,
                cursor: 'pointer',
                animation: 'tapHand 1.2s infinite alternate',
                zIndex: 11,
              }}
              onClick={handleStart}
              onTouchStart={handleStart}
            />
            <div style={{ marginTop: 24 }}>화면을 터치해 시작하기</div>
          </div>
        )}
        {/* 메인 컨텐츠 (started 상태에서만) */}
        {started && (
          <div style={{ position: 'relative', zIndex: 2, width: '100%' }}>
            <h1
              style={{
                fontSize: 32,
                fontWeight: 900,
                letterSpacing: 2,
                marginBottom: 24,
                color: '#fff',
              }}
            >
              Find your closie
            </h1>
            <div style={{ fontSize: 20, lineHeight: 1.6, maxWidth: 420, color: '#e0e0e0', margin: '0 auto 40px auto', background: 'rgba(24,28,36,0.92)', borderRadius: 18, padding: '18px 32px', textAlign: 'center', boxShadow: '0 4px 24px #0004' }}>
              가장 가까운 클로지 스테이션부터,<br />
              멀리 있는 스테이션에 살고 있는 친구들 중<br />
              <b>나랑 가장 잘 맞을 클로지</b>를 찾아보세요!
            </div>
            {/* 하단 고정 주황색 버튼 */}
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  localStorage.setItem('introSeen', 'true');
                }
                router.push('/');
              }}
              style={{
                position: 'fixed',
                left: '50%',
                bottom: 48,
                transform: 'translateX(-50%)',
                background: '#ff9800',
                color: '#fff',
                border: 'none',
                borderRadius: 16,
                padding: '18px 48px',
                fontSize: 20,
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 24px #ff980055',
                zIndex: 30,
                letterSpacing: 1,
              }}
            >
              찾으러 가기
            </button>
          </div>
        )}
        {/* 좌상단 뒤로가기 버튼 (started 상태에서만) */}
        {started && (
          <button
            onClick={() => router.push('/')}
            style={{
              position: 'absolute',
              left: 32,
              top: 32,
              background: 'rgba(30,30,30,0.8)',
              border: 'none',
              borderRadius: '50%',
              padding: 10,
              width: 44,
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px #000a',
              zIndex: 3,
            }}
            aria-label="뒤로 가기"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.5 19L8.5 12L15.5 5" stroke="#ff9800" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
        <style jsx global>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes tapHand {
            0% { transform: translateY(0); }
            100% { transform: translateY(18px) scale(1.08); }
          }
        `}</style>
      </div>
    </>
  );
}

function InfoModal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed',
      left: 0,
      top: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(10,20,40,0.55)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.85)',
        borderRadius: 24,
        padding: '40px 32px 32px 32px',
        color: '#222',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        boxShadow: '0 8px 32px #000a',
        maxWidth: 340,
        lineHeight: 1.6,
      }}>
        {children}
        <button
          onClick={onClose}
          style={{
            marginTop: 28,
            background: '#ff9800',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            padding: '12px 32px',
            fontSize: 18,
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 2px 8px #ff980055',
          }}
        >
          확인
        </button>
      </div>
    </div>
  );
} 