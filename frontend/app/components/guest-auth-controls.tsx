import { cookies } from "next/headers";
import Link from "next/link";

export async function GuestAuthControls() {
  const cookieStore = await cookies();
  const hasGuestSession = Boolean(cookieStore.get("guest_session")?.value);
  const rawGuestName = cookieStore.get("guest_name")?.value;

  if (!hasGuestSession) {
    return (
      <div className="text-[11px]">
        <Link href="/signup?mode=signin" className="text-[#8b8b8b] hover:text-[#555]">
          Sign in
        </Link>
        <span className="px-1">|</span>
        <Link href="/signup?mode=join" className="text-[#8b8b8b] hover:text-[#555]">
          Join
        </Link>
      </div>
    );
  }

  const guestName = rawGuestName ? decodeURIComponent(rawGuestName) : "Guest";

  return <p className="text-[11px] text-[#6d6d6d]">Hi, {guestName}</p>;
}
