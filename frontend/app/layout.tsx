import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "exam.lk | Exams, Results, Past Papers and Education Resources",
  description:
    "Find Sri Lankan exams, results, past papers, education resources, tuition classes, and institute listings on exam.lk.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Script id="cleanup-fdprocessedid" strategy="beforeInteractive">
          {`
            (function () {
              function removeInjectedAttrs(root) {
                if (!root || !root.querySelectorAll) return;
                root.querySelectorAll('[fdprocessedid]').forEach(function (node) {
                  node.removeAttribute('fdprocessedid');
                });
              }

              removeInjectedAttrs(document);

              var observer = new MutationObserver(function () {
                removeInjectedAttrs(document);
              });

              observer.observe(document.documentElement, {
                attributes: true,
                childList: true,
                subtree: true,
              });
            })();
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
