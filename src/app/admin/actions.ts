"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";
import type { FormState } from "@/lib/cms/form-state";
import {
  createEvent,
  deleteEvent,
  moveEvent,
  updateEvent,
  upsertCopy,
} from "@/lib/cms/mutations";
import {
  copySchemas,
  eventInputSchema,
  fieldErrors,
  isCopyGroupKey,
} from "@/lib/cms/schemas";

/** The public pages are force-dynamic, so this is only for any cached shell. */
function refreshPublicPages() {
  revalidatePath("/");
  revalidatePath("/contact");
}

function readEventForm(formData: FormData) {
  const value = (name: string) => String(formData.get(name) ?? "");
  return {
    title: value("title"),
    eyebrow: value("eyebrow"),
    status: value("status"),
    eventDate: value("eventDate"),
    venue: value("venue"),
    description: value("description"),
    imageUrl: value("imageUrl"),
    imageAlt: value("imageAlt"),
    videoUrl: value("videoUrl"),
    posterUrl: value("posterUrl"),
    href: value("href"),
  };
}

export async function saveEvent(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const parsed = eventInputSchema.safeParse(readEventForm(formData));
  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the highlighted fields.",
      errors: fieldErrors(parsed.error),
    };
  }

  try {
    if (id) {
      const updated = await updateEvent(id, parsed.data);
      if (!updated) {
        return { status: "error", message: "That event no longer exists." };
      }
    } else {
      await createEvent(parsed.data);
    }
  } catch (error) {
    console.error("[admin] saving event failed:", error);
    return {
      status: "error",
      message: "Could not save. Try again in a moment.",
    };
  }

  refreshPublicPages();
  redirect("/admin/events?saved=1");
}

export async function removeEvent(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;
  await deleteEvent(id);
  refreshPublicPages();
  redirect("/admin/events?deleted=1");
}

export async function reorderEvent(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  const direction = String(formData.get("direction") ?? "");
  if (!id || (direction !== "up" && direction !== "down")) return;
  await moveEvent(id, direction);
  refreshPublicPages();
  redirect("/admin/events");
}

export async function saveCopy(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();

  const group = String(formData.get("group") ?? "");
  if (!isCopyGroupKey(group)) {
    return { status: "error", message: "Unknown section." };
  }

  // The form serialises its nested shape to JSON so repeatable lists survive
  // the round trip without inventing a bracket-notation encoding.
  let raw: unknown;
  try {
    raw = JSON.parse(String(formData.get("value") ?? "null"));
  } catch {
    return { status: "error", message: "Could not read the form." };
  }

  const parsed = copySchemas[group].safeParse(raw);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the highlighted fields.",
      errors: fieldErrors(parsed.error),
    };
  }

  try {
    await upsertCopy(group, parsed.data);
  } catch (error) {
    console.error("[admin] saving copy failed:", error);
    return {
      status: "error",
      message: "Could not save. Try again in a moment.",
    };
  }

  refreshPublicPages();
  return { status: "saved", message: "Saved. Your site is updated." };
}
