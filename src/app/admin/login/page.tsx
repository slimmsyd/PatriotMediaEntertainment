import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Log in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-[380px] flex-col justify-center">
      <p className="mb-2 text-[11px] font-medium tracking-[0.18em] text-white/50 uppercase">
        Patriot Entertainment
      </p>
      <h1 className="m-0 mb-8 text-[28px] leading-tight font-medium tracking-[-0.02em]">
        Sign in to edit your site
      </h1>
      <LoginForm next={next} />
    </div>
  );
}
