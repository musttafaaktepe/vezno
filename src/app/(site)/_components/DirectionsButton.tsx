import { Navigation } from "lucide-react";

export default function DirectionsButton({ mapsUrl }: { mapsUrl: string | null }) {
  if (!mapsUrl) return null;

  return (
    <a
      href={mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Yol tarifi al"
      className="fixed bottom-24 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-blue-700 text-white shadow-lg transition hover:bg-blue-800"
    >
      <Navigation className="h-6 w-6" strokeWidth={2} />
    </a>
  );
}
