"use client";

import { ChipButton } from "@/components/ui/ChipButton";
import { donate } from "@/lib/content-defaults";
import { openDonate } from "./openDonate";

type DonateButtonProps = {
  className?: string;
  onClick?: () => void;
};

export function DonateButton({ className, onClick }: DonateButtonProps) {
  return (
    <ChipButton
      type="button"
      tone="red"
      ariaLabel={donate.ariaLabel}
      className={className}
      onClick={() => {
        onClick?.();
        openDonate();
      }}
    >
      {donate.label}
    </ChipButton>
  );
}
