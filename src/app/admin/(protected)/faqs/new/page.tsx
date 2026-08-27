import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "../../_components/PageHeader";
import { cardClass, inputClass, labelClass, textareaClass } from "../../_components/ui";
import SubmitButton from "../../_components/SubmitButton";
import { createFaqAction } from "../actions";

export const metadata: Metadata = { title: "Yeni Soru" };

export default function NewFaqPage() {
  return (
    <div>
      <PageHeader
        title="Yeni Soru"
        action={
          <Link href="/admin/faqs" className="text-sm font-medium text-blue-700 hover:underline">
            ← Listeye Dön
          </Link>
        }
      />
      <form action={createFaqAction} className={cardClass + " flex max-w-2xl flex-col gap-4"}>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="question">
            Soru *
          </label>
          <input id="question" name="question" required className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="answer">
            Cevap *
          </label>
          <textarea id="answer" name="answer" required rows={4} className={textareaClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="sortOrder">
            Sıra
          </label>
          <input id="sortOrder" name="sortOrder" type="number" defaultValue={0} className={inputClass + " max-w-[140px]"} />
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" name="active" defaultChecked className="h-4 w-4 rounded border-slate-300" />
          Sitede yayında (aktif)
        </label>
        <SubmitButton>Soruyu Kaydet</SubmitButton>
      </form>
    </div>
  );
}
