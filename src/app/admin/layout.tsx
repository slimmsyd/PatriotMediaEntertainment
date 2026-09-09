import type { Metadata } from "next";
import Link from "next/link";
import { getSession } from "@/lib/auth/require-admin";
import { logout } from "@/app/admin/login/actions";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-black text-white">
      {session && (
        <header className="sticky top-0 z-20 border-b border-white/10 bg-black/90 backdrop-blur">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-6 gap-y-3 px-6 py-4">
            <Link
              href="/admin/events"
              className="text-[11px] font-medium tracking-[0.18em] text-white uppercase"
            >
              Patriot Admin
            </Link>
            <nav className="flex items-center gap-5 text-[13px] text-white/70">
              <Link className="hover:text-white" href="/admin/events">
                Events
              </Link>
              <Link className="hover:text-white" href="/admin/copy">
                Text
              </Link>
              <Link className="hover:text-white" href="/" target="_blank">
                View site ↗
              </Link>
            </nav>
            <form action={logout} className="ml-auto">
              <button
                type="submit"
                className="rounded-full border border-white/20 px-4 py-2 text-[12px] text-white/70 transition hover:border-white/50 hover:text-white"
              >
                Log out
              </button>
            </form>
          </div>
        </header>
      )}
      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}
