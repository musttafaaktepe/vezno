import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getFaqById } from "@/lib/data/faqs";
import PageHeader from "../../_components/PageHeader";
import { cardClass, inputClass, labelClass, textareaClass } from "../../_components/ui";
import SubmitButton from "../../_components/SubmitButton";
import ConfirmSubmitButton from "../../_components/ConfirmSubmitButton";
import { deleteFaqAction, updateFaqAction } from "../actions";

export const metadata: Metadata = { title: "Soruyu Düzenle" };

export default async function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const faq = await getFaqById(id);
  if (!faq) notFound();

  return (
    <div>
      <PageHeader
        title="Soruyu Düzenle"
        action={
          <Link href="/admin/faqs" className="text-sm font-medium text-blue-700 hover:underline">
            ← Listeye Dön
          </Link>
        }
      />
      <form action={updateFaqAction} className={cardClass + " flex max-w-2xl flex-col gap-4"}>
        <input type="hidden" name="id" value={faq.id} />
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="question">
            Soru *
          </label>
          <input id="question" name="question" required defaultValue={faq.question} className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="answer">
            Cevap *
          </label>
          <textarea id="answer" name="answer" required rows={4} defaultValue={faq.answer} className={textareaClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="sortOrder">
            Sıra
          </label>
          <input
            id="sortOrder"
            name="sortOrder"
            type="number"
            defaultValue={faq.sortOrder}
            className={inputClass + " max-w-[140px]"}
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" name="active" defaultChecked={faq.active} className="h-4 w-4 rounded border-slate-300" />
          Sitede yayında (aktif)
        </label>
        <SubmitButton>Değişiklikleri Kaydet</SubmitButton>
      </form>

      <form action={deleteFaqAction} className="mt-4 max-w-2xl">
        <input type="hidden" name="id" value={faq.id} />
        <ConfirmSubmitButton confirmMessage="Bu soruyu silmek istediğinize emin misiniz?">
          Soruyu Sil
        </ConfirmSubmitButton>
      </form>
    </div>
  );
}
