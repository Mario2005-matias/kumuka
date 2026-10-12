const confettiColors = [
  'bg-primary',
  'bg-emerald-400',
  'bg-amber-400',
  'bg-sky-400',
  'bg-rose-400',
];

export function Confetti() {
  return (
    <div
      aria-hidden="true"
      className="flex h-10 items-center justify-center gap-3 overflow-hidden"
    >
      {confettiColors.map((color, index) => (
        <span
          className={`h-3 w-3 rounded-sm ${color}`}
          key={color}
          style={{ transform: `rotate(${index * 19 - 38}deg)` }}
        />
      ))}
      <span className="text-2xl">🎉</span>
      {confettiColors
        .slice()
        .reverse()
        .map((color, index) => (
          <span
            className={`h-3 w-3 rounded-sm ${color}`}
            key={`${color}-${index}`}
            style={{ transform: `rotate(${index * 19 + 30}deg)` }}
          />
        ))}
    </div>
  );
}