import { LandingExperience } from "@/components/landing/LandingExperience";
import { getSiteContent } from "@/lib/cms/queries";

/**
 * Read the client's copy and events on every request. That is what makes a
 * save in /admin show up on the live site immediately, with no redeploy.
 */
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await getSiteContent();
  return <LandingExperience content={content} />;
}
