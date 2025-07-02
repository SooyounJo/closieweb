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
          상단 바를 드래그(터치/마우스)하거나<br />
          카테고리를 선택해 나와 더 잘 맞을 클로지를 만나보세요
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

// 상단 zip.png 위에서 point.png를 드래그해 zoomLevel을 조절하는 컴포넌트
function SliderPoint({ zipWidth, zoomLevel, setZoomLevel }) {
  // 슬라이더 구간: 0~2 (3단계)
  const min = 0, max = 2;
  const [dragging, setDragging] = React.useState(false);
  // 슬라이더 위치 계산
  const getLeft = (level) => {
    const margin = 60; // zip.png 양 끝 여백
    const usable = zipWidth - margin * 2;
    return margin + (usable / (max - min)) * level;
  };
  // 드래그 핸들러
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
    const level = Math.round((x / usable) * (max - min));
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
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: 54, zIndex: 150, pointerEvents: 'none' }}>
      <img
        src="/point.png"
        alt="슬라이더 포인트"
        style={{
          position: 'absolute',
          top: 0,
          left: getLeft(zoomLevel),
          width: 54,
          height: 54,
          transform: 'translateY(-30%)',
          zIndex: 151,
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
    // 옷장이 1개만 남았을 때 지역명 표시
    if (rectCount === 1) {
      // zoomLevel에 따라 지역명 결정 (ZOOM_LABELS와 동일)
      showRegion = ZOOM_LABELS[zoomLevel];
    }
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
      {/* 상단 zip.png */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: 54, background: "url('/2d/zip.png') repeat-x center center / auto 54px", zIndex: 100 }} />
      {/* 상단 중앙 슬라이더 */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: 54, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 101, pointerEvents: 'none' }}>
        <div style={{ background: 'rgba(30,30,30,0.95)', borderRadius: 16, padding: '8px 24px', boxShadow: '0 2px 16px #000a', display: 'flex', alignItems: 'center', pointerEvents: 'auto' }}>
          <input
            type="range"
            min={0}
            max={2}
            step={1}
            value={zoomLevel}
            onChange={handleSlider}
            style={{ width: 320, marginRight: 18, background: 'transparent' }}
            className="closie-slider"
          />
          <span style={{ color: '#fff', fontWeight: 'bold', fontSize: 20, marginRight: 8 }}>
            {ZOOM_LABELS[zoomLevel]}
          </span>
          <span style={{ color: '#aaa', fontSize: 15 }}>
            {['도시', '구', '동'][zoomLevel]}
          </span>
        </div>
      </div>
      <div className="ipad-container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', background: 'url(/back.png) center center / cover no-repeat' }}>
        {/* 상단 뒤로 가기 버튼 */}
        <button
          onClick={() => router.push('/intro')}
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
        {/* 우측 상단 고정 bu/1~4.png 이미지 버튼 */}
        <div style={{ position: 'fixed', top: 64, right: 32, zIndex: 200, display: 'flex', gap: 32, pointerEvents: 'auto' }}>
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
                boxShadow: 'none',
                transition: 'none',
              }}
              aria-label={`카테고리 ${idx+1}`}
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
                  transition: 'none',
                  display: 'block',
                }}
              />
            </button>
          ))}
        </div>
        <MovingRects
          zoomLevel={zoomLevel}
          rectCount={rectCount}
          subCategory={rectCount === 1 ? subCategory : undefined}
          onRequireCategory={categoryIdx === null ? () => setShowRequireCategory(true) : undefined}
          categoryLabel={categoryIdx !== null ? CATEGORIES[categoryIdx].label : undefined}
        />
        <RequireCategoryModal open={showRequireCategory} onClose={() => setShowRequireCategory(false)} />
      </div>
      {/* 하단 안내문구: 박스 없이 흰색 텍스트, 세 줄로 구성 */}
      <div style={{
        position: 'fixed',
        left: '50%',
        bottom: 40,
        transform: 'translateX(-50%)',
        fontSize: 20,
        lineHeight: 1.7,
        color: '#fff',
        fontWeight: 600,
        textAlign: 'center',
        zIndex: 9999,
        letterSpacing: 0.2,
        textShadow: '0 2px 8px #000a',
        whiteSpace: 'pre-line',
      }}>
        상단 바를 드래그(터치/마우스)하거나{`\n`}
        카테고리를 선택해 나와 더 잘 맞을 클로지를 만나보세요{`\n`}
        <span style={{ fontSize: 15, color: '#fff', opacity: 0.7 }}>(서울 → 성북구 → 석관동, 카테고리별 분류)</span>
      </div>
      {/* 좌측 위, 우측 위 오렌지색 안내문구 */}
      <div style={{ position: 'fixed', top: 16, left: 32, color: '#ff9800', fontWeight: 'bold', fontSize: 22, zIndex: 300, textShadow: '0 2px 8px #fff8' }}>먼 클로지까지 확인</div>
      <div style={{ position: 'fixed', top: 16, right: 32, color: '#ff9800', fontWeight: 'bold', fontSize: 22, zIndex: 300, textShadow: '0 2px 8px #fff8' }}>가까운 클로지</div>
    </>
  );
} 