import type { Metadata } from "next";
import { listContactMessages } from "@/lib/data/contactMessages";
import PageHeader from "../_components/PageHeader";
import { cardClass } from "../_components/ui";
import ConfirmSubmitButton from "../_components/ConfirmSubmitButton";
import { deleteMessageAction, markMessageReadAction } from "./actions";

export const metadata: Metadata = { title: "Mesajlar" };

export default async function AdminMessagesPage() {
  const messages = await listContactMessages();

  return (
    <div>
      <PageHeader
        title="İletişim Mesajları"
        description={`${messages.length} mesaj, ${messages.filter((m) => !m.isRead).length} okunmamış.`}
      />

      <div className="flex flex-col gap-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`${cardClass} ${!m.isRead ? "border-blue-300 bg-blue-50/40" : ""}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {m.name}{" "}
                  {!m.isRead && (
                    <span className="ml-1 rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                      Yeni
                    </span>
                  )}
                </p>
                <p className="text-xs text-slate-500">
                  {m.email}
                  {m.phone ? ` · ${m.phone}` : ""} · {m.createdAt}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <form action={markMessageReadAction}>
                  <input type="hidden" name="id" value={m.id} />
                  <input type="hidden" name="isRead" value={m.isRead ? "false" : "true"} />
                  <button
                    type="submit"
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    {m.isRead ? "Okunmadı İşaretle" : "Okundu İşaretle"}
                  </button>
                </form>
                <form action={deleteMessageAction}>
                  <input type="hidden" name="id" value={m.id} />
                  <ConfirmSubmitButton
                    confirmMessage="Bu mesajı silmek istediğinize emin misiniz?"
                    className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
                  >
                    Sil
                  </ConfirmSubmitButton>
                </form>
              </div>
            </div>
            {m.subject && <p className="mt-3 text-sm font-medium text-slate-800">{m.subject}</p>}
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600">{m.message}</p>
          </div>
        ))}
        {messages.length === 0 && (
          <div className={cardClass + " text-center text-sm text-slate-500"}>
            Henüz mesaj bulunmuyor.
          </div>
        )}
      </div>
    </div>
  );
}
