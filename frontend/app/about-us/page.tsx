import Image from "next/image";
import { BookOpenText, Check, Eye, GraduationCap, Heart, Star, Target, Users } from "lucide-react";
import { HomeBaseTemplate } from "../components/home-base-template";

export default function AboutUsPage() {
  return (
    <HomeBaseTemplate>
      <section className="bg-[radial-gradient(120%_140%_at_50%_0%,#f7fbff_0%,#edf5ff_52%,#f7fbff_100%)] py-10 sm:py-14">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <article className="grid items-center gap-6 lg:grid-cols-[1fr_1.15fr_0.9fr] lg:gap-8">
            <div className="relative">
              <Image
                src="/images/Exam-about-us-png.png"
                alt="Student learning illustration"
                width={460}
                height={300}
                className="h-auto w-full object-contain"
                priority
              />
            </div>

            <div className="max-w-[420px]">
              <span className="mb-3 block h-[3px] w-8 rounded-full bg-[#7f48ff]" />
              <h1 className="text-[36px] font-semibold uppercase leading-none tracking-[0.12em] text-[#162a59] sm:text-[40px]">
                ABOUT <span className="text-[#7a4bff]">US</span>
              </h1>
              <h2 className="mt-4 text-[18px] font-semibold leading-[1.3] text-[#1b2f60] sm:text-[20px]">
                Empowering Sri Lankan Students
                <br />
                to Build a Brighter Future
              </h2>
              <p className="mt-4 text-[15px] leading-6 text-[#2f4a74]">
                Exam.lk is an innovative online learning platform dedicated to helping students across Sri Lanka achieve their academic goals. We provide high-quality study materials, past papers, model papers, and expert resources for all grades and examination levels.
              </p>
              <p className="mt-3 text-[15px] leading-6 text-[#2f4a74]">Our mission is to make learning easier, more accessible and more effective — anytime, anywhere.</p>
            </div>

            <div className="relative pb-10">
              <div className="overflow-hidden rounded-[20px] bg-white shadow-[0_10px_28px_rgba(27,86,179,0.14)]">
                <Image
                  src="/images/Exam-about-us-upscaled.png"
                  alt="Students learning together"
                  width={380}
                  height={260}
                  className="h-auto w-full object-cover"
                />
              </div>
              <p className="absolute bottom-0 right-2 -rotate-12 text-right font-serif text-[20px] italic leading-[1.1] text-[#1b2f60]">
                Learn Today
                <br />
                Lead Tomorrow
                <span className="mt-1 block h-[2px] w-full rounded bg-[#7a4bff]" />
              </p>
            </div>
          </article>

          <article className="mt-6 grid gap-3 rounded-[18px] border border-[#dbe8fb] bg-[linear-gradient(180deg,#f8fbff_0%,#f2f8ff_100%)] p-4 shadow-[0_8px_24px_rgba(32,87,171,0.10)] sm:grid-cols-2 lg:grid-cols-4 lg:p-5">
            <div className="flex flex-col items-center text-center border-[#d8e4f8] lg:border-r">
              <span className="inline-flex h-9 w-9 items-center justify-center text-[#5b45ff]">
                <Users className="h-7 w-7" fill="currentColor" />
              </span>
              <div className="mt-1">
                <p className="text-[28px] font-bold leading-none text-[#1b2f60]">50,000+</p>
                <p className="mt-1 text-[14px] text-[#4c6690]">Active Students</p>
              </div>
            </div>

            <div className="flex flex-col items-center text-center border-[#d8e4f8] lg:border-r">
              <span className="inline-flex h-9 w-9 items-center justify-center text-[#4f73ff]">
                <BookOpenText className="h-7 w-7" />
              </span>
              <div className="mt-1">
                <p className="text-[28px] font-bold leading-none text-[#1b2f60]">5,000+</p>
                <p className="mt-1 text-[14px] text-[#4c6690]">Study Materials</p>
              </div>
            </div>

            <div className="flex flex-col items-center text-center border-[#d8e4f8] lg:border-r">
              <span className="inline-flex h-9 w-9 items-center justify-center text-[#7a4bff]">
                <Star className="h-7 w-7" fill="currentColor" />
              </span>
              <div className="mt-1">
                <p className="text-[28px] font-bold leading-none text-[#1b2f60]">1,000+</p>
                <p className="mt-1 text-[14px] text-[#4c6690]">Past Papers &amp; Model Papers</p>
              </div>
            </div>

            <div className="flex flex-col items-center text-center">
              <span className="inline-flex h-9 w-9 items-center justify-center text-[#3185ff]">
                <GraduationCap className="h-7 w-7" />
              </span>
              <div className="mt-1">
                <p className="text-[28px] font-bold leading-none text-[#1b2f60]">100%</p>
                <p className="mt-1 text-[14px] text-[#4c6690]">Free Access to Quality Resources</p>
              </div>
            </div>
          </article>

          <article className="mt-8 grid gap-6 lg:grid-cols-3 lg:gap-0">
            <div className="flex items-start gap-4 lg:border-r lg:border-[#dfe8f5] lg:pr-8">
              <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[radial-gradient(circle,#ead9ff_0%,#f5edff_100%)] text-[#7a4bff]">
                <Target className="h-7 w-7" strokeWidth={2.5} />
              </span>
              <div>
                <h3 className="text-[20px] font-semibold text-[#1b2f60]">Our Mission</h3>
                <p className="mt-3 text-[14px] leading-6 text-[#2f4a74]">
                  To provide accessible, high-quality and comprehensive learning resources that empower every Sri Lankan student to achieve academic success.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 lg:border-r lg:border-[#dfe8f5] lg:px-8">
              <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[radial-gradient(circle,#cfe5ff_0%,#e8f3ff_100%)] text-[#2d6ff2]">
                <Eye className="h-7 w-7" strokeWidth={2.5} />
              </span>
              <div>
                <h3 className="text-[20px] font-semibold text-[#1b2f60]">Our Vision</h3>
                <p className="mt-3 text-[14px] leading-6 text-[#2f4a74]">
                  To be the most trusted and widely used online learning platform in Sri Lanka, helping students reach their full potential and build a better future.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 lg:pl-8">
              <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[radial-gradient(circle,#ead9ff_0%,#f5edff_100%)] text-[#7a4bff]">
                <Heart className="h-7 w-7" fill="currentColor" />
              </span>
              <div>
                <h3 className="text-[20px] font-semibold text-[#1b2f60]">Our Values</h3>
                <ul className="mt-3 space-y-1.5 text-[14px] text-[#2f4a74]">
                  <li className="flex items-center gap-3"><Check className="h-4 w-4 text-[#7a4bff]" strokeWidth={3} />Quality Education</li>
                  <li className="flex items-center gap-3"><Check className="h-4 w-4 text-[#7a4bff]" strokeWidth={3} />Equal Access</li>
                  <li className="flex items-center gap-3"><Check className="h-4 w-4 text-[#7a4bff]" strokeWidth={3} />Student Success</li>
                  <li className="flex items-center gap-3"><Check className="h-4 w-4 text-[#7a4bff]" strokeWidth={3} />Continuous Improvement</li>
                </ul>
              </div>
            </div>
          </article>
        </div>
      </section>
    </HomeBaseTemplate>
  );
}
