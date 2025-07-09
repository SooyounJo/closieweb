import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import MovingRects from '../components/MovingRects';

const ZOOM_LABELS = ['서울', '성북구', '석관동'];
const CATEGORIES = [
  { label: '계절의 특수성', rects: 2, options: ['봄', '여름', '가을', '겨울'] },
  { label: '새로운 도전', rects: 3, options: ['스트릿', '파격', '캐주얼', '빈티지'] },
  { label: '여행용 단기', rects: 2, options: ['도시', '자연', '활동적인', '휴양'] },
  { label: '특수정장', rects: 1, options: [] },
  { label: '베이직 라인', rects: 4, options: ['상의', '하의', '겉옷', '악세서리'] },
];

function ControlGuideModal({ onClose }) {
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
        fontSize: 15,
        fontWeight: 500,
        textAlign: 'center',
        boxShadow: '0 8px 32px #000a',
        maxWidth: 340,
        lineHeight: 1.7,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <div style={{ marginBottom: 14, fontSize: 30, lineHeight: 1 }}>ℹ️</div>
        <div style={{ marginBottom: 10, fontSize: 15, color: '#222', fontWeight: 700, letterSpacing: 0.2, lineHeight: 1.7 }}>
          슬라이더를 움직여 가깝고 먼 클로지를 다양하게 만나보고,<br />
          패치를 선택해 나와 더 잘 맞을 클로지를 만나보세요
        </div>
        <div style={{ fontSize: 15, color: '#666', marginBottom: 18, lineHeight: 1.7 }}>
          (서울 → 성북구 → 석관동, 카테고리별 분류)
        </div>
        <button
          onClick={onClose}
          style={{
            marginTop: 10,
            background: '#ff9800',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            padding: '12px 32px',
            fontSize: 17,
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

function RequireCategoryModal({ open, onClose }) {
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
        fontSize: 16,
        fontWeight: 700,
        textAlign: 'center',
        boxShadow: '0 8px 32px #000a',
        maxWidth: 340,
        lineHeight: 1.7,
      }}>
        카테고리를 선택하면<br />나와 더 맞는 클로지를 고를 수 있어요!
        <button
          onClick={onClose}
          style={{
            marginTop: 28,
            background: '#ff9800',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            padding: '12px 32px',
            fontSize: 17,
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

function PointGuideModal({ open, onClose }) {
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
        <div style={{ marginBottom: 18 }}>
          <img src="/point.png" alt="슬라이더 포인트" style={{ width: 80, height: 80, filter: 'drop-shadow(0 0 16px #ff9800)', animation: 'glow 1.2s infinite alternate' }} />
        </div>
        <div style={{ marginBottom: 16, fontWeight: 700, fontSize: 18, color: '#ff9800' }}>
          이 버튼을 눌러 움직여보세요!
        </div>
        <div style={{ fontSize: 15, color: '#444', marginBottom: 18 }}>
          슬라이더를 좌우로 움직이면<br/>가깝고 먼 클로지를 다양하게 만날 수 있어요.
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
      <style>{`
        @keyframes glow {
          0% { filter: drop-shadow(0 0 0px #ff9800); }
          100% { filter: drop-shadow(0 0 32px #ff9800); }
        }
      `}</style>
    </div>
  );
}

// 1. 슬라이더 문구 위치/방향 변경 및 안내 추가
// 2. 슬라이더/지퍼 크기 확대
// 3. 옷장 영역 드래그로도 zoomLevel 조정

// 상단 zip.png 위에서 point.png를 드래그해 zoomLevel을 조절하는 컴포넌트
function SliderPoint({ zipWidth, zoomLevel, setZoomLevel }) {
  const min = 0, max = 1;
  const [dragging, setDragging] = React.useState(false);
  const getLeft = (level) => {
    const margin = 60;
    const usable = zipWidth - margin * 2;
    return margin + usable * level;
  };
  const onDown = (e) => {
    setDragging(true);
    document.body.style.userSelect = 'none';
  };
  const onMove = (e) => {
    if (!dragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const margin = 60;
    const usable = zipWidth - margin * 2;
    let x = clientX - margin;
    x = Math.max(0, Math.min(usable, x));
    const level = x / usable;
    setZoomLevel(level);
  };
  const onUp = () => {
    setDragging(false);
    document.body.style.userSelect = '';
  };
  React.useEffect(() => {
    if (!dragging) return;
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onUp);
    };
  }, [dragging]);
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: 180, zIndex: 99999, pointerEvents: 'none' }}>
      {/* 지퍼 크기 확대 */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: 60, background: "url('/2d/zip.png') repeat-x center center / auto 60px", zIndex: 100 }} />
      {/* 슬라이더 포인트(버튼) 크기 확대 */}
      <img
        src="/point.png"
        alt="슬라이더 포인트"
        style={{
          position: 'absolute',
          top: 8,
          left: getLeft(zoomLevel) - 80,
          width: 160,
          height: 160,
          zIndex: 99999,
          cursor: 'grab',
          pointerEvents: 'auto',
          userSelect: 'none',
          transition: dragging ? 'none' : 'left 0.2s',
        }}
        onMouseDown={onDown}
        onTouchStart={onDown}
        draggable={false}
      />
    </div>
  );
}

