import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
}

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: Props) {
  return (
    <Card className="transition-shadow hover:shadow-lg">
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h2 className="mt-2 text-3xl font-bold">{value}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="rounded-xl bg-primary/10 p-4 text-primary">
          <Icon size={28} />
        </div>
      </CardContent>
    </Card>
  );
}