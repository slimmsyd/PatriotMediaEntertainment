import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";
import { listEvents } from "@/lib/cms/queries";
import { formatEventDate } from "@/lib/cms/derive";
import { removeEvent, reorderEvent } from "@/app/admin/actions";
import { Banner, PageHeading } from "@/components/admin/ui";
import type { EventRow } from "@/db/schema";

export const metadata: Metadata = { title: "Events" };
export const dynamic = "force-dynamic";

function EventCard({
  event,
  index,
  total,
}: {
  event: EventRow;
  index: number;
  total: number;
}) {
  return (
    <li className="flex flex-wrap items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <div className="relative h-[64px] w-[64px] shrink-0 overflow-hidden rounded-lg bg-white/5">
        {event.imageUrl || event.posterUrl ? (
          <Image
            src={(event.imageUrl ?? event.posterUrl)!}
            alt=""
            fill
            sizes="64px"
            className="object-cover"
            unoptimized={(event.imageUrl ?? event.posterUrl)!.startsWith("/")}
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-[11px] text-white/30">
            Video
          </span>
        )}
      </div>

      <div className="min-w-[180px] flex-1">
        <p className="m-0 text-[15px] font-medium">{event.title}</p>
        <p className="m-0 mt-1 text-[13px] text-white/50">
          {[formatEventDate(event.eventDate), event.venue]
            .filter(Boolean)
            .join(" · ") || "No date set"}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <form action={reorderEvent}>
          <input type="hidden" name="id" value={event.id} />
          <input type="hidden" name="direction" value="up" />
          <button
            type="submit"
            disabled={index === 0}
            aria-label={`Move ${event.title} up`}
            className="h-9 w-9 rounded-full border border-white/15 text-white/70 transition hover:border-white/40 hover:text-white disabled:opacity-25"
          >
            ↑
          </button>
        </form>
        <form action={reorderEvent}>
          <input type="hidden" name="id" value={event.id} />
          <input type="hidden" name="direction" value="down" />
          <button
            type="submit"
            disabled={index === total - 1}
            aria-label={`Move ${event.title} down`}
            className="h-9 w-9 rounded-full border border-white/15 text-white/70 transition hover:border-white/40 hover:text-white disabled:opacity-25"
          >
            ↓
          </button>
        </form>
        <Link
          href={`/admin/events/${event.id}`}
          className="rounded-full border border-white/20 px-4 py-2 text-[13px] text-white/80 transition hover:border-white/45 hover:text-white"
        >
          Edit
        </Link>
        <details className="relative">
          <summary className="cursor-pointer list-none rounded-full border border-white/10 px-4 py-2 text-[13px] text-white/45 transition hover:border-[#ff8080]/50 hover:text-[#ff8080]">
            Delete
          </summary>
          <div className="absolute right-0 z-10 mt-2 w-[240px] rounded-xl border border-white/15 bg-[#111] p-4 shadow-xl">
            <p className="m-0 mb-3 text-[13px] text-white/70">
              Delete “{event.title}” from the site?
            </p>
            <form action={removeEvent}>
              <input type="hidden" name="id" value={event.id} />
              <button
                type="submit"
                className="w-full rounded-full bg-[#ff8080] px-4 py-2 text-[13px] font-medium text-black transition hover:bg-[#ff9a9a]"
              >
                Yes, delete it
              </button>
            </form>
          </div>
        </details>
      </div>
    </li>
  );
}

function EventGroup({
  title,
  blurb,
  rows,
}: {
  title: string;
  blurb: string;
  rows: EventRow[];
}) {
  return (
    <section className="mb-10">
      <h2 className="m-0 text-[13px] font-medium tracking-[0.14em] text-white/50 uppercase">
        {title}
      </h2>
      <p className="mt-1.5 mb-4 text-[13px] text-white/40">{blurb}</p>
      {rows.length === 0 ? (
        <p className="m-0 rounded-xl border border-dashed border-white/15 px-4 py-6 text-center text-[13px] text-white/40">
          Nothing here yet.
        </p>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {rows.map((event, index) => (
            <EventCard
              key={event.id}
              event={event}
              index={index}
              total={rows.length}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

export default async function AdminEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string }>;
}) {
  await requireAdmin();
  const { saved, deleted } = await searchParams;

  let rows: EventRow[] = [];
  let loadError: string | null = null;
  try {
    rows = await listEvents();
  } catch (error) {
    console.error("[admin] could not list events:", error);
    loadError =
      "Could not reach the database. Your site is still up and showing its last saved content.";
  }

  const upcoming = rows.filter((row) => row.status === "upcoming");
  const past = rows.filter((row) => row.status === "past");

  return (
    <>
      <PageHeading
        title="Events"
        description="Add a new event, change the details of one you have already run, or reorder how they appear."
        action={
          <Link
            href="/admin/events/new"
            className="rounded-full bg-white px-6 py-3 text-[13px] font-medium tracking-[0.08em] text-black uppercase transition hover:bg-white/85"
          >
            Add event
          </Link>
        }
      />

      {loadError && <Banner tone="error">{loadError}</Banner>}
      {saved && <Banner tone="success">Saved. Your site is updated.</Banner>}
      {deleted && <Banner tone="success">That event has been removed.</Banner>}

      <EventGroup
        title="Upcoming"
        blurb="Shown in the events strip above the footer."
        rows={upcoming}
      />
      <EventGroup
        title="Past"
        blurb="Shown in the big scrolling rail near the top of the homepage."
        rows={past}
      />
    </>
  );
}
