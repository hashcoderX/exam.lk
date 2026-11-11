import { HomeBaseTemplate } from "../components/home-base-template";
import { SignupFormCard } from "./signup-form-card";

type SignupPageProps = {
  searchParams?: Promise<{
    mode?: string;
  }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const isJoinMode = params?.mode === "join";
  const primaryTitle = isJoinMode ? "SIGN" : "WELCOME";
  const secondaryTitle = isJoinMode ? "UP" : "BACK";

  return (
    <HomeBaseTemplate>
      <section className="bg-[radial-gradient(110%_120%_at_0%_0%,#eef6ff_0%,#f8fbff_45%,#eef5ff_100%)] py-10 sm:py-14">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-12">
            <div
              className="relative overflow-hidden lg:col-span-7"
              style={{
                backgroundImage: "url('/images/Exam-Sing-up.png')",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "left top",
                backgroundSize: "90% auto",
              }}
            >
              <div className="relative min-h-[300px] p-5 sm:min-h-[430px] sm:p-8">
                <div className="ml-auto max-w-[180px] pt-2 sm:absolute sm:right-6 sm:top-10 sm:max-w-[220px] sm:pt-0">
                  <h1 className="text-[24px] font-semibold leading-[0.9] tracking-[0.16em] text-[#162457] sm:text-[40px]">{primaryTitle}</h1>
                  <h2 className="mt-1 text-[20px] font-semibold leading-[0.9] tracking-[0.08em] text-[#7a4bff] sm:text-[40px]">{secondaryTitle}</h2>
                  <span className="mt-3 block h-[3px] w-12 rounded bg-[#925cff]" />
                </div>
              </div>

              
            </div>

            <SignupFormCard />
          </div>
        </div>
      </section>
    </HomeBaseTemplate>
  );
}