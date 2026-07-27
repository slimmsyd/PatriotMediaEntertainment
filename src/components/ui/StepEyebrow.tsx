import { StepLineIcon } from "./icons";

type StepEyebrowProps = {
  label: string;
  className?: string;
  size?: "sm" | "md";
};

export function StepEyebrow({ label, className = "", size = "md" }: StepEyebrowProps) {
  const textSize = size === "sm" ? "text-[14px]" : "text-[15px]";
  return (
    <div
      className={`flex items-center gap-3.5 text-navy font-bold tracking-[0.02em] ${textSize} ${className}`}
    >
      <StepLineIcon className="shrink-0 text-navy" />
      <span>{label}</span>
    </div>
  );
}
