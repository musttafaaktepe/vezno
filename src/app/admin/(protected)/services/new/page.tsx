import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "../../_components/PageHeader";
import { cardClass, inputClass, labelClass, selectClass, textareaClass } from "../../_components/ui";
import SubmitButton from "../../_components/SubmitButton";
import { createServiceAction } from "../actions";
import { ICON_OPTIONS } from "../icons";

export const metadata: Metadata = { title: "Yeni Hizmet" };

export default function NewServicePage() {
  return (
    <div>
      <PageHeader
        title="Yeni Hizmet"
        action={
          <Link href="/admin/services" className="text-sm font-medium text-blue-700 hover:underline">
            ← Listeye Dön
          </Link>
        }
      />
      <form action={createServiceAction} className={cardClass + " flex max-w-2xl flex-col gap-4"}>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="title">
            Başlık *
          </label>
          <input id="title" name="title" required className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="summary">
            Özet *
          </label>
          <textarea id="summary" name="summary" required rows={2} className={textareaClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="description">
            Detaylı Açıklama *
          </label>
          <textarea id="description" name="description" required rows={4} className={textareaClass} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="icon">
              İkon
            </label>
            <select id="icon" name="icon" defaultValue="" className={selectClass}>
              <option value="">Varsayılan</option>
              {ICON_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
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
        <SubmitButton>Hizmeti Kaydet</SubmitButton>
      </form>
    </div>
  );
}
