import React, { useState, useEffect, useMemo } from 'react';
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

export default function MovingRects({ zoomLevel, rectCount, onRequireCategory, subCategory, categoryLabel }) {
  const router = useRouter();
  const zoom = ZOOM_LEVELS[zoomLevel] || ZOOM_LEVELS[0];
  const rects = rectCount ?? zoom.rects;
  const rectWidth = 240;
  const rectHeight = 480;
  const gap = rectWidth * 0.2;
  const railLength = rects * (rectWidth + gap);

  // rectsData를 상태로 관리
  const [rectsData, setRectsData] = useState([]);
  const [activeRect, setActiveRect] = useState(null);
  useEffect(() => {
    // 카테고리/소카테고리/rects가 바뀔 때마다 rectsData를 항상 2d 이미지로 초기화
    setRectsData(Array.from({ length: rects }, (_, i) => {
      const distanceRank = i + 1;
      const distanceLabel = i === 0 ? '가장 가까움' : i === rects - 1 ? '가장 멀리 있음' : `${distanceRank}번째로 가까움`;
      const lat = zoom.baseLat + (i - rects / 2) * 0.002;
      const lng = zoom.baseLng + (i - rects / 2) * 0.002;
      const keyword = zoom.keyword;
      return {
        img: `/2d/${(i % 10) + 1}.png`,
        desc: `${keyword} 지역 ${distanceLabel}의 추천 옷입니다.`,
        lat, lng, distanceLabel, keyword, idx: i
      };
    }));
  }, [rects, zoom, categoryLabel, subCategory]);

  // 특수정장(포멀) 카테고리 클릭 시 바로 fo.png로 변경
  useEffect(() => {
    if (categoryLabel === '특수정장') {
      setRectsData(prev => prev.map(r => ({ ...r, img: '/basic/fo.png' })));
    }
  }, [categoryLabel]);

  // 소분류별 이미지 매핑
  const basicMap = {
    '상의': '/basic/b1.png',
    '하의': '/basic/b2.png',
    '겉옷': '/basic/b3.png',
    '악세서리': '/basic/b4.png',
  };
  const weaMap = {
    '봄': '/wea/w1.png',
    '여름': '/wea/w2.png',
    '가을': '/wea/w3.png',
    '겨울': '/wea/w4.png',
  };
  const challengeMap = {
    '스트릿': '/sp/s1.png',
    '파격': '/sp/s2.png',
    '캐주얼': '/sp/s3.png',
    '빈티지': '/sp/s4.png',
  };
  const travelMap = {
    '도시': '/tri/t1.png',
    '자연': '/tri/t2.png',
    '활동적인': '/tri/t3.png',
    '휴양': '/tri/t4.png',
  };

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

  // 사각형 클릭 핸들러: 이미지 즉시 변경 → 카테고리 미선택 시 모달 호출, 아니면 중앙 이동만
  const handleRectClick = (i) => {
    if (!categoryLabel && typeof onRequireCategory === 'function') {
      onRequireCategory();
      return;
    }
    setActiveRect(i); // 중앙 이동
    // 옷장 클릭 시 bu/1~4에 따라 각 fullview 페이지로 이동
    if (typeof subCategory === 'number') {
      const page = ['/fullview1','/fullview2','/fullview3','/fullview4'][subCategory];
      if (page) router.push(page);
    }
  };

  // map.png 고정 박스 조건부 렌더링
  const is2dImg = img => /^\/2d\/[1-9]0?\.png$/.test(img);
  const hasMappedImg = rectsData.length > 0 && rectsData.some(r => !is2dImg(r.img));

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
        marginTop: 240,
      }}>
        {/* 레일 (위쪽) */}
        <div
          style={{
            position: 'fixed',
            left: 0,
            top: '240px',
            width: '100vw',
            height: 54,
            backgroundImage: "url('/2d/zip.png')",
            backgroundRepeat: 'repeat-x',
            backgroundSize: 'auto 54px',
            zIndex: 0,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        />
        {/* 사각형들 */}
        {springs.map((spring, i) => {
          // 중앙 인덱스 계산
          const centerIdx = Math.floor(rects / 2);
          const isCenter = activeRect === i;
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
                top: 0, // ziphe.png와 스냅
                willChange: 'transform',
                transformOrigin: '50% 0%', // 위쪽 피봇
                cursor: 'pointer',
                userSelect: 'none',
                ...(isCenter ? { transform: `${spring.transform ? spring.transform : ''} scale(1.5)` } : {}),
              }}
              onClick={() => handleRectClick(i)}
              tabIndex={0}
              role="button"
              aria-label={`closie station ${i + 1}`}
              title={rectsData[i]?.desc}
            >
              <img
                src="/2d/ziphe.png"
                alt="집게"
                style={{
                  position: 'absolute',
                  top: 0,
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
                src={rectsData[i]?.img}
                alt={rectsData[i]?.desc}
                style={{
                  width: rectsData[i]?.img === '/tri/t3.png' ? 120 : '100%',
                  height: rectsData[i]?.img === '/tri/t3.png' ? 120 : '100%',
                  objectFit: 'contain',
                  display: 'block',
                  marginTop: rectsData[i]?.img === '/tri/t3.png' ? 40 : 0,
                  ...(rectsData[i]?.img.includes('3.png') ? { transform: 'scale(2)' } : {}),
                }}
              />
              {/* map이 보이는 순간, b1 이미지 옆에 b1t 이미지 표시 */}
              {hasMappedImg && rectsData[i]?.img === '/basic/b1.png' && (
                <div style={{
                  position: 'absolute',
                  left: -280,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  zIndex: 20,
                }}>
                  <img
                    src="/1tag/b1t.png"
                    alt="b1t"
                    style={{
                      width: 160,
                      height: 160,
                      objectFit: 'contain',
                      display: 'block',
                    }}
                  />
                  <div style={{
                    color: '#fff',
                    fontSize: 15,
                    marginTop: 10,
                    textAlign: 'center',
                    fontWeight: 400,
                    textShadow: '0 2px 8px #000a',
                    maxWidth: 180,
                  }}>
                    베이직 라인 중 가장 인기가 많은 청자켓 시온!<br/>편하게 입기 최고인 상의
                  </div>
                </div>
              )}
              {/* 베이직 라인 각 선택지별 태그 이미지 */}
              {hasMappedImg && rectsData[i]?.img === '/basic/b2.png' && (
                <div style={{
                  position: 'absolute',
                  left: -280,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  zIndex: 20,
                }}>
                  <img
                    src="/1tag/22.png"
                    alt="22"
                    style={{
                      width: 160,
                      height: 160,
                      objectFit: 'contain',
                      display: 'block',
                    }}
                  />
                </div>
              )}
              {hasMappedImg && rectsData[i]?.img === '/basic/b3.png' && (
                <div style={{
                  position: 'absolute',
                  left: -280,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  zIndex: 20,
                }}>
                  <img
                    src="/1tag/33.png"
                    alt="33"
                    style={{
                      width: 160,
                      height: 160,
                      objectFit: 'contain',
                      display: 'block',
                    }}
                  />
                </div>
              )}
              {hasMappedImg && rectsData[i]?.img === '/basic/b4.png' && (
                <div style={{
                  position: 'absolute',
                  left: -280,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  zIndex: 20,
                }}>
                  <img
                    src="/1tag/44.png"
                    alt="44"
                    style={{
                      width: 160,
                      height: 160,
                      objectFit: 'contain',
                      display: 'block',
                    }}
                  />
                </div>
              )}
              {/* 여행용 단기 각 선택지별 태그 이미지 */}
              {hasMappedImg && rectsData[i]?.img === '/tri/t1.png' && (
                <div style={{
                  position: 'absolute',
                  left: -280,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  zIndex: 20,
                }}>
                  <img
                    src="/1tag/bo1.png"
                    alt="bo1"
                    style={{
                      width: 160,
                      height: 160,
                      objectFit: 'contain',
                      display: 'block',
                    }}
                  />
                </div>
              )}
              {hasMappedImg && rectsData[i]?.img === '/tri/t2.png' && (
                <div style={{
                  position: 'absolute',
                  left: -280,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  zIndex: 20,
                }}>
                  <img
                    src="/1tag/bo2.png"
                    alt="bo2"
                    style={{
                      width: 160,
                      height: 160,
                      objectFit: 'contain',
                      display: 'block',
                    }}
                  />
                </div>
              )}
              {hasMappedImg && rectsData[i]?.img === '/tri/t3.png' && (
                <div style={{
                  position: 'absolute',
                  left: -280,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  zIndex: 20,
                }}>
                  <img
                    src="/1tag/bo3.png"
                    alt="bo3"
                    style={{
                      width: 160,
                      height: 160,
                      objectFit: 'contain',
                      display: 'block',
                    }}
                  />
                </div>
              )}
              {hasMappedImg && rectsData[i]?.img === '/tri/t4.png' && (
                <div style={{
                  position: 'absolute',
                  left: -280,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  zIndex: 20,
                }}>
                  <img
                    src="/1tag/bo4.png"
                    alt="bo4"
                    style={{
                      width: 160,
                      height: 160,
                      objectFit: 'contain',
                      display: 'block',
                    }}
                  />
                </div>
              )}
              {/* 새로운 도전 각 선택지별 태그 이미지 */}
              {hasMappedImg && rectsData[i]?.img === '/sp/s1.png' && (
                <div style={{
                  position: 'absolute',
                  left: -280,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  zIndex: 20,
                }}>
                  <img
                    src="/1tag/tt1.png"
                    alt="tt1"
                    style={{
                      width: 160,
                      height: 160,
                      objectFit: 'contain',
                      display: 'block',
                    }}
                  />
                </div>
              )}
              {hasMappedImg && rectsData[i]?.img === '/sp/s2.png' && (
                <div style={{
                  position: 'absolute',
                  left: -280,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  zIndex: 20,
                }}>
                  <img
                    src="/1tag/tt2.png"
                    alt="tt2"
                    style={{
                      width: 160,
                      height: 160,
                      objectFit: 'contain',
                      display: 'block',
                    }}
                  />
                </div>
              )}
              {hasMappedImg && rectsData[i]?.img === '/sp/s3.png' && (
                <div style={{
                  position: 'absolute',
                  left: -280,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  zIndex: 20,
                }}>
                  <img
                    src="/1tag/tt3.png"
                    alt="tt3"
                    style={{
                      width: 160,
                      height: 160,
                      objectFit: 'contain',
                      display: 'block',
                    }}
                  />
                </div>
              )}
              {hasMappedImg && rectsData[i]?.img === '/sp/s4.png' && (
                <div style={{
                  position: 'absolute',
                  left: -280,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  zIndex: 20,
                }}>
                  <img
                    src="/1tag/tt4.png"
                    alt="tt4"
                    style={{
                      width: 160,
                      height: 160,
                      objectFit: 'contain',
                      display: 'block',
                    }}
                  />
                </div>
              )}
              {/* 특수정장(포멀) 태그 이미지 */}
              {hasMappedImg && rectsData[i]?.img === '/basic/fo.png' && (
                <div style={{
                  position: 'absolute',
                  left: -280,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  zIndex: 20,
                }}>
                  <img
                    src="/1tag/foo.png"
                    alt="foo"
                    style={{
                      width: 160,
                      height: 160,
                      objectFit: 'contain',
                      display: 'block',
                    }}
                  />
                </div>
              )}
              {/* 계절특성 태그 이미지 */}
              {hasMappedImg && rectsData[i]?.img === '/wea/w1.png' && (
                <div style={{
                  position: 'absolute',
                  left: -280,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  zIndex: 20,
                }}>
                  <img
                    src="/1tag/c1.png"
                    alt="c1"
                    style={{
                      width: 160,
                      height: 160,
                      objectFit: 'contain',
                      display: 'block',
                    }}
                  />
                </div>
              )}
              {hasMappedImg && rectsData[i]?.img === '/wea/w2.png' && (
                <div style={{
                  position: 'absolute',
                  left: -280,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  zIndex: 20,
                }}>
                  <img
                    src="/1tag/c2.png"
                    alt="c2"
                    style={{
                      width: 160,
                      height: 160,
                      objectFit: 'contain',
                      display: 'block',
                    }}
                  />
                </div>
              )}
              {hasMappedImg && rectsData[i]?.img === '/wea/w3.png' && (
                <div style={{
                  position: 'absolute',
                  left: -280,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  zIndex: 20,
                }}>
                  <img
                    src="/1tag/c3.png"
                    alt="c3"
                    style={{
                      width: 160,
                      height: 160,
                      objectFit: 'contain',
                      display: 'block',
                    }}
                  />
                </div>
              )}
              {hasMappedImg && rectsData[i]?.img === '/wea/w4.png' && (
                <div style={{
                  position: 'absolute',
                  left: -280,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  zIndex: 20,
                }}>
                  <img
                    src="/1tag/c4.png"
                    alt="c4"
                    style={{
                      width: 160,
                      height: 160,
                      objectFit: 'contain',
                      display: 'block',
                    }}
                  />
                </div>
              )}
            </animated.div>
          );
        })}
        {/* 하단 거리 라벨 박스 (옷장이 3개 이상일 때만 표시) */}
        {rects > 2 ? (
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
        ) : null}
      </div>
      {/* map.png 고정 박스 */}
      {hasMappedImg && (
        <div style={{
          position: 'fixed',
          right: 340,
          top: 'calc(50% + 80px)',
          transform: 'translateY(-50%)',
          width: 300,
          height: 340,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          opacity: hasMappedImg ? 1 : 0,
          transition: 'opacity 0.4s',
          pointerEvents: hasMappedImg ? 'auto' : 'none',
        }}>
          <div style={{ position: 'relative', width: 300, height: 300 }}>
            <img src="/2d/map.png" alt="map" style={{ width: 300, height: 300, objectFit: 'cover' }} />
            {/* 핀 아이콘 */}
            <div style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-40%, -60%)',
              fontSize: 38,
              zIndex: 2,
              filter: 'drop-shadow(0 2px 8px #0006)',
            }}>📍</div>
          </div>
          {/* 스테이션 텍스트 (이미지 아래, 흰색) */}
          <div style={{
            color: '#fff',
            fontSize: 15,
            fontWeight: 400,
            marginTop: 10,
            textAlign: 'center',
            textShadow: '0 2px 8px #000a',
          }}>
            석관동 한예종 스테이션
          </div>
        </div>
      )}
      {/* 우측 하단 처음으로 돌아가기 버튼 */}
      <button
        onClick={() => window.location.reload()}
        style={{
          position: 'fixed',
          right: 40,
          bottom: 40,
          background: '#ff9800',
          color: '#fff',
          border: 'none',
          borderRadius: 32,
          padding: '14px 28px',
          fontSize: 16,
          fontWeight: 700,
          boxShadow: '0 4px 24px #ff980055',
          cursor: 'pointer',
          zIndex: 2000,
          letterSpacing: 1,
          transition: 'background 0.2s',
        }}
      >
        처음으로 돌아가기
      </button>
    </div>
  );
} 