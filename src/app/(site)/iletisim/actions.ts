"use server";

import { createContactMessage } from "@/lib/data/contactMessages";

export interface ContactFormState {
  error?: string;
  success?: boolean;
}

export async function submitContactMessage(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const name = formData.get("name")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim() ?? "";
  const phone = formData.get("phone")?.toString().trim() ?? "";
  const subject = formData.get("subject")?.toString().trim() ?? "";
  const message = formData.get("message")?.toString().trim() ?? "";

  if (!name || !email || !message) {
    return { error: "Ad soyad, e-posta ve mesaj alanları zorunludur." };
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return { error: "Lütfen geçerli bir e-posta adresi girin." };
  }

  createContactMessage({ name, email, phone: phone || null, subject: subject || null, message });

  return { success: true };
}
