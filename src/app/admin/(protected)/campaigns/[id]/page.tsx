import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCampaignById } from "@/lib/data/campaigns";
import PageHeader from "../../_components/PageHeader";
import { cardClass, inputClass, labelClass, textareaClass } from "../../_components/ui";
import SubmitButton from "../../_components/SubmitButton";
import ConfirmSubmitButton from "../../_components/ConfirmSubmitButton";
import { deleteCampaignAction, updateCampaignAction } from "../actions";

export const metadata: Metadata = { title: "Kampanyayı Düzenle" };

export default async function EditCampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const campaign = getCampaignById(id);
  if (!campaign) notFound();

  return (
    <div>
      <PageHeader
        title="Kampanyayı Düzenle"
        action={
          <Link href="/admin/campaigns" className="text-sm font-medium text-blue-700 hover:underline">
            ← Listeye Dön
          </Link>
        }
      />
      <form action={updateCampaignAction} className={cardClass + " flex max-w-2xl flex-col gap-4"}>
        <input type="hidden" name="id" value={campaign.id} />
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="title">
            Başlık *
          </label>
          <input id="title" name="title" required defaultValue={campaign.title} className={inputClass} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="description">
            Açıklama *
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={3}
            defaultValue={campaign.description}
            className={textareaClass}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="badge">
              Etiket
            </label>
            <input id="badge" name="badge" defaultValue={campaign.badge ?? ""} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="validUntil">
              Son Geçerlilik Tarihi
            </label>
            <input
              id="validUntil"
              name="validUntil"
              type="date"
              defaultValue={campaign.validUntil ?? ""}
              className={inputClass}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="sortOrder">
            Sıra
          </label>
          <input
            id="sortOrder"
            name="sortOrder"
            type="number"
            defaultValue={campaign.sortOrder}
            className={inputClass + " max-w-[140px]"}
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            name="active"
            defaultChecked={campaign.active}
            className="h-4 w-4 rounded border-slate-300"
          />
          Sitede yayında (aktif)
        </label>
        <SubmitButton>Değişiklikleri Kaydet</SubmitButton>
      </form>

      <form action={deleteCampaignAction} className="mt-4 max-w-2xl">
        <input type="hidden" name="id" value={campaign.id} />
        <ConfirmSubmitButton confirmMessage={`"${campaign.title}" kampanyasını silmek istediğinize emin misiniz?`}>
          Kampanyayı Sil
        </ConfirmSubmitButton>
      </form>
    </div>
  );
}
