"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CircleHelp, Eye, EyeOff } from "lucide-react";

type ApiError = {
  message?: string;
  errors?: Record<string, string[] | string>;
  data?: {
    full_name?: string;
  };
};

type SignupForm = {
  first_name: string;
  surname: string;
  birth_day: string;
  birth_month: string;
  birth_year: string;
  gender: string;
  contact: string;
  password: string;
};

function flattenErrors(errors?: Record<string, string[] | string>): string[] {
  if (!errors) {
    return [];
  }

  const messages: string[] = [];

  Object.values(errors).forEach((value) => {
    if (Array.isArray(value)) {
      value.forEach((item) => messages.push(String(item)));
      return;
    }

    messages.push(String(value));
  });

  return messages;
}

const initialForm: SignupForm = {
  first_name: "",
  surname: "",
  birth_day: "",
  birth_month: "",
  birth_year: "",
  gender: "",
  contact: "",
  password: "",
};

type AuthMode = "signin" | "join";

export function SignupFormCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryMode = searchParams.get("mode");
  const initialMode: AuthMode = queryMode === "join" ? "join" : "signin";

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [form, setForm] = useState<SignupForm>(initialForm);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const updateField = (field: keyof SignupForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessMessage("");
    setErrorMessages([]);

    if (!identifier.trim() || !password.trim()) {
      setErrorMessages(["Mobile number or email address and password are required."]);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/guest/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: identifier.trim(),
          password,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as ApiError;

      if (!response.ok) {
        setErrorMessages([
          ...(data.message ? [data.message] : ["Unable to sign in."]),
          ...flattenErrors(data.errors),
        ]);
        return;
      }

      const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7;
      document.cookie = `guest_session=1; Path=/; Max-Age=${maxAge}; SameSite=Lax`;

      if (data.data?.full_name) {
        document.cookie = `guest_name=${encodeURIComponent(data.data.full_name)}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
      }

      router.push("/guest/dashboard");
      router.refresh();
    } catch {
      setErrorMessages(["Unable to sign in right now. Please try again."]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessMessage("");
    setErrorMessages([]);

    const requiredFields: Array<keyof SignupForm> = ["first_name", "surname", "birth_day", "birth_month", "birth_year", "gender", "contact", "password"];
    const hasMissing = requiredFields.some((field) => !form[field].trim());

    if (hasMissing) {
      setErrorMessages(["Please fill out all required fields."]);
      return;
    }

    if (form.password.trim().length < 8) {
      setErrorMessages(["Password must be at least 8 characters."]);
      return;
    }

    const cleanContact = form.contact.trim();
    const isEmail = cleanContact.includes("@");
    const fullName = `${form.first_name.trim()} ${form.surname.trim()}`.replace(/\s+/g, " ").trim();
    const userSlug = `${form.first_name}${form.surname}`.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() || "examuser";
    const randomSuffix = `${Date.now()}`.slice(-6);
    const generatedUserId = `${userSlug}${randomSuffix}`;
    const generatedEmail = isEmail ? cleanContact : `${generatedUserId}@exam.lk`;
    const generatedContactNo = isEmail ? "0700000000" : cleanContact;
    const generatedAddress = `DOB: ${form.birth_day}/${form.birth_month}/${form.birth_year}; Gender: ${form.gender}`;

    setLoading(true);

    try {
      const response = await fetch("/api/guest/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: fullName,
          email: generatedEmail,
          contact_no: generatedContactNo,
          address: generatedAddress,
          user_id: generatedUserId,
          password: form.password,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as ApiError;

      if (!response.ok) {
        setErrorMessages([
          ...(data.message ? [data.message] : ["Unable to create account."]),
          ...flattenErrors(data.errors),
        ]);
        return;
      }

      setSuccessMessage("Account created successfully. Redirecting to sign in...");
      setForm(initialForm);

      window.setTimeout(() => {
        setMode("signin");
        router.push("/signup?mode=signin");
      }, 900);
    } catch {
      setErrorMessages(["Unable to register right now. Please try again."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[14px] border border-[#d9e2ef] bg-white p-4 shadow-[0_12px_36px_rgba(20,63,121,0.12)] sm:p-5 lg:col-span-5">
      {mode === "signin" ? (
        <div className="mb-4">
          <h2 className="text-[24px] font-semibold leading-tight text-[#1f73ea]">Welcome Back to Exam.lk</h2>
          <p className="mt-2 text-[13px] leading-5 text-[#4f668a]">
            Sign in to your Exam.lk account to access learning resources, courses, exams and educational opportunities in one place.
          </p>
        </div>
      ) : null}

      {successMessage ? <p className="mb-4 rounded-lg border border-[#c7dfc8] bg-[#edf8ed] px-3 py-2 text-[13px] text-[#44744a]">{successMessage}</p> : null}
      {errorMessages.length ? (
        <div className="mb-4 rounded-lg border border-[#efcccc] bg-[#fff3f3] px-3 py-2 text-[13px] text-[#a44747]">
          {errorMessages.map((message) => (
            <p key={message}>{message}</p>
          ))}
        </div>
      ) : null}

      {mode === "signin" ? (
        <form className="space-y-4" onSubmit={handleSignIn}>
          <label className="block">
            <span className="mb-1.5 block text-[15px] font-semibold text-[#2c3f60]">Mobile number or email address</span>
            <input
              type="text"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              placeholder="Mobile number or email address"
              className="h-11 w-full rounded-[11px] border border-[#d7e0ec] px-4 text-[14px] text-[#334e79] outline-none placeholder:text-[#9fb0c8] focus-visible:border-[#6ca2ee]"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[15px] font-semibold text-[#2c3f60]">Password</span>
            <span className="flex h-11 items-center rounded-[11px] border border-[#d7e0ec] px-3 focus-within:border-[#6ca2ee]">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                className="w-full text-[14px] text-[#334e79] outline-none placeholder:text-[#9fb0c8]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="inline-flex h-7 w-7 items-center justify-center text-[#7f91ae]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </span>
          </label>

          <div className="flex items-center justify-between text-[13px]">
            <label className="inline-flex items-center gap-2 text-[#4c6385]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
                className="h-4 w-4 rounded border-[#c6d2e4]"
              />
              Remember me
            </label>

            <Link href="/help-center" className="font-semibold text-[#1c72e8] hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-full bg-[linear-gradient(90deg,#1f7df4_0%,#0f67da_100%)] text-[20px] font-medium text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("join");
              router.push("/signup?mode=join");
            }}
            className="h-10 w-full rounded-full bg-[#eef2f7] text-[19px] font-medium text-[#31445f] transition hover:bg-[#e7edf6]"
          >
            Create a new account
          </button>

          <p className="text-center text-[14px] text-[#607497]">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => {
                setMode("join");
                router.push("/signup?mode=join");
              }}
              className="font-semibold text-[#1c72e8] hover:underline"
            >
              Create one
            </button>
          </p>
        </form>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="mb-2">
            <h2 className="text-[20px] font-medium leading-[1.2] text-[#3478e5] sm:text-[22px]">Create your Exam_lk Account</h2>
            <p className="mt-2 text-[14px] leading-[1.4] text-[#232a35]">Create your exam.lk Account to access learning resources, courses, exams and educational opportunities in one place.</p>
          </div>

          <div>
            <label className="mb-2 block text-[18px] font-semibold text-[#1f2630]">Name</label>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="text"
                value={form.first_name}
                onChange={(event) => updateField("first_name", event.target.value)}
                placeholder="First name"
                className="h-14 rounded-[16px] border border-[#c8d1e0] px-4 text-[16px] text-[#34435b] outline-none placeholder:text-[#657181] focus-visible:border-[#5d90da]"
              />
              <input
                type="text"
                value={form.surname}
                onChange={(event) => updateField("surname", event.target.value)}
                placeholder="Surname"
                className="h-14 rounded-[16px] border border-[#c8d1e0] px-4 text-[16px] text-[#34435b] outline-none placeholder:text-[#657181] focus-visible:border-[#5d90da]"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-[18px] font-semibold text-[#1f2630]">
              Date of birth
              <CircleHelp className="h-5 w-5 text-[#1f2630]" />
            </label>
            <div className="grid gap-3 sm:grid-cols-3">
              <select
                value={form.birth_day}
                onChange={(event) => updateField("birth_day", event.target.value)}
                className="h-14 rounded-[16px] border border-[#c8d1e0] bg-white px-4 text-[16px] text-[#59657a] outline-none"
              >
                <option value="">Day</option>
                {Array.from({ length: 31 }, (_, index) => String(index + 1)).map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>

              <select
                value={form.birth_month}
                onChange={(event) => updateField("birth_month", event.target.value)}
                className="h-14 rounded-[16px] border border-[#c8d1e0] bg-white px-4 text-[16px] text-[#59657a] outline-none"
              >
                <option value="">Month</option>
                {[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map((month, index) => (
                  <option key={month} value={String(index + 1)}>
                    {month}
                  </option>
                ))}
              </select>

              <select
                value={form.birth_year}
                onChange={(event) => updateField("birth_year", event.target.value)}
                className="h-14 rounded-[16px] border border-[#c8d1e0] bg-white px-4 text-[16px] text-[#59657a] outline-none"
              >
                <option value="">Year</option>
                {Array.from({ length: 90 }, (_, index) => String(new Date().getFullYear() - index)).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-[18px] font-semibold text-[#1f2630]">
              Gender
              <CircleHelp className="h-5 w-5 text-[#1f2630]" />
            </label>
            <select
              value={form.gender}
              onChange={(event) => updateField("gender", event.target.value)}
              className="h-14 w-full rounded-[16px] border border-[#c8d1e0] bg-white px-4 text-[16px] text-[#59657a] outline-none"
            >
              <option value="">Select your gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-[18px] font-semibold text-[#1f2630]">Mobile number or email address</label>
            <input
              type="text"
              value={form.contact}
              onChange={(event) => updateField("contact", event.target.value)}
              placeholder="Mobile number or email address"
              className="h-14 w-full rounded-[16px] border border-[#c8d1e0] px-4 text-[16px] text-[#34435b] outline-none placeholder:text-[#657181] focus-visible:border-[#5d90da]"
            />
            <p className="mt-2 text-[13px] leading-[1.4] text-[#283245]">
              We may use your contact information to send important account updates and learning-related notifications. Learn more.{" "}
              <span className="font-semibold text-[#1767d2]">Learn why we ask for your contact information</span>
            </p>
          </div>

          <div>
            <label className="mb-2 block text-[18px] font-semibold text-[#1f2630]">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(event) => updateField("password", event.target.value)}
              placeholder="Password"
              className="h-14 w-full rounded-[16px] border border-[#ff3658] px-4 text-[16px] text-[#f02549] outline-none placeholder:text-[#f02549]"
            />
          </div>

          <p className="text-[13px] leading-[1.4] text-[#283245]">
            By tapping Create Account, you agree to create an exam.lk Account and accept our Terms of Service and Privacy Policy.
            <span className="font-semibold text-[#1767d2]">Terms</span>, <span className="font-semibold text-[#1767d2]">Privacy Policy</span> and
            <span className="font-semibold text-[#1767d2]"> Cookies Policy</span>.
          </p>

          <p className="text-[13px] leading-[1.4] text-[#283245]">
            The <span className="font-semibold text-[#1767d2]">Privacy Policy</span> Your information helps us provide and improve your learning experience, including personalized educational resources, courses, exams and other platform services.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-full bg-[#1a66cf] text-[20px] font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("signin");
              router.push("/signup?mode=signin");
            }}
            className="h-10 w-full rounded-full bg-[#eef2f7] text-[19px] font-medium text-[#2e3e56] transition hover:bg-[#e7edf6]"
          >
            I already have an account
          </button>
        </form>
      )}
    </div>
  );
}