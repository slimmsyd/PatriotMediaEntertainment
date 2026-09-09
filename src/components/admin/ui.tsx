import Link from "next/link";

/** Shared admin styling. Deliberately plain: the client edits, not admires. */

export function PageHeading({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="m-0 text-[26px] leading-tight font-medium tracking-[-0.02em]">
          {title}
        </h1>
        {description && (
          <p className="mt-2 mb-0 max-w-[60ch] text-[14px] text-white/60">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export const inputClass =
  "w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-[14px] text-white outline-none transition placeholder:text-white/30 focus:border-white/45 focus:bg-white/10";

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-medium tracking-[0.08em] text-white/70 uppercase">
        {label}
      </span>
      {children}
      {hint && !error && (
        <span className="mt-1.5 block text-[12px] text-white/40">{hint}</span>
      )}
      {error && (
        <span role="alert" className="mt-1.5 block text-[12px] text-[#ff8080]">
          {error}
        </span>
      )}
    </label>
  );
}

export function PrimaryButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`rounded-full bg-white px-6 py-3 text-[13px] font-medium tracking-[0.08em] text-black uppercase transition hover:bg-white/85 disabled:cursor-not-allowed disabled:opacity-50 ${props.className ?? ""}`}
    >
      {children}
    </button>
  );
}

export function SecondaryLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group rounded-full border border-white/20 px-5 py-2.5 transition hover:border-white/45"
    >
      <span className="text-[13px] text-white/75 transition group-hover:text-white">
        {children}
      </span>
    </Link>
  );
}

export function Banner({
  tone = "info",
  children,
}: {
  tone?: "info" | "error" | "success";
  children: React.ReactNode;
}) {
  const tones = {
    info: "border-white/15 bg-white/5 text-white/70",
    error: "border-[#ff8080]/40 bg-[#ff8080]/10 text-[#ffb3b3]",
    success: "border-[#7bd88f]/40 bg-[#7bd88f]/10 text-[#a9e8b8]",
  } as const;
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`mb-6 rounded-lg border px-4 py-3 text-[13px] ${tones[tone]}`}
    >
      {children}
    </div>
  );
}
