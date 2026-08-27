import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPackageById } from "@/lib/data/packages";
import PageHeader from "../../_components/PageHeader";
import { cardClass, inputClass, labelClass, textareaClass } from "../../_components/ui";
import SubmitButton from "../../_components/SubmitButton";
import ConfirmSubmitButton from "../../_components/ConfirmSubmitButton";
import { deletePackageAction, updatePackageAction } from "../actions";

export const metadata: Metadata = { title: "Paketi Düzenle" };

export default async function EditPackagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pkg = await getPackageById(id);
  if (!pkg) notFound();

  return (
    <div>
      <PageHeader
        title="Paketi Düzenle"
        action={
          <Link href="/admin/packages" className="text-sm font-medium text-blue-700 hover:underline">
            ← Listeye Dön
          </Link>
        }
      />
      <form action={updatePackageAction} className={cardClass + " flex max-w-2xl flex-col gap-4"}>
        <input type="hidden" name="id" value={pkg.id} />
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="name">
            Paket Adı *
          </label>
          <input id="name" name="name" required defaultValue={pkg.name} className={inputClass} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="price">
              Fiyat (₺) *
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min={0}
              required
              defaultValue={pkg.price}
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="duration">
              Süre
            </label>
            <input id="duration" name="duration" defaultValue={pkg.duration ?? ""} className={inputClass} />
          </div>
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
            defaultValue={pkg.description}
            className={textareaClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={labelClass} htmlFor="features">
            Özellikler (her satıra bir madde)
          </label>
          <textarea
            id="features"
            name="features"
            rows={5}
            defaultValue={pkg.features.join("\n")}
            className={textareaClass}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass} htmlFor="sortOrder">
              Sıra
            </label>
            <input
              id="sortOrder"
              name="sortOrder"
              type="number"
              defaultValue={pkg.sortOrder}
              className={inputClass}
            />
          </div>
          <label className="flex items-center gap-2 self-end pb-2.5 text-sm text-slate-700">
            <input
              type="checkbox"
              name="highlighted"
              defaultChecked={pkg.highlighted}
              className="h-4 w-4 rounded border-slate-300"
            />
            Öne çıkan paket (&quot;En Popüler&quot;)
          </label>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            name="active"
            defaultChecked={pkg.active}
            className="h-4 w-4 rounded border-slate-300"
          />
          Sitede yayında (aktif)
        </label>
        <SubmitButton>Değişiklikleri Kaydet</SubmitButton>
      </form>

      <form action={deletePackageAction} className="mt-4 max-w-2xl">
        <input type="hidden" name="id" value={pkg.id} />
        <ConfirmSubmitButton confirmMessage={`"${pkg.name}" paketini silmek istediğinize emin misiniz?`}>
          Paketi Sil
        </ConfirmSubmitButton>
      </form>
    </div>
  );
}
