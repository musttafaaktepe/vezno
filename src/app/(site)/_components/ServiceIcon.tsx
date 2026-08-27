import {
  Gauge,
  PaintBucket,
  Layers,
  Settings2,
  Disc,
  Route,
  Armchair,
  FileText,
  Wrench,
  type LucideProps,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  engine: Gauge,
  paint: PaintBucket,
  frame: Layers,
  suspension: Settings2,
  brake: Disc,
  road: Route,
  cabin: Armchair,
  report: FileText,
};

export default function ServiceIcon({
  icon,
  className,
}: {
  icon: string | null;
  className?: string;
}) {
  const Icon = (icon && ICON_MAP[icon]) || Wrench;
  return <Icon className={className} strokeWidth={1.75} />;
}
