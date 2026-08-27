import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServiceById } from "@/lib/data/services";
import PageHeader from "../../_components/PageHeader";
import { cardClass, inputClass, labelClass, selectClass, textareaClass } from "../../_components/ui";
import SubmitButton from "../../_components/SubmitButton";
import ConfirmSubmitButton from "../../_components/ConfirmSubmitButton";
import { deleteServiceAction, updateServiceAction } from "../actions";
import { ICON_OPTIONS } from "../icons";

export const metadata: Metadata = { title: "Hizmeti Düzenle" };

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await getServiceById(id);
  if (!service) notFound();

  return (
    <div>
      <PageHeader
        title="Hizmeti Düzenle"
        action={
          <Link href="/admin/services" className="text-sm font-medium text-blue-700 hover:underline">
            ← Listeye Dön
          </Link>
        }
      />
      <form action={updateServiceAction} className={cardClass + " flex max-w-2xl flex-col gap-4"}>
        <input type="hidden" name="id" value={service.id} />
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="title">
            Başlık *
          </label>
          <input id="title" name="title" required defaultValue={service.title} className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="summary">
            Özet *
          </label>
          <textarea id="summary" name="summary" required rows={2} defaultValue={service.summary} className={textareaClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="description">
            Detaylı Açıklama *
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            defaultValue={service.description}
            className={textareaClass}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="icon">
              İkon
            </label>
            <select id="icon" name="icon" defaultValue={service.icon ?? ""} className={selectClass}>
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
            <input
              id="sortOrder"
              name="sortOrder"
              type="number"
              defaultValue={service.sortOrder}
              className={inputClass}
            />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            name="active"
            defaultChecked={service.active}
            className="h-4 w-4 rounded border-slate-300"
          />
          Sitede yayında (aktif)
        </label>
        <SubmitButton>Değişiklikleri Kaydet</SubmitButton>
      </form>

      <form action={deleteServiceAction} className="mt-4 max-w-2xl">
        <input type="hidden" name="id" value={service.id} />
        <ConfirmSubmitButton confirmMessage={`"${service.title}" hizmetini silmek istediğinize emin misiniz?`}>
          Hizmeti Sil
        </ConfirmSubmitButton>
      </form>
    </div>
  );
}
