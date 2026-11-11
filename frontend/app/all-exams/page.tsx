import AllExamsPage from "../all-exams";

type AllExamsRoutePageProps = {
  searchParams?: Promise<{
    category?: string;
  }>;
};

export default async function AllExamsRoutePage({ searchParams }: AllExamsRoutePageProps) {
  const params = searchParams ? await searchParams : undefined;
  return <AllExamsPage selectedCategoryName={params?.category} />;
}
