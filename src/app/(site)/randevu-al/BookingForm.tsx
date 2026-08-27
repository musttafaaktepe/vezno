"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import type { Branch, Package } from "@/lib/data/types";
import { createAppointmentAction, getAvailableSlotsAction, type BookingState } from "./actions";
import { TIME_SLOTS } from "@/lib/timeSlots";

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100";
const labelClass = "text-sm font-medium text-slate-700";

function todayISO(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

const initialState: BookingState = {};

export default function BookingForm({
  branches,
  packages,
  defaultBranchSlug,
  defaultPackageSlug,
  defaultServiceType,
}: {
  branches: Branch[];
  packages: Package[];
  defaultBranchSlug?: string;
  defaultPackageSlug?: string;
  defaultServiceType?: "BRANCH" | "MOBILE";
}) {
  const [state, formAction, isPending] = useActionState(createAppointmentAction, initialState);

  const defaultBranch = branches.find((b) => b.slug === defaultBranchSlug);
  const defaultPackage = packages.find((p) => p.slug === defaultPackageSlug);

  const [serviceType, setServiceType] = useState<"BRANCH" | "MOBILE">(defaultServiceType ?? "BRANCH");
  const [branchId, setBranchId] = useState(defaultBranch?.id ?? "");
  const [date, setDate] = useState(todayISO());
  const [timeSlot, setTimeSlot] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>(TIME_SLOTS);
  const [isSlotsPending, startSlotsTransition] = useTransition();

  useEffect(() => {
    startSlotsTransition(async () => {
      if (!branchId || !date) {
        setAvailableSlots(TIME_SLOTS);
        return;
      }
      const slots = await getAvailableSlotsAction(branchId, date);
      setAvailableSlots(slots);
      setTimeSlot((current) => (slots.includes(current) ? current : ""));
    });
  }, [branchId, date]);

  const fieldError = (name: string) => state.fieldErrors?.[name];

  return (
    <form action={formAction} className="flex flex-col gap-8">
      <div>
        <p className={labelClass}>Hizmet Türü</p>
        <div className="mt-2 grid grid-cols-2 gap-3">
          {(
            [
              { value: "BRANCH", label: "Şubede Ekspertiz" },
              { value: "MOBILE", label: "Mobil (Yerinde) Ekspertiz" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setServiceType(opt.value)}
              className={`rounded-lg border px-4 py-3 text-sm font-semibold transition ${
                serviceType === opt.value
                  ? "border-blue-700 bg-blue-50 text-blue-700"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <input type="hidden" name="serviceType" value={serviceType} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="branchId" className={labelClass}>
            {serviceType === "MOBILE" ? "Bağlı Olacağı Şube *" : "Şube *"}
          </label>
          <select
            id="branchId"
            name="branchId"
            required
            value={branchId}
            onChange={(e) => setBranchId(e.target.value)}
            className={inputClass}
          >
            <option value="">Şube seçin</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} — {b.city}
              </option>
            ))}
          </select>
          {fieldError("branchId") && <p className="text-xs text-red-600">{fieldError("branchId")}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="packageId" className={labelClass}>
            Paket
          </label>
          <select
            id="packageId"
            name="packageId"
            defaultValue={defaultPackage?.id ?? ""}
            className={inputClass}
          >
            <option value="">Paket seçmeden devam et</option>
            {packages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — {p.price.toLocaleString("tr-TR")} ₺
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="appointmentDate" className={labelClass}>
            Tarih *
          </label>
          <input
            id="appointmentDate"
            name="appointmentDate"
            type="date"
            required
            min={todayISO()}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
          />
          {fieldError("appointmentDate") && (
            <p className="text-xs text-red-600">{fieldError("appointmentDate")}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <span className={labelClass}>Saat *</span>
          <div className="grid grid-cols-5 gap-2">
            {TIME_SLOTS.map((slot) => {
              const available = availableSlots.includes(slot);
              return (
                <button
                  key={slot}
                  type="button"
                  disabled={!available || !branchId}
                  onClick={() => setTimeSlot(slot)}
                  className={`rounded-lg border px-2 py-2 text-xs font-semibold transition ${
                    timeSlot === slot
                      ? "border-blue-700 bg-blue-700 text-white"
                      : available
                        ? "border-slate-200 text-slate-700 hover:bg-slate-50"
                        : "cursor-not-allowed border-slate-100 text-slate-300 line-through"
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
          <input type="hidden" name="timeSlot" value={timeSlot} />
          {!branchId && <p className="text-xs text-slate-400">Saatleri görmek için önce şube seçin.</p>}
          {isSlotsPending && <p className="text-xs text-slate-400">Müsaitlik kontrol ediliyor...</p>}
          {fieldError("timeSlot") && <p className="text-xs text-red-600">{fieldError("timeSlot")}</p>}
        </div>
      </div>

      <div>
        <p className={labelClass}>Araç Bilgileri</p>
        <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <input name="plate" placeholder="Plaka" className={inputClass} />
          <input name="vehicleBrand" placeholder="Marka" className={inputClass} />
          <input name="vehicleModel" placeholder="Model" className={inputClass} />
          <input name="vehicleYear" placeholder="Yıl" className={inputClass} />
        </div>
      </div>

      <div>
        <p className={labelClass}>İletişim Bilgileri</p>
        <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <input name="fullName" placeholder="Ad Soyad *" required className={inputClass} />
            {fieldError("fullName") && <p className="text-xs text-red-600">{fieldError("fullName")}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <input name="phone" placeholder="Telefon *" required className={inputClass} />
            {fieldError("phone") && <p className="text-xs text-red-600">{fieldError("phone")}</p>}
          </div>
          <input name="email" type="email" placeholder="E-posta (opsiyonel)" className={inputClass + " sm:col-span-2"} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="note" className={labelClass}>
          {serviceType === "MOBILE" ? "Adres ve Not" : "Not"}
        </label>
        <textarea
          id="note"
          name="note"
          rows={3}
          placeholder={
            serviceType === "MOBILE"
              ? "Mobil ekspertiz için açık adresinizi buraya yazabilirsiniz."
              : "Eklemek istediğiniz bir not var mı?"
          }
          className={inputClass + " resize-y"}
        />
      </div>

      {state.error && (
        <p className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center justify-center rounded-lg bg-blue-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:opacity-60"
      >
        {isPending ? "Randevu oluşturuluyor..." : "Randevumu Oluştur"}
      </button>
    </form>
  );
}
