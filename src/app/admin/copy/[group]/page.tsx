import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getCopyGroup } from "@/lib/cms/queries";
import { CopyForm } from "@/components/admin/CopyForm";
import { PageHeading, SecondaryLink } from "@/components/admin/ui";
import { COPY_GROUP_LABELS, isCopyGroupKey } from "@/lib/cms/schemas";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ group: string }>;
}): Promise<Metadata> {
  const { group } = await params;
  return {
    title: isCopyGroupKey(group) ? COPY_GROUP_LABELS[group].title : "Text",
  };
}

export default async function CopyGroupPage({
  params,
}: {
  params: Promise<{ group: string }>;
}) {
  await requireAdmin();
  const { group } = await params;
  if (!isCopyGroupKey(group)) notFound();

  const value = await getCopyGroup(group);

  return (
    <>
      <PageHeading
        title={COPY_GROUP_LABELS[group].title}
        description={COPY_GROUP_LABELS[group].blurb}
        action={<SecondaryLink href="/admin/copy">All sections</SecondaryLink>}
      />
      <CopyForm group={group} value={value} />
    </>
  );
}
