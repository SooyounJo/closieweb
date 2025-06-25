import React, { useMemo } from 'react';
import { useSprings, animated } from 'react-spring';
import { useRouter } from 'next/router';

const ZOOM_LEVELS = [
  { label: '석관동', rects: 24, keyword: '석관동', baseLat: 37.6132, baseLng: 127.0666 },
  { label: '성북구', rects: 12, keyword: '성북구', baseLat: 37.5894, baseLng: 127.0167 },
  { label: '서울', rects: 6, keyword: '서울', baseLat: 37.5665, baseLng: 126.9780 },
];

// 예시 옷 이미지 배열 (실제 서비스에서는 다양하게 교체)
const CLOTHES_IMAGES = [
  'https://cdn-icons-png.flaticon.com/512/892/892458.png',
  'https://cdn-icons-png.flaticon.com/512/892/892463.png',
  'https://cdn-icons-png.flaticon.com/512/892/892464.png',
  'https://cdn-icons-png.flaticon.com/512/892/892465.png',
  'https://cdn-icons-png.flaticon.com/512/892/892466.png',
  'https://cdn-icons-png.flaticon.com/512/892/892467.png',
];

export default function MovingRects({ zoomLevel, rectCount, onRequireCategory, subCategory }) {
  const router = useRouter();
  const zoom = ZOOM_LEVELS[zoomLevel] || ZOOM_LEVELS[0];
  const rects = rectCount ?? zoom.rects;
  const rectWidth = 160;
  const rectHeight = 320;
  const gap = rectWidth * 0.2;
  const railLength = rects * (rectWidth + gap);

  const subCategoryImageMap = {
    '봄': 1, '여름': 2, '가을': 3, '겨울': 4,
    '스트릿': 5, '포멀': 6, '캐주얼': 7, '빈티지': 8,
    '비즈니스': 9, '휴양지': 10, '백패킹': 1, '도심': 2,
    '상의': 3, '하의': 4, '겉옷': 5, '악세서리': 6
  };
  const rectsData = useMemo(() => {
    return Array.from({ length: rects }, (_, i) => {
      // 거리: 왼쪽(가까움), 오른쪽(멀음)
      const distanceRank = i + 1; // 왼쪽이 1(가장 가까움)
      const distanceLabel = i === 0 ? '가장 가까움' : i === rects - 1 ? '가장 멀리 있음' : `${distanceRank}번째로 가까움`;
      // 위치: baseLat/baseLng에서 약간씩 변화
      const lat = zoom.baseLat + (i - rects / 2) * 0.002;
      const lng = zoom.baseLng + (i - rects / 2) * 0.002;
      // 키워드: zoomLevel에 따라 다름
      const keyword = zoom.keyword;
      // 이미지/설명 예시
      let img;
      if (subCategory && rects === 1) {
        const imgIdx = subCategoryImageMap[subCategory] || 1;
        img = `/2d/${imgIdx}.png`;
      } else {
        img = `/2d/${(i % 10) + 1}.png`;
      }
      const desc = `${keyword} 지역 ${distanceLabel}의 추천 옷입니다.`;
      return { img, desc, lat, lng, distanceLabel, keyword, idx: i };
    });
  }, [rects, zoom, subCategory]);

  // 각 사각형의 x 위치를 계산
  const positions = useMemo(
    () => Array.from({ length: rects }, (_, i) => i * (rectWidth + gap)),
    [rects]
  );

  // 랜덤 흔들림 각도
  const randomAngles = useMemo(
    () => Array.from({ length: rects }, () => (Math.random() - 0.5) * 16),
    [rects]
  );

  // 스프링 애니메이션 (흔들림 포함)
  const [springs] = useSprings(rects, (index) => ({
    from: { x: -200, rotate: randomAngles[index] * 2 },
    to: async (next) => {
      await next({ x: positions[index], rotate: randomAngles[index] });
      await next({ rotate: randomAngles[index] * 0.5 });
      await next({ rotate: randomAngles[index] });
    },
    config: { tension: 180, friction: 18 },
    delay: index * 80,
  }), [positions, rects, randomAngles]);

  // 사각형 클릭 핸들러: 해당 옷/설명/위치/거리/키워드 정보를 쿼리스트링으로 전달
  const handleRectClick = (i) => {
    if (typeof onRequireCategory === 'function') {
      onRequireCategory(i, rectsData[i]);
      return;
    }
    const d = rectsData[i];
    router.push(`/close?img=${encodeURIComponent(d.img)}&desc=${encodeURIComponent(d.desc)}&lat=${d.lat}&lng=${d.lng}&distance=${encodeURIComponent(d.distanceLabel)}&keyword=${encodeURIComponent(d.keyword)}`);
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      background: `url('/2d/blu.png') center center / cover no-repeat`,
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 10,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      {/* 어두운 블루 오버레이 */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(10,20,40,0.85)',
        zIndex: 11,
        pointerEvents: 'none',
      }} />
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        height: rectHeight + 40,
        width: railLength,
        margin: '0 auto',
        position: 'relative',
        justifyContent: 'center',
        zIndex: 12,
      }}>
        {/* 레일 (위쪽) */}
        <div
          style={{
            position: 'fixed',
            left: 0,
            top: '200px',
            width: '100vw',
            height: 18,
            backgroundImage: "url('/2d/zip.png')",
            backgroundRepeat: 'repeat-x',
            backgroundSize: 'auto 18px',
            zIndex: 0,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        />
        {/* 사각형들 */}
        {springs.map((spring, i) => {
          // 중앙 인덱스 계산
          const centerIdx = Math.floor(rects / 2);
          const isCenter = i === centerIdx;
          return (
            <animated.div
              key={i}
              style={{
                ...spring,
                width: rectWidth,
                height: rectHeight,
                marginRight: gap,
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                zIndex: 1,
                position: 'absolute',
                left: 0,
                top: 18, // 레일 바로 아래에 붙음
                willChange: 'transform',
                transformOrigin: '50% 0%', // 위쪽 피봇
                cursor: 'pointer',
                userSelect: 'none',
                ...(isCenter ? { transform: `${spring.transform ? spring.transform : ''} scale(1.25)` } : {}),
              }}
              onClick={() => handleRectClick(i)}
              tabIndex={0}
              role="button"
              aria-label={`closie station ${i + 1}`}
              title={rectsData[i].desc}
            >
              <img
                src="/2d/ziphe.png"
                alt="집게"
                style={{
                  position: 'absolute',
                  top: -8,
                  left: '50%',
                  width: rectWidth * 0.35,
                  height: 'auto',
                  transform: 'translateX(-50%)',
                  zIndex: 2,
                  pointerEvents: 'none',
                  userSelect: 'none',
                  display: 'block',
                }}
              />
              <img
                src={rectsData[i].img}
                alt={rectsData[i].desc}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: 'block',
                  ...(rectsData[i].img.includes('3.png') ? { transform: 'scale(2)' } : {}),
                }}
              />
            </animated.div>
          );
        })}
        {/* 하단 거리 라벨 박스 */}
        <div style={{
          position: 'absolute',
          left: 0,
          bottom: -70,
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pointerEvents: 'none',
          zIndex: 30,
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.65)',
            color: '#222',
            fontSize: 18,
            fontWeight: 'bold',
            borderRadius: 16,
            padding: '8px 24px',
            boxShadow: '0 2px 8px #0002',
            marginLeft: 8,
            userSelect: 'none',
          }}>
            먼 곳
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.65)',
            color: '#222',
            fontSize: 18,
            fontWeight: 'bold',
            borderRadius: 16,
            padding: '8px 24px',
            boxShadow: '0 2px 8px #0002',
            marginRight: 8,
            userSelect: 'none',
          }}>
            가까운 곳
          </div>
        </div>
      </div>
    </div>
  );
} 