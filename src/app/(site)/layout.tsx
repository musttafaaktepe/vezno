import { getSiteSettings } from "@/lib/data/settings";
import { listServices } from "@/lib/data/services";
import { listBranches } from "@/lib/data/branches";
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import WhatsAppButton from "./_components/WhatsAppButton";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = getSiteSettings();
  const services = listServices({ onlyActive: true });
  const branches = listBranches({ onlyActive: true });

  return (
    <>
      <Header brandName={settings.brandName} phone={settings.phone} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} services={services} branches={branches} />
      <WhatsAppButton whatsapp={settings.whatsapp} />
    </>
  );
}
