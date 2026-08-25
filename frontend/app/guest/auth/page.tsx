import { redirect } from "next/navigation";

type GuestAuthPageProps = {
  searchParams?: Promise<{
    mode?: string;
    next?: string;
  }>;
};

export default async function GuestAuthPage({ searchParams }: GuestAuthPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const mode = params?.mode === "join" ? "join" : "signin";
  const next = params?.next && params.next.startsWith("/") && !params.next.startsWith("//")
    ? params.next
    : "/guest/dashboard";

  redirect(`/?auth=${mode}&next=${encodeURIComponent(next)}`);
}
