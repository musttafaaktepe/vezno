"use server";

import { redirect } from "next/navigation";
import { getAdminUserByEmail } from "@/lib/data/adminUsers";
import { verifyPassword } from "@/lib/auth";
import { setAdminSession } from "@/lib/session";

export interface LoginState {
  error?: string;
}

export async function loginAction(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = formData.get("email")?.toString().trim() ?? "";
  const password = formData.get("password")?.toString() ?? "";

  if (!email || !password) {
    return { error: "E-posta ve şifre zorunludur." };
  }

  const user = getAdminUserByEmail(email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { error: "E-posta veya şifre hatalı." };
  }

  await setAdminSession({ sub: user.id, email: user.email, name: user.name });
  redirect("/admin");
}
