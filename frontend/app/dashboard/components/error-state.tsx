import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="grid place-items-center rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
      <AlertTriangle className="h-8 w-8 text-red-500" aria-hidden="true" />
      <h3 className="mt-3 text-base font-semibold text-red-700">Something went wrong</h3>
      <p className="mt-1 text-sm text-red-600">Unable to load dashboard data. Please try again.</p>
      <Button onClick={onRetry} variant="destructive" className="mt-4">
        Retry
      </Button>
    </div>
  );
}
