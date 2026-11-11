import { InnerPageTemplate } from "../components/inner-page-template";
import Link from "next/link";

export default function HelpCenterPage() {
  return (
    <InnerPageTemplate
      title="Help Center"
      subtitle="Find quick guidance for common tasks and issues when using Exam.lk."
      sections={[
        {
          title: "Popular Help Topics",
          content: (
            <ul className="list-disc space-y-1 pl-5">
              <li><Link href="/how-to-download" className="text-[#3b6fa5] hover:underline">How to Download</Link></li>
              <li><Link href="/faq" className="text-[#3b6fa5] hover:underline">Frequently Asked Questions</Link></li>
              <li><Link href="/report-content" className="text-[#3b6fa5] hover:underline">Report Content</Link></li>
              <li><Link href="/contact-us" className="text-[#3b6fa5] hover:underline">Contact Support Team</Link></li>
            </ul>
          ),
        },
        {
          title: "Account and Listing Assistance",
          content: (
            <p>
              If you cannot access your account, upload files, or publish listings, contact support with your account email and a brief problem summary.
            </p>
          ),
        },
      ]}
    />
  );
}
