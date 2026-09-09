/**
 * Shared shape for admin form results. Lives outside the "use server" module
 * because a server-action file may only export async functions.
 */
export type FormState = {
  status: "idle" | "error" | "saved";
  message?: string;
  /** Keyed by dotted field path, e.g. "detail.1" or "marketMarkers.0.label". */
  errors?: Record<string, string>;
};

export const emptyFormState: FormState = { status: "idle" };
