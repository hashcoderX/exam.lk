import { InnerPageTemplate } from "../components/inner-page-template";

export default function DmcaPage() {
  return (
    <InnerPageTemplate
      title="DMCA"
      subtitle="Exam.lk respects copyright law and responds to valid infringement notifications."
      sections={[
        {
          title: "Submitting a Copyright Complaint",
          content: (
            <ul className="list-disc space-y-1 pl-5">
              <li>Provide your full name and contact information.</li>
              <li>Identify the copyrighted work and the infringing URL.</li>
              <li>Include a statement of good-faith belief and accuracy.</li>
            </ul>
          ),
        },
        {
          title: "Our Response Process",
          content: (
            <p>
              After receiving a complete notice, we review the request and may remove or restrict access to the reported content while verification is in progress.
            </p>
          ),
        },
      ]}
    />
  );
}
