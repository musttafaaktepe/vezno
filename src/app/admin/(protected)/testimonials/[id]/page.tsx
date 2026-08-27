import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTestimonialById } from "@/lib/data/testimonials";
import PageHeader from "../../_components/PageHeader";
import { cardClass, inputClass, labelClass, selectClass, textareaClass } from "../../_components/ui";
import SubmitButton from "../../_components/SubmitButton";
import ConfirmSubmitButton from "../../_components/ConfirmSubmitButton";
import { deleteTestimonialAction, updateTestimonialAction } from "../actions";

export const metadata: Metadata = { title: "Yorumu Düzenle" };

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const testimonial = await getTestimonialById(id);
  if (!testimonial) notFound();

  return (
    <div>
      <PageHeader
        title="Yorumu Düzenle"
        action={
          <Link href="/admin/testimonials" className="text-sm font-medium text-blue-700 hover:underline">
            ← Listeye Dön
          </Link>
        }
      />
      <form action={updateTestimonialAction} className={cardClass + " flex max-w-2xl flex-col gap-4"}>
        <input type="hidden" name="id" value={testimonial.id} />
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="name">
              Ad Soyad *
            </label>
            <input id="name" name="name" required defaultValue={testimonial.name} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="city">
              Şehir
            </label>
            <input id="city" name="city" defaultValue={testimonial.city ?? ""} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="vehicle">
              Araç
            </label>
            <input id="vehicle" name="vehicle" defaultValue={testimonial.vehicle ?? ""} className={inputClass} />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="comment">
            Yorum *
          </label>
          <textarea
            id="comment"
            name="comment"
            required
            rows={3}
            defaultValue={testimonial.comment}
            className={textareaClass}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="rating">
              Puan
            </label>
            <select id="rating" name="rating" defaultValue={testimonial.rating} className={selectClass}>
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
            <input
              id="sortOrder"
              name="sortOrder"
              type="number"
              defaultValue={testimonial.sortOrder}
              className={inputClass}
            />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            name="active"
            defaultChecked={testimonial.active}
            className="h-4 w-4 rounded border-slate-300"
          />
          Sitede yayında (aktif)
        </label>
        <SubmitButton>Değişiklikleri Kaydet</SubmitButton>
      </form>

      <form action={deleteTestimonialAction} className="mt-4 max-w-2xl">
        <input type="hidden" name="id" value={testimonial.id} />
        <ConfirmSubmitButton confirmMessage={`"${testimonial.name}" yorumunu silmek istediğinize emin misiniz?`}>
          Yorumu Sil
        </ConfirmSubmitButton>
      </form>
    </div>
  );
}
