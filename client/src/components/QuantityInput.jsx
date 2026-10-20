export default function QuantityInput({ value, onChange, min = 1, max = 99 }) {
  return (
    <div className="qty">
      <button type="button" onClick={() => onChange(value - 1)} disabled={value <= min} aria-label="Giảm">−</button>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => {
          const n = parseInt(e.target.value, 10);
          if (!Number.isNaN(n)) onChange(Math.max(min, Math.min(max, n)));
        }}
      />
      <button type="button" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Tăng">+</button>
    </div>
  );
}
