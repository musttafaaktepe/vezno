import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Yönetici Girişi | OtoVizör Ekspertiz",
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-700 text-lg font-bold text-white">
            OV
          </div>
          <h1 className="text-lg font-semibold text-slate-900">Yönetim Paneli</h1>
          <p className="mt-1 text-sm text-slate-500">Devam etmek için giriş yapın</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
