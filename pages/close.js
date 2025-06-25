import Head from 'next/head';
import { useRouter } from 'next/router';

const DEFAULT_IMG = 'https://cdn-icons-png.flaticon.com/512/892/892458.png';
const DEFAULT_DESC = '매일 입기 좋은 심플한 디자인의 베이직 라인입니다.';
const DEFAULT_DISTANCE = '가까운 곳';
const DEFAULT_KEYWORD = '베이직 라인';

export default function Close() {
  const router = useRouter();
  const { img, desc, lat, lng, distance, keyword } = router.query;
  const showImg = img || DEFAULT_IMG;
  const showDesc = desc || DEFAULT_DESC;
  const showDistance = distance || DEFAULT_DISTANCE;
  const showKeyword = keyword || DEFAULT_KEYWORD;

  return (
    <>
      <Head>
        <title>Closie Station</title>
      </Head>
      <div style={{ width: '100vw', height: '100vh', position: 'fixed', left: 0, top: 0, zIndex: 1, background: '#181c24' }}>
        {/* 상단 뒤로 가기 버튼 */}
        <button
          onClick={() => router.push('/')}
          style={{
            position: 'fixed',
            left: 32,
            top: 24,
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
            zIndex: 100,
          }}
          aria-label="뒤로 가기"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.5 19L8.5 12L15.5 5" stroke="#ff9800" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {/* 중앙에 클로지 스테이션 마커 + 옷/설명 */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 20,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 48,
        }}>
          {/* 마커 */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginRight: 0,
          }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4faaff 60%, #fff 100%)',
              boxShadow: '0 4px 24px #4faaff88',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: 22,
              color: '#fff',
              marginBottom: 12,
              border: '3px solid #fff',
              animation: 'pulse 1.5s infinite alternate',
            }}>
              📍
            </div>
            <div style={{ color: '#fff', fontWeight: 'bold', fontSize: 18, textShadow: '0 2px 8px #000a', marginBottom: 8 }}>
              클로지 스테이션 위치
            </div>
            <div style={{ color: '#aaa', fontSize: 15 }}>{showDistance}</div>
          </div>
          {/* 옷+설명 */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 32,
          }}>
            <img src={showImg} alt="best-closie" style={{ width: 200, height: 200, filter: 'drop-shadow(0 4px 24px #0008)', animation: 'floatX 2.5s ease-in-out infinite alternate' }} />
            {/* 설명 박스 */}
            <div style={{
              width: 200,
              height: 200,
              background: 'rgba(30,40,60,0.7)',
              borderRadius: 24,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 24px #0006',
              backdropFilter: 'blur(4px)',
              color: '#fff',
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 16, color: '#4faaff', marginBottom: 10 }}>{showKeyword}</div>
              <div style={{ fontSize: 17, color: '#fff', fontWeight: 500, lineHeight: 1.5 }}>{showDesc}</div>
            </div>
          </div>
        </div>
        <style jsx global>{`
          @keyframes floatX {
            0% { transform: translateY(0) translateX(0); }
            100% { transform: translateY(-5px) translateX(-10px); }
          }
          @keyframes pulse {
            0% { box-shadow: 0 4px 24px #4faaff88, 0 0 0 0 #4faaff44; }
            100% { box-shadow: 0 4px 24px #4faaff88, 0 0 0 16px #4faaff11; }
          }
        `}</style>
      </div>
    </>
  );
} 