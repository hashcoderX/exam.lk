import { HomeBaseTemplate } from "../components/home-base-template";
import Image from "next/image";
import { List, MessageSquare, Phone, User } from "lucide-react";

export default function ContactUsPage() {
  return (
    <HomeBaseTemplate>
      <section className="bg-[radial-gradient(110%_120%_at_0%_0%,#eef6ff_0%,#f8fbff_45%,#eef5ff_100%)] py-10 sm:py-14">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-12">
            <div
              className="relative overflow-hidden lg:col-span-7"
              style={{
                backgroundImage: "url('/images/Exam-about-us-upscaled.png')",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "left top",
                backgroundSize: "90% auto",
              }}
            >
              <div className="relative min-h-[300px]  p-5 sm:min-h-[430px] sm:p-8">
                <div className="ml-auto max-w-[180px] pt-2 sm:absolute sm:right-6 sm:top-10 sm:max-w-[200px] sm:pt-0">
                  <h1 className="text-[24px] font-semibold leading-[0.9] tracking-[0.16em] text-[#162457] sm:text-[30px]">CONTACT</h1>
                  <h2 className="mt-1 text-[20px] font-semibold leading-[0.9] tracking-[0.08em] text-[#7a4bff] sm:text-[24px]">US</h2>
                  <span className="mt-3 block h-[3px] w-12 rounded bg-[#925cff]" />
                  <p className="mt-5 max-w-[290px] text-[14px] leading-[1.5] text-[#314f7d] sm:text-[16px]">
                    We are here to help. Have a question, feedback, or need assistance? Get in touch with us.
                  </p>
                </div>
              </div>

              <div className="grid gap-3  px-4 py-5 sm:grid-cols-3 sm:px-6">
                <article className="sm:border-r sm:border-[#deebfb] sm:pr-4">
                  <div className="mb-3 inline-flex h-15 w-15 items-center justify-center rounded-full bg-[#e8f1ff] text-[#2b78e8]">
                    <Phone className="h-5 w-5" />
                  </div>
                  <h3 className="text-[16px] font-semibold text-[#233a66]">Call Us</h3>
                  <p className="mt-1 text-[14px] text-[#3f5d8a]">+94 11 2 345 678</p>
                  <p className="mt-2 text-[13px] text-[#7089af]">Mon - Fri, 9:00 AM - 5:00 PM</p>
                </article>

                <article className="sm:border-r sm:border-[#deebfb] sm:px-4">
                  <div className="mb-3 inline-flex h-15 w-15 items-center justify-center rounded-full bg-[#e8f1ff] text-[#2b78e8]">
                    <Image src="/icons/contact_us_icons/email.png" alt="Email" width={20} height={20} className="h-5 w-5 object-contain" />
                  </div>
                  <h3 className="text-[16px] font-semibold text-[#233a66]">Email Us</h3>
                  <p className="mt-1 text-[14px] text-[#3f5d8a]">support@exam.lk</p>
                  <p className="mt-2 text-[13px] text-[#7089af]">We reply within 24 hours</p>
                </article>

                <article className="sm:pl-4">
                  <div className="mb-3 inline-flex h-15 w-15 items-center justify-center rounded-full bg-[#e8f1ff] text-[#2b78e8]">
                    <Image src="/icons/contact_us_icons/location.png" alt="Location" width={20} height={20} className="h-5 w-5 object-contain" />
                  </div>
                  <h3 className="text-[16px] font-semibold text-[#233a66]">Visit Us</h3>
                  <p className="mt-1 text-[14px] leading-snug text-[#3f5d8a]">No. 123, Galle Road, Colombo 03, Sri Lanka</p>
                  <p className="mt-2 text-[13px] text-[#7089af]">Mon - Fri, 9:00 AM - 5:00 PM</p>
                </article>
              </div>
            </div>

            <div className="rounded-[24px] border border-[#cde0fb] bg-white p-6 shadow-[0_12px_30px_rgba(28,72,135,0.13)] sm:p-7 lg:col-span-5">
              <div className="mb-5 flex items-start gap-3">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#eaf3ff] text-[#2b78e8]">
                  <Image src="/icons/contact_us_icons/send-png.png" alt="Send" width={20} height={20} className="h-5 w-5 object-contain" />
                </span>
                <div>
                  <h2 className="text-[39px] font-semibold text-[#1f8bf0]">Send us a Message</h2>
                  <p className="mt-1 text-[14px] leading-6 text-[#5677a4]">
                    Fill out the form below and our support team will get back to you as soon as possible.
                  </p>
                </div>
              </div>

              <form className="space-y-4" action="#" method="post">
                <label className="block">
                  <span className="mb-1 block text-[15px] font-medium text-[#22416f]">Your Name *</span>
                  <span className="flex h-12 items-center gap-2 rounded-xl border border-[#cfe0f8] bg-white px-3">
                    <User className="h-4 w-4 text-[#7c97ba]" />
                    <input type="text" placeholder="Enter your full name" className="w-full text-[15px] text-[#2f4c79] outline-none placeholder:text-[#9bb2d0]" />
                  </span>
                </label>

                <label className="block">
                  <span className="mb-1 block text-[15px] font-medium text-[#22416f]">Email Address *</span>
                  <span className="flex h-12 items-center gap-2 rounded-xl border border-[#cfe0f8] bg-white px-3">
                    <Image src="/icons/contact_us_icons/email.png" alt="Email" width={16} height={16} className="h-4 w-4 object-contain" />
                    <input type="email" placeholder="Enter your email address" className="w-full text-[15px] text-[#2f4c79] outline-none placeholder:text-[#9bb2d0]" />
                  </span>
                </label>

                <label className="block">
                  <span className="mb-1 block text-[15px] font-medium text-[#22416f]">Phone Number (Optional)</span>
                  <span className="flex h-12 items-center gap-2 rounded-xl border border-[#cfe0f8] bg-white px-3">
                    <Phone className="h-4 w-4 text-[#7c97ba]" />
                    <input type="tel" placeholder="Enter your phone number" className="w-full text-[15px] text-[#2f4c79] outline-none placeholder:text-[#9bb2d0]" />
                  </span>
                </label>

                <label className="block">
                  <span className="mb-1 block text-[15px] font-medium text-[#22416f]">Subject *</span>
                  <span className="flex h-12 items-center gap-2 rounded-xl border border-[#cfe0f8] bg-white px-3">
                    <List className="h-4 w-4 text-[#7c97ba]" />
                    <select className="w-full bg-transparent text-[15px] text-[#2f4c79] outline-none">
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="listing">Exam Listing Support</option>
                      <option value="technical">Technical Issue</option>
                      <option value="billing">Billing</option>
                    </select>
                  </span>
                </label>

                <label className="block">
                  <span className="mb-1 block text-[15px] font-medium text-[#22416f]">Your Message *</span>
                  <span className="flex gap-2 rounded-xl border border-[#cfe0f8] bg-white px-3 py-2">
                    <MessageSquare className="mt-1 h-4 w-4 text-[#7c97ba]" />
                    <textarea rows={4} placeholder="Type your message here..." className="w-full resize-none text-[15px] text-[#2f4c79] outline-none placeholder:text-[#9bb2d0]" />
                  </span>
                </label>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(90deg,#1f8bf0_0%,#1464e3_100%)] px-5 py-3 text-[18px] font-semibold text-white transition hover:brightness-110"
                >
                  <Image src="/icons/contact_us_icons/send-png.png" alt="Send" width={16} height={16} className="h-4 w-4 object-contain" />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </HomeBaseTemplate>
  );
}
