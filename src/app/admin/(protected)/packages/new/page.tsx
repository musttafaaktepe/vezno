import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "../../_components/PageHeader";
import { cardClass, inputClass, labelClass, textareaClass } from "../../_components/ui";
import SubmitButton from "../../_components/SubmitButton";
import { createPackageAction } from "../actions";

export const metadata: Metadata = { title: "Yeni Paket" };

export default function NewPackagePage() {
  return (
    <div>
      <PageHeader
        title="Yeni Paket"
        action={
          <Link href="/admin/packages" className="text-sm font-medium text-blue-700 hover:underline">
            ← Listeye Dön
          </Link>
        }
      />
      <form action={createPackageAction} className={cardClass + " flex max-w-2xl flex-col gap-4"}>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="name">
            Paket Adı *
          </label>
          <input id="name" name="name" required className={inputClass} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="price">
              Fiyat (₺) *
            </label>
            <input id="price" name="price" type="number" min={0} required className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="duration">
              Süre
            </label>
            <input id="duration" name="duration" placeholder="Örn. 60 dakika" className={inputClass} />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="description">
            Açıklama *
          </label>
          <textarea id="description" name="description" required rows={3} className={textareaClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="features">
            Özellikler (her satıra bir madde)
          </label>
          <textarea
            id="features"
            name="features"
            rows={5}
            placeholder={"Motor performans testi\nBoya & kaporta kontrolü\nPDF rapor"}
            className={textareaClass}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="sortOrder">
              Sıra
            </label>
            <input id="sortOrder" name="sortOrder" type="number" defaultValue={0} className={inputClass} />
          </div>
          <label className="flex items-center gap-2 self-end pb-2.5 text-sm text-slate-700">
            <input type="checkbox" name="highlighted" className="h-4 w-4 rounded border-slate-300" />
            Öne çıkan paket (&quot;En Popüler&quot;)
          </label>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" name="active" defaultChecked className="h-4 w-4 rounded border-slate-300" />
          Sitede yayında (aktif)
        </label>
        <SubmitButton>Paketi Kaydet</SubmitButton>
      </form>
    </div>
  );
}
