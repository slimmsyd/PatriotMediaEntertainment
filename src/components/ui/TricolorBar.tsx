type TricolorBarProps = {
  height?: number;
  width?: number | string;
  className?: string;
};

export function TricolorBar({
  height = 4,
  width = "100%",
  className = "",
}: TricolorBarProps) {
  return (
    <div
      className={`flex ${className}`}
      style={{ height, width }}
      aria-hidden="true"
    >
      <span className="flex-1 bg-navy" />
      <span className="flex-1 bg-white" />
      <span className="flex-1 bg-red" />
    </div>
  );
}
