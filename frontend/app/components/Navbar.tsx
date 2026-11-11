import Link from "next/link";
import Image from "next/image";

type NavItem = {
  label: string;
  href: string;
};

type LanguageOption = {
  label: string;
  href: string;
};

type NavbarProps = {
  brandName?: string;
  homeHref?: string;
  items?: NavItem[];
  languages?: LanguageOption[];
  loginHref?: string;
  submitHref?: string;
};

const defaultNavItems: NavItem[] = [
  { label: "All Exams", href: "#" },
];

const defaultLanguages: LanguageOption[] = [
  { label: "සිංහල", href: "#" },
  { label: "English", href: "#" },
  { label: "தமிழ்", href: "#" },
];

export default function Navbar({
  brandName = "exam.lk",
  homeHref = "/",
  items = defaultNavItems,
  languages = defaultLanguages,
  loginHref = "#",
  submitHref = "#",
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 shadow-[0_10px_24px_-18px_rgba(15,23,42,0.35)] backdrop-blur">
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8"
      >
        <Link href={homeHref} className="flex items-center" aria-label={`${brandName} home`}>
          <Image
            src="/EXAM-Main-Logo.png"
            alt={brandName}
            width={180}
            height={40}
            priority
            className="h-auto w-[160px] sm:w-[180px]"
          />
        </Link>

        <div className="hidden items-center gap-7 text-sm font-normal text-slate-600 lg:flex">
          {items.map((item) => (
            <Link key={item.label} href={item.href} className="transition hover:text-[#2563EB]">
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div
            aria-label="Choose language"
            className="ml-3 hidden items-center text-sm font-normal text-slate-500 md:flex"
          >
            {languages.map((language, index) => (
              <span key={language.label} className="flex items-center">
                <Link href={language.href} className="px-2 transition hover:text-[#2563EB]">
                  {language.label}
                </Link>
                {index < languages.length - 1 ? <span className="text-slate-300">|</span> : null}
              </span>
            ))}
          </div>
          <Link
            href={loginHref}
            className="hidden rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 sm:inline-flex"
          >
            Login
          </Link>
          <Link
            href={submitHref}
            className="rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-800 transition hover:border-slate-950 hover:bg-slate-50 hover:text-slate-950"
          >
            POST YOUR EXAM
          </Link>
        </div>
      </nav>
    </header>
  );
}
