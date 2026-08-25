import { cookies } from "next/headers";
import { GuestAuthModal } from "./guest-auth-modal";

export async function GuestAuthControls() {
  const cookieStore = await cookies();
  const hasGuestSession = Boolean(cookieStore.get("guest_session")?.value);
  const rawGuestName = cookieStore.get("guest_name")?.value;

  if (!hasGuestSession) {
    return <GuestAuthModal />;
  }

  const guestName = rawGuestName ? decodeURIComponent(rawGuestName) : "Guest";

  return <p className="text-[11px] text-[#6d6d6d]">Hi, {guestName}</p>;
}
