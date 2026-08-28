export interface Service {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  icon: string | null;
  sortOrder: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Package {
  id: string;
  slug: string;
  name: string;
  price: number;
  duration: string | null;
  description: string;
  features: string[];
  highlighted: boolean;
  sortOrder: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Branch {
  id: string;
  slug: string;
  name: string;
  city: string;
  district: string | null;
  address: string;
  phone: string;
  workingHours: string;
  mapUrl: string | null;
  sortOrder: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export type AppointmentStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
export type AppointmentServiceType = "BRANCH" | "MOBILE";

export interface Appointment {
  id: string;
  trackingCode: string;
  fullName: string;
  phone: string;
  email: string | null;
  plate: string | null;
  vehicleBrand: string | null;
  vehicleModel: string | null;
  vehicleYear: string | null;
  branchId: string;
  packageId: string | null;
  serviceType: AppointmentServiceType;
  appointmentDate: string;
  timeSlot: string;
  note: string | null;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Campaign {
  id: string;
  slug: string;
  title: string;
  description: string;
  badge: string | null;
  validUntil: string | null;
  active: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  city: string | null;
  vehicle: string | null;
  rating: number;
  comment: string;
  active: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  active: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface SiteSettings {
  id: string;
  brandName: string;
  tagline: string;
  phone: string;
  whatsapp: string | null;
  email: string;
  address: string | null;
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  instagramUrl: string | null;
  facebookUrl: string | null;
  youtubeUrl: string | null;
  workingHours: string | null;
  mapsUrl: string | null;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  createdAt: string;
}
