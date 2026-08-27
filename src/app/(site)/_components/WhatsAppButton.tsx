export default function WhatsAppButton({ whatsapp }: { whatsapp: string | null }) {
  if (!whatsapp) return null;
  const digits = whatsapp.replace(/\D/g, "");
  const href = `https://wa.me/${digits}?text=${encodeURIComponent(
    "Merhaba, oto ekspertiz randevusu hakkında bilgi almak istiyorum.",
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp üzerinden yazın"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg transition hover:bg-emerald-600"
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7" fill="currentColor" aria-hidden="true">
        <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.31.638 4.474 1.746 6.322L4 29l7.86-1.708A11.93 11.93 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm0 21.7c-1.98 0-3.83-.55-5.41-1.51l-.388-.23-4.66 1.012 1.03-4.53-.253-.4A9.63 9.63 0 0 1 6.3 15c0-5.35 4.36-9.7 9.704-9.7 5.345 0 9.7 4.35 9.7 9.7 0 5.35-4.355 9.7-9.7 9.7Zm5.34-7.26c-.29-.146-1.727-.85-1.994-.947-.267-.098-.462-.146-.657.146-.194.293-.755.947-.926 1.14-.17.196-.34.22-.63.074-.29-.147-1.226-.452-2.335-1.44-.863-.77-1.446-1.72-1.616-2.012-.17-.293-.018-.45.128-.596.132-.13.29-.34.436-.51.146-.17.194-.293.29-.488.098-.196.05-.367-.024-.513-.073-.146-.657-1.583-.9-2.168-.238-.57-.48-.492-.657-.5-.17-.008-.365-.01-.56-.01-.196 0-.513.073-.782.366-.267.293-1.02 1-1.02 2.435 0 1.435 1.045 2.822 1.19 3.017.146.196 2.055 3.14 4.98 4.404.696.3 1.238.48 1.66.615.698.222 1.333.19 1.836.115.56-.083 1.727-.706 1.97-1.388.243-.682.243-1.267.17-1.388-.073-.122-.267-.196-.558-.342Z" />
      </svg>
    </a>
  );
}