// 옷장 영역 드래그로도 zoomLevel 조정
function WardrobeDraggableArea({ children, setZoomLevel, windowWidth }) {
  const dragging = React.useRef(false);
  const startX = React.useRef(0);
  const lastZoom = React.useRef(0);
  const onDown = (e) => {
    dragging.current = true;
    startX.current = e.touches ? e.touches[0].clientX : e.clientX;
    lastZoom.current = null;
    document.body.style.userSelect = 'none';
  };
  const onMove = (e) => {
    if (!dragging.current) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const dx = clientX - startX.current;
    let newZoom = (dx / windowWidth) + (lastZoom.current ?? 0.5);
    newZoom = Math.max(0, Math.min(1, newZoom));
    setZoomLevel(newZoom);
    lastZoom.current = newZoom;
  };
  const onUp = () => {
    dragging.current = false;
    document.body.style.userSelect = '';
  };
  React.useEffect(() => {
    if (!dragging.current) return;
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onUp);
    };
  }, []);
  return (
    <div
      style={{ width: '100vw', height: '100vh', position: 'relative', zIndex: 10 }}
      onMouseDown={onDown}
      onTouchStart={onDown}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const [zoomLevel, setZoomLevel] = useState(0);
  const [categoryIdx, setCategoryIdx] = useState(null); // null이면 zoomLevel 사용
  const [showGuide, setShowGuide] = useState(true);
  const router = useRouter();
  const [rectCountOverride, setRectCountOverride] = useState(null);
  const [showRequireCategory, setShowRequireCategory] = useState(false);
  const [subCategory, setSubCategory] = useState(null);
  const [zipX, setZipX] = useState(0);
  const dragging = useRef(false);
  const startX = useRef(0);
  const lastX = useRef(0);
  const [windowWidth, setWindowWidth] = useState(1200);
  const [fullImage, setFullImage] = useState(null);
  const [bgOrange, setBgOrange] = useState(false);
  const [showPointGuide, setShowPointGuide] = useState(true);

  const BU_IMAGES = [
    ['/new/comon.png'],
    ['/new/tr1.png', '/new/tr2.png'],
    ['/new/go1.png', '/new/go2.png'],
    ['/new/foma.png', '/new/foma2.png'],
  ];

  const handleWardrobeClick = () => {
    if (subCategory === null) return;
    const imgs = BU_IMAGES[subCategory];
    const img = subCategory === 0 ? imgs[0] : imgs[Math.floor(Math.random() * imgs.length)];
    setFullImage(img);
  };

  useEffect(() => {
    setBgOrange(subCategory === 0);
  }, [subCategory]);

  // 슬라이더로 zoom in/out
  const handleSlider = (e) => {
    setZoomLevel(Number(e.target.value));
    setCategoryIdx(null); // 슬라이더 조작 시 카테고리 해제
  };

  // 카테고리 선택 시 하위 옵션 표시
  const [subOptions, setSubOptions] = useState([]);
  const [subAnim, setSubAnim] = useState(false);
  const handleCategory = (idx) => {
    setCategoryIdx(idx);
    setSubOptions(CATEGORIES[idx].options || []);
    setSubAnim(false);
    setTimeout(() => setSubAnim(true), 10); // 애니메이션 트리거
  };

  // 사각형 개수 결정 (카테고리 미선택 시만)
  let rectCount = null;
  let showRegion = null;
  if (categoryIdx !== null) {
    rectCount = rectCountOverride ?? CATEGORIES[categoryIdx].rects;
    if (rectCount === 1) {
      showRegion = ZOOM_LABELS[Math.round(zoomLevel * 2)];
    }
  } else {
    // 좌측(zoomLevel=0)에서 옷장 최대, 우측(zoomLevel=1)에서 최소
    rectCount = Math.round(12 - zoomLevel * 11); // 0~1 -> 12~1
  }

  // 카테고리 변경 시 옷장 수 초기화
  useEffect(() => {
    setRectCountOverride(null);
  }, [categoryIdx]);

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('introSeen')) {
      window.location.replace('/intro');
    }
  }, []);

  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <>
      <Head>
        <title>Closiedesk</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <PointGuideModal open={showPointGuide} onClose={() => setShowPointGuide(false)} />
      {/* 상단 zip.png */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: 38, background: "url('/2d/zip.png') repeat-x center center / auto 38px", zIndex: 100 }} />
      {/* 슬라이더 포인트(버튼)만 zip.png 위에 표시 */}
      <SliderPoint zipWidth={windowWidth} zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} />
      <WardrobeDraggableArea setZoomLevel={setZoomLevel} windowWidth={windowWidth}>
        <div className="ipad-container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', background: bgOrange ? '#ff9800' : 'url(/back.png) center center / cover no-repeat', transition: 'background 0.3s' }}>
          {/* 우측 상단 고정 bu/1~4.png 이미지 버튼 */}
          <div style={{ position: 'fixed', top: 64, left: '50%', transform: 'translateX(-50%)', zIndex: 200, display: 'flex', gap: 32, pointerEvents: 'auto' }}>
            {[1,2,3,4].map((num, idx) => (
              <button
                key={num}
                onClick={() => {
                  handleCategory(idx);
                  setRectCountOverride([2, 2, 2, 2][idx]);
                  setSubCategory(idx);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  outline: 'none',
                  borderRadius: 0,
                  boxShadow: 'none', // 노란 박스 제거
                  transition: 'transform 0.18s, filter 0.18s',
                  position: 'relative',
                  top: idx === 3 ? -32 : 0,
                  filter: categoryIdx !== null && categoryIdx !== idx ? 'grayscale(100%) brightness(0.7)' : 'none',
                  transform: categoryIdx === idx ? 'scale(1.18)' : 'none',
                  zIndex: categoryIdx === idx ? 10 : 1,
                }}
                aria-label={`카테고리 ${idx+1}`}
                onMouseEnter={e => {
                  if (categoryIdx !== idx) {
                    e.currentTarget.style.transform = 'scale(1.08)';
                    e.currentTarget.style.filter = 'none';
                  }
                }}
                onMouseLeave={e => {
                  if (categoryIdx !== idx) {
                    e.currentTarget.style.transform = '';
                    e.currentTarget.style.filter = 'grayscale(100%) brightness(0.7)';
                  }
                }}
              >
                <img
                  src={`/bu/${num}.png`}
                  alt={`카테고리${idx+1}`}
                  style={{
                    width: 180,
                    height: 180,
                    objectFit: 'contain',
                    borderRadius: 0,
                    border: 'none',
                    background: 'none',
                    transition: 'transform 0.18s, filter 0.18s',
                    display: 'block',
                  }}
                />
              </button>
            ))}
          </div>
          <MovingRects
            zoomLevel={zoomLevel}
            rectCount={rectCount}
            subCategory={subCategory}
            onRequireCategory={subCategory === null ? () => setShowRequireCategory(true) : undefined}
            categoryLabel={categoryIdx !== null ? CATEGORIES[categoryIdx].label : undefined}
            onWardrobeClick={handleWardrobeClick}
          />
          <RequireCategoryModal open={showRequireCategory} onClose={() => setShowRequireCategory(false)} />
        </div>
      </WardrobeDraggableArea>
      {/* 하단 안내문구: 박스 없이 흰색 텍스트, 세 줄로 구성 */}
      <div style={{
        position: 'fixed',
        left: '50%',
        bottom: 24,
        transform: 'translateX(-50%)',
        fontSize: 14,
        lineHeight: 1.7,
        color: '#fff',
        fontWeight: 400,
        textAlign: 'center',
        zIndex: 9999,
        letterSpacing: 0.2,
        textShadow: '0 2px 8px #000a',
        whiteSpace: 'pre-line',
      }}>
        슬라이더를 움직여 가깝고 먼 클로지를 다양하게 만나보고, 패치를 선택해 나와 더 잘 맞을 클로지를 만나보세요
      </div>
      {/* 좌측 위, 우측 위 오렌지색 안내문구 */}
      <div style={{ position: 'fixed', top: 80, left: 32, color: '#ff9800', fontWeight: 'bold', fontSize: 22, zIndex: 300, textShadow: '0 2px 8px #fff8' }}>가까운 클로지</div>
      <div style={{ position: 'fixed', top: 80, right: 32, color: '#ff9800', fontWeight: 'bold', fontSize: 22, zIndex: 300, textShadow: '0 2px 8px #fff8' }}>먼 클로지까지 확인</div>
      {/* 옷장 클릭 시 전체화면 이미지 */}
      {fullImage && (
        <div style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '100vw',
          height: '100vh',
          background: '#000',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }} onClick={() => setFullImage(null)}>
          <img src={fullImage} alt="full" style={{ width: '100vw', height: '100vh', objectFit: 'cover', maxWidth: '100vw', maxHeight: '100vh' }} />
        </div>
      )}
    </>
  );
} 