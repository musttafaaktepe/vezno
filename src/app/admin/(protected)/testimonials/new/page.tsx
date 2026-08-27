import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "../../_components/PageHeader";
import { cardClass, inputClass, labelClass, selectClass, textareaClass } from "../../_components/ui";
import SubmitButton from "../../_components/SubmitButton";
import { createTestimonialAction } from "../actions";

export const metadata: Metadata = { title: "Yeni Yorum" };

export default function NewTestimonialPage() {
  return (
    <div>
      <PageHeader
        title="Yeni Yorum"
        action={
          <Link href="/admin/testimonials" className="text-sm font-medium text-blue-700 hover:underline">
            ← Listeye Dön
          </Link>
        }
      />
      <form action={createTestimonialAction} className={cardClass + " flex max-w-2xl flex-col gap-4"}>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="name">
              Ad Soyad *
            </label>
            <input id="name" name="name" required className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="city">
              Şehir
            </label>
            <input id="city" name="city" className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="vehicle">
              Araç
            </label>
            <input id="vehicle" name="vehicle" placeholder="Örn. 2020 Model Sedan" className={inputClass} />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="comment">
            Yorum *
          </label>
          <textarea id="comment" name="comment" required rows={3} className={textareaClass} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="rating">
              Puan
            </label>
            <select id="rating" name="rating" defaultValue={5} className={selectClass}>
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} Yıldız
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="sortOrder">
              Sıra
            </label>
            <input id="sortOrder" name="sortOrder" type="number" defaultValue={0} className={inputClass} />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" name="active" defaultChecked className="h-4 w-4 rounded border-slate-300" />
          Sitede yayında (aktif)
        </label>
        <SubmitButton>Yorumu Kaydet</SubmitButton>
      </form>
    </div>
  );
}
