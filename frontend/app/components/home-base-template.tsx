import type { ReactNode } from "react";
import { HomeNavbar } from "./home-navbar";
import { HomeFooter } from "./home-footer";

export async function HomeBaseTemplate({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[#efefef] text-[#666]">
      <HomeNavbar />

      {children}

      <HomeFooter />
    </main>
  );
}
