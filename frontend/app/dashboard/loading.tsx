import { LoadingSkeleton } from "./components/loading-skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] p-6">
      <LoadingSkeleton />
    </main>
  );
}
