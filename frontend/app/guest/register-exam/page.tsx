import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function GuestRegisterExamEntryPage() {
  const cookieStore = await cookies();
  const hasGuestSession = Boolean(cookieStore.get("guest_session")?.value);

  if (!hasGuestSession) {
    redirect("/?auth=join&next=/guest/exam-registration");
  }

  redirect("/guest/exam-registration");
}
