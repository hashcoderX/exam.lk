import Link from "next/link";
import Image from "next/image";
import { CircleDollarSign, Download, Mail, Smartphone, UserCheck } from "lucide-react";

export function HomeFooter() {
  return (
    <footer className="bg-[radial-gradient(120%_180%_at_0%_0%,#173463_0%,#0c2145_55%,#081930_100%)] text-[#d7e5fb]">
      <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1.2fr]">
          <div className="border-b border-white/10 pb-6 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
            <Image
              src="/EXAM-Main-Logo-for%20dark-bg@3x.png"
              alt="EXAM.LK"
              width={210}
              height={46}
              className="h-auto w-[180px]"
            />
            <p className="mt-4 max-w-xs text-[14px] leading-6 text-[#bdd0ec]">
              Sri Lanka&apos;s trusted online learning platform. Access past papers, study materials, and resources for all grades and exams.
            </p>
            <div className="mt-4 flex items-center gap-3 text-[#d5e2f8]">
              <a href="#" aria-label="Facebook" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20">f</a>
              <a href="#" aria-label="Youtube" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-[13px] font-semibold transition hover:bg-white/20">▶</a>
              <a href="#" aria-label="TikTok" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20">t</a>
              <a href="#" aria-label="Instagram" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"><Mail className="h-4 w-4" /></a>
            </div>
          </div>

          <div className="border-b border-white/10 pb-6 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
            <h3 className="text-[18px] font-semibold text-white">Quick Links</h3>
            <ul className="mt-3 space-y-2 text-[14px] text-[#c8d8f0]">
              <li><Link href="/" className="transition hover:text-white">Home</Link></li>
              <li><Link href="/about-us" className="transition hover:text-white">About Us</Link></li>
              <li><Link href="/all-exams" className="transition hover:text-white">Past Papers</Link></li>
              <li><Link href="/all-exams" className="transition hover:text-white">Study Materials</Link></li>
              <li><Link href="/all-exams" className="transition hover:text-white">Model Papers</Link></li>
              <li><Link href="/contact-us" className="transition hover:text-white">Contact Us</Link></li>
            </ul>
          </div>

          <div className="border-b border-white/10 pb-6 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
            <h3 className="text-[18px] font-semibold text-white">Grow With Exam.lk</h3>
            <ul className="mt-3 space-y-2 text-[14px] text-[#c8d8f0]">
              <li><Link href="/dashboard/advertising" className="transition hover:text-white">Banner Ads</Link></li>
              <li><Link href="/dashboard/advertising" className="transition hover:text-white">Promote Your Business</Link></li>
              <li><Link href="/all-exams" className="transition hover:text-white">Featured Listings</Link></li>
              <li><Link href="/help-center" className="transition hover:text-white">Premium Membership</Link></li>
            </ul>
          </div>

          <div className="border-b border-white/10 pb-6 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
            <h3 className="text-[18px] font-semibold text-white">Support</h3>
            <ul className="mt-3 space-y-2 text-[14px] text-[#c8d8f0]">
              <li><Link href="/help-center" className="transition hover:text-white">Help Center</Link></li>
              <li><Link href="/how-to-download" className="transition hover:text-white">How to Download</Link></li>
              <li><Link href="/faq" className="transition hover:text-white">FAQ</Link></li>
              <li><Link href="/privacy-policy" className="transition hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms-and-condition" className="transition hover:text-white">Terms & Conditions</Link></li>
              <li><Link href="/dmca" className="transition hover:text-white">DMCA</Link></li>
              <li><Link href="/report-content" className="transition hover:text-white">Report Content</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-[18px] font-semibold text-white">Subscribe to our newsletter</h3>
            <p className="mt-3 text-[14px] leading-6 text-[#bdd0ec]">Get updates on new materials and exam alerts.</p>
            <div className="mt-4 rounded-xl border border-white/15 bg-white/5 p-3">
              <label className="sr-only" htmlFor="footer-newsletter-email">Email</label>
              <div className="flex items-center gap-2 rounded-md border border-white/15 bg-[#0d254a] px-3 py-2">
                <Mail className="h-4 w-4 text-[#aac2e7]" />
                <input
                  id="footer-newsletter-email"
                  type="email"
                  placeholder="Your email address"
                  className="w-full bg-transparent text-[14px] text-white outline-none placeholder:text-[#9cb4d8]"
                />
              </div>
              <button
                type="button"
                className="mt-3 w-full rounded-md bg-[linear-gradient(90deg,#3b82f6_0%,#2f67ef_100%)] px-4 py-2.5 text-[14px] font-semibold text-white transition hover:brightness-110"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 border-y border-white/10 py-5 text-[14px] text-[#d2e1f6] sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-3">
            <CircleDollarSign className="h-5 w-5 text-[#97b6e6]" />
            <p>100% Free Quality Resources</p>
          </div>
          <div className="flex items-center gap-3">
            <Download className="h-5 w-5 text-[#97b6e6]" />
            <p>Easy Download PDF Materials</p>
          </div>
          <div className="flex items-center gap-3">
            <Smartphone className="h-5 w-5 text-[#97b6e6]" />
            <p>Regular Updates Daily New Content</p>
          </div>
          <div className="flex items-center gap-3">
            <UserCheck className="h-5 w-5 text-[#97b6e6]" />
            <p>Trusted by Students Across Sri Lanka</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-[13px] text-[#b8cbe8]">
          <p>© 2026 Exam.lk. All rights reserved.</p>
          <div className="flex items-center gap-6 text-[26px] font-bold tracking-tight text-white/90">
            <span>VISA</span>
            <span>Mastercard</span>
            <span>AMEX</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
