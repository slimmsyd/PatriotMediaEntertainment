import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getEvent } from "@/lib/cms/queries";
import { EventForm } from "@/components/admin/EventForm";
import { PageHeading } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Edit event" };
export const dynamic = "force-dynamic";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const event = await getEvent(id).catch((error) => {
    console.error("[admin] could not load event:", error);
    return null;
  });
  if (!event) notFound();

  return (
    <>
      <PageHeading
        title="Edit event"
        description="Changes go live on your site as soon as you save."
      />
      <EventForm event={event} />
    </>
  );
}
