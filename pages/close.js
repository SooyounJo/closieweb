import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const DEFAULT_IMG = 'https://cdn-icons-png.flaticon.com/512/892/892458.png';
const DEFAULT_DESC = '매일 입기 좋은 심플한 디자인의 베이직 라인입니다.';
const DEFAULT_DISTANCE = '가까운 곳';
const DEFAULT_KEYWORD = '베이직 라인';

export default function Close() {
  const router = useRouter();
  const { img, desc, lat, lng, distance, keyword, category, subCategory, idx } = router.query;
  // 카테고리/소카테고리별 이미지 강제 매핑
  let showImg = img || DEFAULT_IMG;
  if (category === '특수정장') {
    const formalImgs = ['/basic/b1.png', '/basic/b2.png', '/basic/fo.png'];
    const formalIdx = parseInt(idx, 10) || 0;
    showImg = formalImgs[formalIdx % formalImgs.length];
  } else if (category === '베이직 라인') {
    if (['상의', '하의', '겉옷', '악세서리'].includes(subCategory)) {
      // 2d/1~10.png 중 랜덤하게 선택
      const randomIdx = Math.floor(Math.random() * 10) + 1;
      showImg = `/2d/${randomIdx}.png`;
    }
  } else if (category === '계절의 특수성') {
    const weaMap = {
      '봄': '/wea/w1.png',
      '여름': '/wea/w2.png',
      '가을': '/wea/w3.png',
      '겨울': '/wea/w4.png',
    };
    if (weaMap[subCategory]) showImg = weaMap[subCategory];
  }
  const showDesc = desc || DEFAULT_DESC;
  const showDistance = distance || DEFAULT_DISTANCE;
  const showKeyword = keyword || DEFAULT_KEYWORD;
  const [bgMap, setBgMap] = useState('map');
  const [mapAnim, setMapAnim] = useState(false);

  // 옷 이미지(소분류별) 결정
  let clothImg = null;
  if (category === '베이직 라인') {
    const basicMap = {
      '상의': '/basic/b1.png',
      '하의': '/basic/b2.png',
      '겉옷': '/basic/b3.png',
      '악세서리': '/basic/b4.png',
    };
    if (basicMap[subCategory]) clothImg = basicMap[subCategory];
  } else if (category === '계절의 특수성') {
    const weaMap = {
      '봄': '/wea/w1.png',
      '여름': '/wea/w2.png',
      '가을': '/wea/w3.png',
      '겨울': '/wea/w4.png',
    };
    if (weaMap[subCategory]) clothImg = weaMap[subCategory];
  }

  useEffect(() => {
    setTimeout(() => setMapAnim(true), 100);
  }, []);

  return (
    <>
      <Head>
        <title>Closie Station</title>
      </Head>
      <div style={{ width: '100vw', height: '100vh', position: 'fixed', left: 0, top: 0, zIndex: 1, background: '#181c24' }}>
        {/* 블러 배경 지도 이미지 */}
        <img
          src={bgMap === 'map' ? '/2d/map.png' : '/2d/map2.png'}
          alt="지도 배경"
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            width: '100vw',
            height: '100vh',
            objectFit: 'cover',
            zIndex: 0,
            filter: 'blur(1px) brightness(0.92)',
            pointerEvents: 'none',
            userSelect: 'none',
            transition: 'transform 1.2s cubic-bezier(0.77,0,0.18,1)',
            transform: mapAnim
              ? (bgMap === 'map2' ? 'scale(3.2) translate(-32vw, 0)' : 'scale(2.2) translate(-22vw, -18vh)')
              : 'scale(1) translate(0, 0)',
          }}
        />
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
        {/* 일반 지도로 변경 버튼 */}
        <button
          onClick={() => setBgMap(bgMap === 'map' ? 'map2' : 'map')}
          style={{
            position: 'fixed',
            left: 90,
            top: 24,
            background: '#ff9800',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            padding: '10px 22px',
            fontWeight: 'bold',
            fontSize: 15,
            cursor: 'pointer',
            boxShadow: '0 2px 8px #ff980055',
            zIndex: 101,
            letterSpacing: 1,
          }}
        >
          {bgMap === 'map' ? '일반 지도로 변경' : '서울 지도 보기'}
        </button>
        {/* 중앙에 클로지 스테이션 마커 + 옷/설명 */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 20,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          minWidth: 540,
        }}>
          {/* 마커+텍스트 (좌측, 기존 위치 그대로) */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginRight: 32,
            minWidth: 80,
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
          </div>
          {/* 베이스 박스+옷+옷장 (우측 1/3) */}
          <div style={{
            position: 'fixed',
            right: 0,
            top: '-100px',
            width: '28vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}>
            <img
              src="/base.png"
              alt="base"
              style={{
                position: 'fixed',
                right: 0,
                top: '-100px',
                width: '28vw',
                height: '100vh',
                objectFit: 'cover',
                zIndex: 1,
              }}
            />
            {/* 옷장(2d) 이미지 */}
            <img
              src={img}
              alt="closet"
              style={{
                width: 220,
                height: 220,
                objectFit: 'contain',
                filter: 'drop-shadow(0 4px 24px #0008)',
                position: 'relative',
                zIndex: 2,
                marginBottom: -60,
                background: 'transparent',
                marginTop: 60,
              }}
            />
            {/* 소분류별 옷 이미지 */}
            {clothImg && (
              <img
                src={clothImg}
                alt="cloth"
                style={{
                  width: 120,
                  height: 120,
                  objectFit: 'contain',
                  position: 'relative',
                  zIndex: 3,
                  background: 'transparent',
                  pointerEvents: 'none',
                  marginTop: -40,
                }}
              />
            )}
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