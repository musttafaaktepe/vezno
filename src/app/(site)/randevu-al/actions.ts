"use server";

import { redirect } from "next/navigation";
import { createAppointment, listBookedSlots } from "@/lib/data/appointments";
import { getBranchById } from "@/lib/data/branches";
import { TIME_SLOTS } from "@/lib/timeSlots";

export interface BookingState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function getAvailableSlotsAction(branchId: string, date: string): Promise<string[]> {
  if (!branchId || !date) return TIME_SLOTS;
  const booked = new Set(listBookedSlots(branchId, date));
  return TIME_SLOTS.filter((slot) => !booked.has(slot));
}

function isValidDate(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const picked = new Date(date + "T00:00:00");
  return picked.getTime() >= today.getTime();
}

export async function createAppointmentAction(
  _prevState: BookingState,
  formData: FormData,
): Promise<BookingState> {
  const fullName = formData.get("fullName")?.toString().trim() ?? "";
  const phone = formData.get("phone")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim() ?? "";
  const plate = formData.get("plate")?.toString().trim() ?? "";
  const vehicleBrand = formData.get("vehicleBrand")?.toString().trim() ?? "";
  const vehicleModel = formData.get("vehicleModel")?.toString().trim() ?? "";
  const vehicleYear = formData.get("vehicleYear")?.toString().trim() ?? "";
  const branchId = formData.get("branchId")?.toString().trim() ?? "";
  const packageId = formData.get("packageId")?.toString().trim() ?? "";
  const serviceType = formData.get("serviceType")?.toString().trim() === "MOBILE" ? "MOBILE" : "BRANCH";
  const appointmentDate = formData.get("appointmentDate")?.toString().trim() ?? "";
  const timeSlot = formData.get("timeSlot")?.toString().trim() ?? "";
  const note = formData.get("note")?.toString().trim() ?? "";

  const fieldErrors: Record<string, string> = {};
  if (!fullName) fieldErrors.fullName = "Ad soyad zorunludur.";
  if (!phone || phone.replace(/\D/g, "").length < 10) fieldErrors.phone = "Geçerli bir telefon numarası girin.";
  if (!branchId || !getBranchById(branchId)) fieldErrors.branchId = "Lütfen bir şube seçin.";
  if (!appointmentDate || !isValidDate(appointmentDate)) fieldErrors.appointmentDate = "Geçerli bir tarih seçin.";
  if (!timeSlot || !TIME_SLOTS.includes(timeSlot)) fieldErrors.timeSlot = "Lütfen bir saat seçin.";

  if (Object.keys(fieldErrors).length > 0) {
    return { error: "Lütfen işaretli alanları kontrol edin.", fieldErrors };
  }

  const booked = new Set(listBookedSlots(branchId, appointmentDate));
  if (booked.has(timeSlot)) {
    return {
      error: "Seçtiğiniz saat az önce doldu, lütfen başka bir saat seçin.",
      fieldErrors: { timeSlot: "Bu saat dolu." },
    };
  }

  const appointment = createAppointment({
    fullName,
    phone,
    email: email || null,
    plate: plate || null,
    vehicleBrand: vehicleBrand || null,
    vehicleModel: vehicleModel || null,
    vehicleYear: vehicleYear || null,
    branchId,
    packageId: packageId || null,
    serviceType,
    appointmentDate,
    timeSlot,
    note: note || null,
  });

  redirect(`/randevu-al/basarili?code=${appointment.trackingCode}`);
}
