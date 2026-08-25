import { CategoriesClient, type JobCategory } from "./categories-client";

async function getInitialCategories(): Promise<JobCategory[]> {
  try {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";
    const response = await fetch(`${base}/api/categories`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    return (await response.json()) as JobCategory[];
  } catch {
    return [];
  }
}

export default async function CategoriesPage() {
  const initialCategories = await getInitialCategories();
  return <CategoriesClient initialCategories={initialCategories} />;
}
