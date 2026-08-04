import { site } from "@/lib/content";
import { PinIcon } from "@/components/ui/icons";

export function ContactRail() {
  return (
    <aside className="flex flex-col gap-[clamp(28px,4vh,44px)]">
      <div className="flex gap-[18px]">
        <PinIcon className="mt-0.5 shrink-0 text-red" />
        <div>
          <h3 className="m-0 mb-1.5 text-[19px] font-bold text-near-black">
            Head Office
          </h3>
          <p className="m-0 text-[17px] leading-[1.55] text-muted">
            {site.addressLines.map((line, i) => (
              <span key={line}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </p>
        </div>
      </div>

      <div className="flex gap-[18px]">
        <PinIcon className="mt-0.5 shrink-0 text-navy" />
        <div>
          <h3 className="m-0 mb-1.5 text-[19px] font-bold text-near-black">
            Bookings line
          </h3>
          <p className="m-0 text-[17px] leading-[1.55] text-muted">
            {site.phone}
            <br />
            {site.bookingsHours}
          </p>
        </div>
      </div>
    </aside>
  );
}
