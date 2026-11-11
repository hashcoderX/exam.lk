import { InnerPageTemplate } from "../components/inner-page-template";

export default function PrivacyPolicyPage() {
  return (
    <InnerPageTemplate
      title="Privacy Policy"
      subtitle="This policy explains how Exam.lk collects, uses, and protects user information."
      sections={[
        {
          title: "Information We Collect",
          content: (
            <ul className="list-disc space-y-1 pl-5">
              <li>Account details such as name and email address</li>
              <li>Uploaded listing assets such as posters and documents</li>
              <li>Basic usage logs for security and performance monitoring</li>
            </ul>
          ),
        },
        {
          title: "How We Use Data",
          content: (
            <ul className="list-disc space-y-1 pl-5">
              <li>To provide and maintain platform functionality</li>
              <li>To improve support quality and user experience</li>
              <li>To detect abuse, fraud, or policy violations</li>
            </ul>
          ),
        },
        {
          title: "Your Choices",
          content: (
            <p>
              You may request updates to your account information and contact support for data-related concerns. Continued platform use indicates
              acceptance of this privacy policy.
            </p>
          ),
        },
      ]}
    />
  );
}
