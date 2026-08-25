import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const activities = [
  { id: 1, text: "Agency BlueOcean submitted verification documents", tone: "bg-amber-500", time: "3m ago" },
  { id: 2, text: "Payment batch settled for 54 exam listings", tone: "bg-emerald-500", time: "18m ago" },
  { id: 3, text: "AI moderation flagged 2 suspicious listings", tone: "bg-red-500", time: "45m ago" },
  { id: 4, text: "Superadmin approved 12 pending agents", tone: "bg-blue-500", time: "1h ago" },
];

export function ActivityCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="space-y-4">
          {activities.map((item) => (
            <li key={item.id} className="flex gap-3">
              <span className={`mt-1 h-2.5 w-2.5 rounded-full ${item.tone}`} aria-hidden="true" />
              <div>
                <button className="text-left text-sm text-slate-700 hover:text-blue-700">{item.text}</button>
                <p className="mt-1 text-xs text-slate-400">{item.time}</p>
              </div>
            </li>
          ))}
        </ol>
        <button className="mt-4 text-sm font-medium text-blue-600 hover:underline">Load more</button>
      </CardContent>
    </Card>
  );
}
