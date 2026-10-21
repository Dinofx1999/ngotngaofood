import { useEffect, useRef, useState } from 'react';

// Slide ảnh trang chủ: tự chuyển, vuốt trên điện thoại, mũi tên và chấm tròn
export default function HeroSlider({ images, alt = '', interval = 4000 }) {
  const count = images.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(null);

  useEffect(() => setIndex(0), [count]);

  useEffect(() => {
    if (count < 2 || paused) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), interval);
    return () => clearInterval(id);
  }, [count, paused, interval]);

  if (count === 0) return null;

  const go = (i) => setIndex(((i % count) + count) % count);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    setPaused(true);
  };
  const onTouchEnd = (e) => {
    const start = touchStartX.current;
    touchStartX.current = null;
    setPaused(false);
    if (start === null) return;
    const delta = e.changedTouches[0].clientX - start;
    if (Math.abs(delta) > 40) go(index + (delta < 0 ? 1 : -1));
  };

  return (
    <div
      className="slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="slider-track" style={{ transform: `translateX(-${index * 100}%)` }}>
        {images.map((url, i) => (
          <img
            key={url + i}
            className="slider-img"
            src={url}
            alt={`${alt} ${i + 1}`}
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/placeholder.svg'; }}
          />
        ))}
      </div>

      {count > 1 && (
        <>
          <button type="button" className="slider-arrow prev" onClick={() => go(index - 1)} aria-label="Ảnh trước">‹</button>
          <button type="button" className="slider-arrow next" onClick={() => go(index + 1)} aria-label="Ảnh sau">›</button>
          <div className="slider-dots">
            {images.map((_, i) => (
              <button key={i} type="button" className={i === index ? 'active' : ''} onClick={() => go(i)} aria-label={`Ảnh ${i + 1}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
