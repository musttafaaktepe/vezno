import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBranchById } from "@/lib/data/branches";
import PageHeader from "../../_components/PageHeader";
import { cardClass, inputClass, labelClass, textareaClass } from "../../_components/ui";
import SubmitButton from "../../_components/SubmitButton";
import ConfirmSubmitButton from "../../_components/ConfirmSubmitButton";
import { deleteBranchAction, updateBranchAction } from "../actions";

export const metadata: Metadata = { title: "Şubeyi Düzenle" };

export default async function EditBranchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const branch = getBranchById(id);
  if (!branch) notFound();

  return (
    <div>
      <PageHeader
        title="Şubeyi Düzenle"
        action={
          <Link href="/admin/branches" className="text-sm font-medium text-blue-700 hover:underline">
            ← Listeye Dön
          </Link>
        }
      />
      <form action={updateBranchAction} className={cardClass + " flex max-w-2xl flex-col gap-4"}>
        <input type="hidden" name="id" value={branch.id} />
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="name">
            Şube Adı *
          </label>
          <input id="name" name="name" required defaultValue={branch.name} className={inputClass} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="city">
              Şehir *
            </label>
            <input id="city" name="city" required defaultValue={branch.city} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="district">
              İlçe
            </label>
            <input id="district" name="district" defaultValue={branch.district ?? ""} className={inputClass} />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="address">
            Adres *
          </label>
          <textarea id="address" name="address" required rows={2} defaultValue={branch.address} className={textareaClass} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="phone">
              Telefon *
            </label>
            <input id="phone" name="phone" required defaultValue={branch.phone} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="workingHours">
              Çalışma Saatleri *
            </label>
            <input
              id="workingHours"
              name="workingHours"
              required
              defaultValue={branch.workingHours}
              className={inputClass}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="mapUrl">
            Google Haritalar Linki
          </label>
          <input id="mapUrl" name="mapUrl" defaultValue={branch.mapUrl ?? ""} className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="sortOrder">
            Sıra
          </label>
          <input
            id="sortOrder"
            name="sortOrder"
            type="number"
            defaultValue={branch.sortOrder}
            className={inputClass + " max-w-[140px]"}
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            name="active"
            defaultChecked={branch.active}
            className="h-4 w-4 rounded border-slate-300"
          />
          Sitede yayında (aktif)
        </label>
        <SubmitButton>Değişiklikleri Kaydet</SubmitButton>
      </form>

      <form action={deleteBranchAction} className="mt-4 max-w-2xl">
        <input type="hidden" name="id" value={branch.id} />
        <ConfirmSubmitButton confirmMessage={`"${branch.name}" şubesini silmek istediğinize emin misiniz?`}>
          Şubeyi Sil
        </ConfirmSubmitButton>
      </form>
    </div>
  );
}
