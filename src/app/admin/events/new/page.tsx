import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/require-admin";
import { EventForm } from "@/components/admin/EventForm";
import { PageHeading } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Add event" };
export const dynamic = "force-dynamic";

export default async function NewEventPage() {
  await requireAdmin();
  return (
    <>
      <PageHeading
        title="Add an event"
        description="It goes live on your site as soon as you save."
      />
      <EventForm />
    </>
  );
}
