type TricolorBarProps = {
  height?: number;
  className?: string;
};

export function TricolorBar({ height = 4, className = "" }: TricolorBarProps) {
  return (
    <div
      className={`flex w-full ${className}`}
      style={{ height }}
      aria-hidden="true"
    >
      <span className="flex-1 bg-navy" />
      <span className="flex-1 bg-white" />
      <span className="flex-1 bg-red" />
    </div>
  );
}
