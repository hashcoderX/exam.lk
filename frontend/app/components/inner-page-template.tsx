import type { ReactNode } from "react";
import { HomeBaseTemplate } from "./home-base-template";

export type InfoSection = {
  title: string;
  content: ReactNode;
};

type InnerPageTemplateProps = {
  title: string;
  subtitle: string;
  sections: InfoSection[];
};

export function InnerPageTemplate({ title, subtitle, sections }: InnerPageTemplateProps) {
  return (
    <HomeBaseTemplate>
      <section className="mx-auto max-w-[1020px] px-4 py-10">
        <div className="rounded-2xl border border-[#dce4ef] bg-white p-6 shadow-[0_8px_24px_rgba(21,41,75,0.08)] sm:p-8">
          <p className="text-[12px] uppercase tracking-[0.18em] text-[#7d92b2]">Exam.lk Information</p>
          <h1 className="mt-2 text-[32px] font-semibold leading-tight text-[#314663]">{title}</h1>
          <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-[#6f8099]">{subtitle}</p>
        </div>

        <div className="mt-5 space-y-4">
          {sections.map((section) => (
            <article key={section.title} className="rounded-2xl border border-[#e2e8f2] bg-white p-5 sm:p-6">
              <h2 className="text-[22px] font-medium text-[#3d5478]">{section.title}</h2>
              <div className="mt-2 text-[15px] leading-7 text-[#5f728f]">{section.content}</div>
            </article>
          ))}
        </div>
      </section>
    </HomeBaseTemplate>
  );
}
