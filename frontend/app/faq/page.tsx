import { InnerPageTemplate } from "../components/inner-page-template";

export default function FaqPage() {
  return (
    <InnerPageTemplate
      title="FAQ"
      subtitle="Answers to common questions from students, institutions, and visitors."
      sections={[
        {
          title: "General Questions",
          content: (
            <ul className="list-disc space-y-1 pl-5">
              <li><strong>Is Exam.lk free to use?</strong> Yes, browsing public exam listings is free.</li>
              <li><strong>How often are listings updated?</strong> Listings update whenever new notices are published by authorized users.</li>
              <li><strong>Can I trust every listing?</strong> Always verify official details on source documents before applying.</li>
            </ul>
          ),
        },
        {
          title: "Technical Questions",
          content: (
            <ul className="list-disc space-y-1 pl-5">
              <li><strong>Why can I not upload a file?</strong> Check format and file size limits first.</li>
              <li><strong>Why can I not log in?</strong> Confirm your credentials and reset password if needed.</li>
              <li><strong>How do I report an error?</strong> Use the Report Content page with the related listing URL.</li>
            </ul>
          ),
        },
      ]}
    />
  );
}
