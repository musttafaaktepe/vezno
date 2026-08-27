"use server";

import { redirect } from "next/navigation";
import { clearAdminSession } from "@/lib/session";

export async function logoutAction(): Promise<void> {
  await clearAdminSession();
  redirect("/admin/login");
}
