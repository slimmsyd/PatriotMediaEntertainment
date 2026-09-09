"use client";

import { ChipButton } from "@/components/ui/ChipButton";
import { donate as defaultDonate } from "@/lib/content-defaults";
import type { DonateCopyValue } from "@/lib/cms/schemas";
import { openDonate } from "./openDonate";

type DonateButtonProps = {
  className?: string;
  onClick?: () => void;
  copy?: DonateCopyValue;
};

export function DonateButton({
  className,
  onClick,
  copy = defaultDonate,
}: DonateButtonProps) {
  return (
    <ChipButton
      type="button"
      tone="red"
      ariaLabel={copy.ariaLabel}
      className={className}
      onClick={() => {
        onClick?.();
        openDonate();
      }}
    >
      {copy.label}
    </ChipButton>
  );
}
