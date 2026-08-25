import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function GuestExamListingsPage() {
  const cookieStore = await cookies();
  const hasGuestSession = Boolean(cookieStore.get("guest_session")?.value);

  if (!hasGuestSession) {
    redirect("/?auth=join&next=/guest/exam-listings");
  }

  return (
    <main className="min-h-screen bg-[#efefef] text-[#666]">
      <header className="border-b border-[#ddd] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
        <div className="h-[3px] w-full bg-[#1f1f1f]" />
        <div className="mx-auto flex max-w-[1020px] items-center justify-between px-4 py-2 text-[11px] text-[#7b7b7b]">
          <div className="flex items-center gap-5">
            <h1 className="flex items-center gap-1 text-[30px] font-light leading-none tracking-[0.12em] text-[#c2c9cd]">
              <span className="text-[20px]">🏍</span>
              EXAM.LK
            </h1>
            <Link href="/" className="font-semibold text-[#7f9caf] hover:text-[#4f6f84]">
              All Exams
            </Link>
            <a href="#" className="hidden text-[#8f8f8f] md:block">
              සිංහල | தமிழ்
            </a>
          </div>
          <div className="flex items-center gap-4 text-[#8b8b8b]">
            <Link href="/guest/dashboard" className="hidden items-center gap-1 sm:inline-flex">
              Dashboard
            </Link>
            <Link href="/guest/exam-registration" className="rounded-sm border border-[#d6a948] bg-[#f0be52] px-3 py-1 font-semibold text-[#5b4b2b]">
              Exam registration
            </Link>
          </div>
        </div>
      </header>

      <section className="border-t border-[#ddd] bg-[#efefef] pb-16 pt-6">
        <div className="mx-auto grid max-w-[1020px] gap-4 px-4 lg:grid-cols-[180px_1fr]">
          <aside className="space-y-3 text-[11px]">
            <section className="border-b border-[#d7d7d7] pb-3">
              <h2 className="mb-2 text-[10px] uppercase tracking-wide text-[#a3a3a3]">Guest Menu</h2>
              <ul className="space-y-1 text-[#4f87bc]">
                <li><Link href="/guest/dashboard" className="hover:text-[#2f6a9d]">Dashboard Home</Link></li>
                <li><Link href="/guest/exam-listings" className="hover:text-[#2f6a9d]">Exam Listings</Link></li>
                <li><Link href="/guest/exam-registration" className="hover:text-[#2f6a9d]">Exam Registration</Link></li>
              </ul>
            </section>

            <section className="border-b border-[#d7d7d7] pb-3">
              <h2 className="mb-2 text-[11px] font-semibold text-[#666]">Help</h2>
              <p className="text-[11px] text-[#8a8a8a]">Need support with exam registration? Contact exam.lk support.</p>
            </section>
          </aside>

          <div className="border border-[#d8d8d8] bg-white p-4 sm:p-6">
            <div className="border-b border-[#e1e1e1] pb-3">
              <h2 className="text-[24px] font-light text-[#6d6d6d]">Exam listings</h2>
              <p className="mt-1 text-[12px] text-[#9a9a9a]">Choose an exam and continue to registration.</p>
            </div>

            <div className="mt-4 space-y-3">
              <article className="border border-[#d8d8d8] bg-[#fcfcfc] p-3">
                <h3 className="text-[16px] text-[#545454]">G.C.E. Advanced Level 2026</h3>
                <p className="mt-1 text-[12px] text-[#8a8a8a]">Registration open now.</p>
              </article>
              <article className="border border-[#d8d8d8] bg-[#fcfcfc] p-3">
                <h3 className="text-[16px] text-[#545454]">G.C.E. Ordinary Level 2026</h3>
                <p className="mt-1 text-[12px] text-[#8a8a8a]">Registration open now.</p>
              </article>
            </div>

            <div className="mt-5">
              <Link href="/guest/exam-registration" className="rounded-sm border border-[#dcae42] bg-[#f0be52] px-5 py-2 text-[12px] font-bold text-[#4f4329]">
                Go to exam registration
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#ddd] bg-[#f3f3f3]">
        <div className="mx-auto grid max-w-[1020px] gap-6 px-4 py-10 text-[12px] text-[#97a4ad] sm:grid-cols-[1fr_1fr_1fr_220px]">
          <div>
            <h2 className="mb-3 text-[21px] font-light text-[#a5b0b7]">Services</h2>
            <ul className="space-y-1">
              <li><a href="#" className="hover:text-[#6d7a83]">How to sell fast</a></li>
              <li><a href="#" className="hover:text-[#6d7a83]">Stay safe with exam.lk</a></li>
              <li><a href="#" className="hover:text-[#6d7a83]">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h2 className="mb-3 text-[21px] font-light text-[#a5b0b7]">Informations</h2>
            <ul className="space-y-1">
              <li><a href="#" className="hover:text-[#6d7a83]">About us</a></li>
              <li><a href="#" className="hover:text-[#6d7a83]">Contact us</a></li>
              <li><a href="#" className="hover:text-[#6d7a83]">Privacy policy</a></li>
              <li><a href="#" className="hover:text-[#6d7a83]">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-[#6d7a83]">Site map</a></li>
            </ul>
          </div>
          <div>
            <h2 className="mb-3 text-[21px] font-light text-[#a5b0b7]">Join with us</h2>
            <ul className="space-y-1">
              <li><a href="#" className="hover:text-[#6d7a83]">google.com/exam.lk</a></li>
              <li><a href="#" className="hover:text-[#6d7a83]">facebook.com/www.exam.lk</a></li>
              <li><a href="#" className="hover:text-[#6d7a83]">twitter.com/exam</a></li>
              <li><a href="#" className="hover:text-[#6d7a83]">instagram.com/exam.lk</a></li>
            </ul>
          </div>
          <div className="flex items-end justify-end text-right">
            <p className="text-[48px] font-light leading-none tracking-[0.08em] text-[#c3ccd1]">🏍 EXAM.LK</p>
          </div>
        </div>
        <div className="border-t border-[#e1e1e1] py-2 text-center text-[11px] text-[#8ba8b9]">
          © 2010-2026 exam.lk. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
