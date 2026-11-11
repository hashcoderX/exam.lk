import { InnerPageTemplate } from "../components/inner-page-template";

export default function HowToDownloadPage() {
  return (
    <InnerPageTemplate
      title="How To Download"
      subtitle="Follow these steps to download posters and application files from exam listings."
      sections={[
        {
          title: "Download Steps",
          content: (
            <ol className="list-decimal space-y-1 pl-5">
              <li>Open the relevant exam listing page.</li>
              <li>Check the listing details and verify the deadline.</li>
              <li>Click the application file or download action button.</li>
              <li>Save the file to your device and review the instructions.</li>
            </ol>
          ),
        },
        {
          title: "If Download Does Not Start",
          content: (
            <ul className="list-disc space-y-1 pl-5">
              <li>Try a different browser or refresh the page.</li>
              <li>Ensure pop-up blocking is disabled for Exam.lk.</li>
              <li>Contact support if the file link appears broken.</li>
            </ul>
          ),
        },
      ]}
    />
  );
}
