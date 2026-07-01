import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { recentActivity } from "@/constants/dashboard";

export default function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {recentActivity.map((activity) => (
          <div
            key={activity.title}
            className="border-b pb-3 last:border-none"
          >
            <h4 className="font-medium">{activity.title}</h4>

            <p className="text-sm text-muted-foreground">
              {activity.time}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}