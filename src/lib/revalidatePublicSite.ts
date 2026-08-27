import { revalidatePath } from "next/cache";

// Content edited in the admin panel (services, packages, branches, campaigns,
// testimonials, FAQs) can surface on almost any public page — the homepage,
// its own listing page, and the shared footer on every route. Statically
// prerendered pages need an explicit revalidation to pick it up, so we just
// bust the whole public site from the shared root layout down.
export function revalidatePublicSite(): void {
  revalidatePath("/", "layout");
}
