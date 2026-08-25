import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartContainer } from "./chart-container";

const points = [22, 32, 28, 35, 47, 44, 53, 58, 62, 59, 66, 72];

export function ChartCard({ title }: { title: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <div className="flex gap-1">
          {(["Daily", "Weekly", "Monthly", "Yearly"] as const).map((period) => (
            <Button key={period} size="sm" variant={period === "Monthly" ? "default" : "outline"}>
              {period}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer>
          <svg viewBox="0 0 420 220" className="h-full w-full" role="img" aria-label={`${title} chart`}>
            <polyline
              fill="none"
              stroke="#2563EB"
              strokeWidth="3"
              points={points.map((p, i) => `${i * 35},${200 - p * 2.2}`).join(" ")}
            />
            {points.map((p, i) => (
              <circle key={`${p}-${i}`} cx={i * 35} cy={200 - p * 2.2} r="3" fill="#2563EB" />
            ))}
          </svg>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
