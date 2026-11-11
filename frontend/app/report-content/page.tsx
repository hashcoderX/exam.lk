import { InnerPageTemplate } from "../components/inner-page-template";

export default function ReportContentPage() {
  return (
    <InnerPageTemplate
      title="Report Content"
      subtitle="If you find incorrect, abusive, or copyright-sensitive material, report it for review."
      sections={[
        {
          title: "What to Report",
          content: (
            <ul className="list-disc space-y-1 pl-5">
              <li>Incorrect exam details, dates, or contact information</li>
              <li>Misleading or fraudulent listing content</li>
              <li>Harassment, abuse, or policy-violating submissions</li>
              <li>Potential copyright infringement</li>
            </ul>
          ),
        },
        {
          title: "How to Report",
          content: (
            <ol className="list-decimal space-y-1 pl-5">
              <li>Copy the listing URL and title.</li>
              <li>Describe the issue with clear evidence.</li>
              <li>Send details to support@exam.lk with subject "Content Report".</li>
            </ol>
          ),
        },
      ]}
    />
  );
}
