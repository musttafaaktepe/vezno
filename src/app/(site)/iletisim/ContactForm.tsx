"use client";

import { useActionState, useRef, useEffect } from "react";
import { submitContactMessage, type ContactFormState } from "./actions";

const initialState: ContactFormState = {};

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactMessage, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  if (state.success) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <p className="text-base font-semibold text-emerald-800">Mesajınız iletildi ✅</p>
        <p className="mt-2 text-sm text-emerald-700">
          En kısa sürede sizinle iletişime geçeceğiz. Bizi tercih ettiğiniz için teşekkür ederiz.
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium text-slate-700">
            Ad Soyad *
          </label>
          <input id="name" name="name" required className={inputClass} placeholder="Adınız Soyadınız" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="text-sm font-medium text-slate-700">
            Telefon
          </label>
          <input id="phone" name="phone" className={inputClass} placeholder="05xx xxx xx xx" />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-slate-700">
          E-posta *
        </label>
        <input id="email" name="email" type="email" required className={inputClass} placeholder="ornek@eposta.com" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="subject" className="text-sm font-medium text-slate-700">
          Konu
        </label>
        <input id="subject" name="subject" className={inputClass} placeholder="Mesaj konusu" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-medium text-slate-700">
          Mesajınız *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className={inputClass + " resize-y"}
          placeholder="Size nasıl yardımcı olabiliriz?"
        />
      </div>
      {state.error && (
        <p className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="mt-1 inline-flex items-center justify-center rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:opacity-60"
      >
        {isPending ? "Gönderiliyor..." : "Mesajı Gönder"}
      </button>
    </form>
  );
}
