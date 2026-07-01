import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  href: string;
  icon: LucideIcon;
}

export default function QuickAction({
  title,
  href,
  icon: Icon,
}: Props) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl border p-4 transition hover:bg-muted"
    >
      <Icon className="text-primary" size={22} />

      <span className="font-medium">{title}</span>
    </Link>
  );
}