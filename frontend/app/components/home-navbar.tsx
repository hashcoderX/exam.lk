import Link from "next/link";
import Image from "next/image";
import { ChevronDown, Heart, Smartphone } from "lucide-react";
import { GuestAuthControls } from "./guest-auth-controls";

export async function HomeNavbar() {
  return (
    <header className="border-b border-[#dfe6ef] bg-white shadow-[0_1px_8px_rgba(26,54,93,0.06)]">
      <nav className="mx-auto flex h-[54px] w-full max-w-[1280px] items-center justify-between px-3 sm:px-5 lg:px-8">
        <div className="flex items-center gap-5">
          <Link href="/" className="inline-flex items-center px-1 py-0.5" aria-label="Go to home page">
            <Image
              src="/EXAM-Main-Logo.png"
              alt="EXAM.LK"
              width={170}
              height={40}
              priority
              className="h-auto w-[115px] sm:w-[150px]"
            />
          </Link>
        </div>

        <div className="flex h-full items-center text-[13px] text-[#5f7187]">
          <button
            type="button"
            className="hidden h-full items-center gap-1 border-b-2 border-[#3b82f6] px-3 font-medium text-[#4f5f75] sm:inline-flex"
          >
            Menu
            <ChevronDown className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            className="hidden h-full items-center gap-1 border-b-2 border-transparent px-3 transition hover:text-[#3b82f6] sm:inline-flex"
          >
            සිංහල
            <ChevronDown className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            className="hidden h-full items-center gap-1 border-b-2 border-transparent px-3 transition hover:text-[#3b82f6] md:inline-flex"
          >
            <Smartphone className="h-3.5 w-3.5" />
            App
          </button>

          <Link
            href="/my-list"
            className="hidden h-full items-center border-b-2 border-transparent px-3 transition hover:text-[#3b82f6] md:inline-flex"
            aria-label="My list"
          >
            <Heart className="h-3.5 w-3.5" />
          </Link>

          <button
            type="button"
            className="inline-flex h-full items-center border-b-2 border-transparent px-2 transition hover:text-[#3b82f6] sm:px-3"
            aria-label="Profile menu"
          >
            <Image
              src="/icons/homeicons/User-Img.png"
              alt="User"
              width={34}
              height={34}
              className="h-8 w-8 rounded-full border border-[#dce4f0]"
            />
          </button>

          <div className="hidden lg:block">
            <GuestAuthControls />
          </div>
        </div>
      </nav>
    </header>
  );
}
