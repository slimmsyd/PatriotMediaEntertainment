type ImagePlaceholderProps = {
  id: string;
  label: string;
  className?: string;
  rounded?: string;
};

export function ImagePlaceholder({
  id,
  label,
  className = "",
  rounded = "rounded-none",
}: ImagePlaceholderProps) {
  return (
    <div
      data-slot={id}
      className={`absolute inset-0 flex items-center justify-center bg-line-light ${rounded} ${className}`}
      role="img"
      aria-label={label}
    >
      <span className="max-w-[80%] text-center text-sm font-medium tracking-wide text-muted px-4">
        {label}
      </span>
    </div>
  );
}
