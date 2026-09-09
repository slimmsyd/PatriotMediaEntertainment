import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";
import { PageHeading } from "@/components/admin/ui";
import { COPY_GROUP_KEYS, COPY_GROUP_LABELS } from "@/lib/cms/schemas";

export const metadata: Metadata = { title: "Text" };
export const dynamic = "force-dynamic";

export default async function CopyIndexPage() {
  await requireAdmin();

  return (
    <>
      <PageHeading
        title="Text on your site"
        description="Pick a section to reword it. The layout and design stay exactly as they are."
      />
      <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2">
        {COPY_GROUP_KEYS.map((key) => (
          <li key={key}>
            <Link
              href={`/admin/copy/${key}`}
              className="block h-full rounded-xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/30 hover:bg-white/[0.06]"
            >
              <p className="m-0 text-[15px] font-medium">
                {COPY_GROUP_LABELS[key].title}
              </p>
              <p className="m-0 mt-1.5 text-[13px] text-white/50">
                {COPY_GROUP_LABELS[key].blurb}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
