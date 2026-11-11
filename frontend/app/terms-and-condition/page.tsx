import { InnerPageTemplate } from "../components/inner-page-template";

export default function TermsAndConditionPage() {
  return (
    <InnerPageTemplate
      title="Terms & Condition"
      subtitle="By using Exam.lk, you agree to follow the terms below."
      sections={[
        {
          title: "Platform Use",
          content: (
            <ul className="list-disc space-y-1 pl-5">
              <li>Use the platform only for lawful and ethical purposes.</li>
              <li>Do not publish false, harmful, or misleading exam information.</li>
              <li>Respect intellectual property and content ownership rights.</li>
            </ul>
          ),
        },
        {
          title: "User Responsibility",
          content: (
            <ul className="list-disc space-y-1 pl-5">
              <li>You are responsible for content uploaded from your account.</li>
              <li>Keep login credentials secure and do not share your account.</li>
              <li>Verify official notices before making financial or educational decisions.</li>
            </ul>
          ),
        },
        {
          title: "Service Changes",
          content: (
            <p>
              Exam.lk may update features, policies, or these terms when needed. Continued use after updates means you accept the revised terms.
            </p>
          ),
        },
      ]}
    />
  );
}
