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
      className="group flex items-center gap-3 rounded-xl border p-4 transition-all hover:bg-muted hover:shadow-sm"
    >

      <div className="rounded-lg bg-primary/10 p-3 text-primary transition-transform group-hover:scale-105">
        <Icon size={22} />
      </div>

      <span className="font-medium">
        {title}
      </span>

    </Link>
  );
}