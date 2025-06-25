import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import MovingRects from '../components/MovingRects';

const ZOOM_LABELS = ['서울', '성북구', '석관동'];
const CATEGORIES = [
  { label: '계절의 특수성', rects: 2, options: ['봄', '여름', '가을', '겨울'] },
  { label: '새로운 도전', rects: 3, options: ['스트릿', '포멀', '캐주얼', '빈티지'] },
  { label: '여행용 단기', rects: 2, options: ['비즈니스', '휴양지', '백패킹', '도심'] },
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

export default function Home() {
  const [zoomLevel, setZoomLevel] = useState(0);
  const [categoryIdx, setCategoryIdx] = useState(null); // null이면 zoomLevel 사용
  const [showGuide, setShowGuide] = useState(true);
  const router = useRouter();
  const [rectCountOverride, setRectCountOverride] = useState(null);
  const [showRequireCategory, setShowRequireCategory] = useState(false);
  const [subCategory, setSubCategory] = useState(null);

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

  return (
    <>
      <Head>
        <title>Closiedesk</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div>
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
        {/* 상단 줌 슬라이더 바 (오른쪽 상단) */}
        <div style={{
          position: 'fixed',
          top: 24,
          right: 32,
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          pointerEvents: 'none',
        }}>
          <div style={{
            background: 'rgba(30,30,30,0.95)',
            borderRadius: 16,
            padding: '18px 32px 12px 32px',
            boxShadow: '0 2px 16px #000a',
            display: 'flex',
            alignItems: 'center',
            pointerEvents: 'auto',
            marginBottom: 12,
          }}>
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
          {/* 카테고리 버튼 */}
          <div style={{ display: 'flex', gap: 8, pointerEvents: 'auto' }}>
            {CATEGORIES.map((cat, idx) => (
              <button
                key={cat.label}
                onClick={() => handleCategory(idx)}
                style={{
                  background: categoryIdx === idx ? '#4faaff' : '#222',
                  color: categoryIdx === idx ? '#fff' : '#bbb',
                  border: 'none',
                  borderRadius: 8,
                  padding: '8px 16px',
                  fontWeight: 'bold',
                  fontSize: 15,
                  cursor: 'pointer',
                  boxShadow: categoryIdx === idx ? '0 2px 8px #4faaff88' : 'none',
                  transition: 'all 0.2s',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
          {/* 하위 옵션 버튼 애니메이션 */}
          {subOptions.length > 0 && (
            <div style={{
              display: 'flex',
              gap: 12,
              marginTop: 18,
              justifyContent: 'center',
              opacity: subAnim ? 1 : 0,
              transform: subAnim ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.4s, transform 0.4s',
              pointerEvents: 'auto',
            }}>
              {subOptions.map((opt, i) => (
                <button
                  key={opt}
                  onClick={() => {
                    setSubCategory(opt);
                    if (rectCount > 1) {
                      setRectCountOverride(prev => {
                        const current = prev ?? rectCount;
                        return Math.max(1, Math.floor(current / 2));
                      });
                    }
                  }}
                  style={{
                    background: '#ff9800',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 12,
                    padding: '10px 28px',
                    fontWeight: 'bold',
                    fontSize: 16,
                    boxShadow: '0 2px 8px #ff980055',
                    cursor: 'pointer',
                    letterSpacing: 1,
                    transition: 'background 0.2s',
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
        <MovingRects
          zoomLevel={zoomLevel}
          rectCount={rectCount}
          subCategory={rectCount === 1 ? subCategory : undefined}
          onRequireCategory={categoryIdx === null ? () => setShowRequireCategory(true) : undefined}
        />
        <RequireCategoryModal open={showRequireCategory} onClose={() => setShowRequireCategory(false)} />
        {/* 옷장이 1개만 남았을 때 하단에 지역명 표시 */}
        {showRegion && (
          <div style={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 24,
            textAlign: 'center',
            color: '#fff',
            fontSize: 20,
            fontWeight: 'bold',
            textShadow: '0 2px 8px #000a',
            zIndex: 50,
            letterSpacing: 2,
          }}>
            {showRegion} 지역 옷장
          </div>
        )}
        {showGuide && <ControlGuideModal onClose={() => setShowGuide(false)} />}
      </div>
      <style jsx global>{`
        .closie-slider {
          accent-color: #4faaff;
        }
        .closie-slider::-webkit-slider-thumb {
          background: #4faaff;
          border: 3px solid #fff;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          box-shadow: 0 2px 8px #4faaff55;
          cursor: pointer;
          -webkit-appearance: none;
          appearance: none;
        }
        .closie-slider::-webkit-slider-runnable-track {
          background: #ff9800;
          height: 10px;
          border-radius: 8px;
        }
        .closie-slider::-moz-range-thumb {
          background: #4faaff;
          border: 3px solid #fff;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          box-shadow: 0 2px 8px #4faaff55;
          cursor: pointer;
        }
        .closie-slider::-moz-range-track {
          background: #ff9800;
          height: 10px;
          border-radius: 8px;
        }
        .closie-slider::-ms-thumb {
          background: #4faaff;
          border: 3px solid #fff;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          box-shadow: 0 2px 8px #4faaff55;
          cursor: pointer;
        }
        .closie-slider::-ms-fill-lower,
        .closie-slider::-ms-fill-upper {
          background: #ff9800;
          border-radius: 8px;
        }
        .closie-slider:focus {
          outline: none;
        }
      `}</style>
    </>
  );
} 