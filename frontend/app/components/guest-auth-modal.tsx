"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Mode = "signin" | "join";

type ApiError = {
  message?: string;
  errors?: Record<string, string[] | string>;
  data?: {
    full_name?: string;
  };
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

export function GuestAuthModal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const authParam = searchParams.get("auth");
  const nextParam = searchParams.get("next");
  const initialMode: Mode = authParam === "join" ? "join" : "signin";
  const shouldOpenInitially = authParam === "signin" || authParam === "join";
  const safeNextPath = nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//")
    ? nextParam
    : "/guest/dashboard";
  const [open, setOpen] = useState(shouldOpenInitially);
  const [mode, setMode] = useState<Mode>(initialMode);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const [identifier, setIdentifier] = useState("");
  const [signinPassword, setSigninPassword] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [address, setAddress] = useState("");
  const [userId, setUserId] = useState("");
  const [joinPassword, setJoinPassword] = useState("");

  const title = useMemo(() => (mode === "signin" ? "Guest Sign In" : "Guest Join"), [mode]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  const openModal = (nextMode: Mode) => {
    setMode(nextMode);
    setSuccessMessage("");
    setErrorMessages([]);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setLoading(false);
  };

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessMessage("");
    setErrorMessages([]);

    if (!identifier.trim() || !signinPassword.trim()) {
      setErrorMessages(["User ID/Email and password are required."]);
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
          password: signinPassword,
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

      document.cookie = "guest_session=1; Path=/; Max-Age=604800; SameSite=Lax";
      if (data.data?.full_name) {
        document.cookie = `guest_name=${encodeURIComponent(data.data.full_name)}; Path=/; Max-Age=604800; SameSite=Lax`;
      }
      setSuccessMessage("Sign in successful.");
      closeModal();
      router.push(safeNextPath);
      router.refresh();
    } catch {
      setErrorMessages(["Unable to sign in right now. Please try again."]);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessMessage("");
    setErrorMessages([]);

    if (!fullName.trim() || !email.trim() || !contactNo.trim() || !address.trim() || !userId.trim() || !joinPassword.trim()) {
      setErrorMessages(["All fields are required to join as guest."]);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/guest/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: fullName.trim(),
          email: email.trim(),
          contact_no: contactNo.trim(),
          address: address.trim(),
          user_id: userId.trim(),
          password: joinPassword,
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

      setSuccessMessage("Guest account created successfully. You can now sign in.");
      setMode("signin");
      setIdentifier(userId.trim());
      setSigninPassword("");
    } catch {
      setErrorMessages(["Unable to register right now. Please try again."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-[11px]">
        <button type="button" onClick={() => openModal("signin")} className="text-[#8b8b8b] hover:text-[#555]">
          Sign in
        </button>
        <span className="px-1">|</span>
        <button type="button" onClick={() => openModal("join")} className="text-[#8b8b8b] hover:text-[#555]">
          Join
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 py-6" onClick={closeModal}>
          <div
            className="w-full max-w-[560px] rounded-[8px] border border-[#d6d6d6] bg-[#f8f8f8] p-4 text-[#666] shadow-[0_10px_28px_rgba(0,0,0,0.22)] sm:p-5"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            <div className="mb-4 flex items-center justify-between border-b border-[#dfdfdf] pb-2">
              <h2 className="text-[18px] font-semibold tracking-[0.02em] text-[#4f4f4f]">{title}</h2>
              <button
                type="button"
                onClick={closeModal}
                className="border border-[#cfcfcf] bg-white px-2 py-0.5 text-[11px] text-[#7a7a7a] transition hover:bg-[#f3f3f3] hover:text-[#4f4f4f]"
                aria-label="Close modal"
              >
                x
              </button>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-1 border border-[#dddddd] bg-white p-1">
              <button
                type="button"
                onClick={() => setMode("signin")}
                className={`px-3 py-1.5 text-[12px] font-semibold transition ${mode === "signin" ? "bg-[#f0be52] text-[#5b4b2b]" : "text-[#777] hover:bg-[#f7f7f7] hover:text-[#4f4f4f]"}`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode("join")}
                className={`px-3 py-1.5 text-[12px] font-semibold transition ${mode === "join" ? "bg-[#f0be52] text-[#5b4b2b]" : "text-[#777] hover:bg-[#f7f7f7] hover:text-[#4f4f4f]"}`}
              >
                Join
              </button>
            </div>

            {successMessage ? <p className="mb-4 border border-[#c7dfc8] bg-[#edf8ed] px-3 py-2 text-[12px] text-[#44744a]">{successMessage}</p> : null}
            {errorMessages.length ? (
              <div className="mb-4 border border-[#efcccc] bg-[#fff3f3] px-3 py-2 text-[12px] text-[#a44747]">
                {errorMessages.map((message) => (
                  <p key={message}>{message}</p>
                ))}
              </div>
            ) : null}

            {mode === "signin" ? (
              <form className="space-y-4" onSubmit={handleSignIn}>
                <div>
                  <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.04em] text-[#8a8a8a]" htmlFor="modal-identifier">
                    User ID or Email
                  </label>
                  <input
                    id="modal-identifier"
                    className="h-9 w-full border border-[#d3d3d3] bg-white px-3 text-[13px] text-[#555] outline-none focus-visible:border-[#c7a45a]"
                    value={identifier}
                    onChange={(event) => setIdentifier(event.target.value)}
                    placeholder="Enter user ID or email"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.04em] text-[#8a8a8a]" htmlFor="modal-signin-password">
                    Password
                  </label>
                  <input
                    id="modal-signin-password"
                    type="password"
                    className="h-9 w-full border border-[#d3d3d3] bg-white px-3 text-[13px] text-[#555] outline-none focus-visible:border-[#c7a45a]"
                    value={signinPassword}
                    onChange={(event) => setSigninPassword(event.target.value)}
                    placeholder="Enter password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="h-9 w-full border border-[#dcae42] bg-[#f0be52] text-[12px] font-bold text-[#4f4329] transition hover:bg-[#e9b647] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>
            ) : (
              <form className="space-y-4" onSubmit={handleJoin}>
                <div>
                  <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.04em] text-[#8a8a8a]" htmlFor="modal-full-name">
                    Full Name
                  </label>
                  <input
                    id="modal-full-name"
                    className="h-9 w-full border border-[#d3d3d3] bg-white px-3 text-[13px] text-[#555] outline-none focus-visible:border-[#c7a45a]"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.04em] text-[#8a8a8a]" htmlFor="modal-email">
                    Email
                  </label>
                  <input
                    id="modal-email"
                    type="email"
                    className="h-9 w-full border border-[#d3d3d3] bg-white px-3 text-[13px] text-[#555] outline-none focus-visible:border-[#c7a45a]"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.04em] text-[#8a8a8a]" htmlFor="modal-contact-no">
                    Contact No
                  </label>
                  <input
                    id="modal-contact-no"
                    className="h-9 w-full border border-[#d3d3d3] bg-white px-3 text-[13px] text-[#555] outline-none focus-visible:border-[#c7a45a]"
                    value={contactNo}
                    onChange={(event) => setContactNo(event.target.value)}
                    placeholder="Enter your contact number"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.04em] text-[#8a8a8a]" htmlFor="modal-address">
                    Address
                  </label>
                  <textarea
                    id="modal-address"
                    className="min-h-24 w-full border border-[#d3d3d3] bg-white px-3 py-2 text-[13px] text-[#555] outline-none focus-visible:border-[#c7a45a]"
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                    placeholder="Enter your address"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.04em] text-[#8a8a8a]" htmlFor="modal-user-id">
                    User ID
                  </label>
                  <input
                    id="modal-user-id"
                    className="h-9 w-full border border-[#d3d3d3] bg-white px-3 text-[13px] text-[#555] outline-none focus-visible:border-[#c7a45a]"
                    value={userId}
                    onChange={(event) => setUserId(event.target.value)}
                    placeholder="Choose a user ID"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.04em] text-[#8a8a8a]" htmlFor="modal-join-password">
                    Password
                  </label>
                  <input
                    id="modal-join-password"
                    type="password"
                    className="h-9 w-full border border-[#d3d3d3] bg-white px-3 text-[13px] text-[#555] outline-none focus-visible:border-[#c7a45a]"
                    value={joinPassword}
                    onChange={(event) => setJoinPassword(event.target.value)}
                    placeholder="Create a password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="h-9 w-full border border-[#dcae42] bg-[#f0be52] text-[12px] font-bold text-[#4f4329] transition hover:bg-[#e9b647] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Creating account..." : "Join as Guest"}
                </button>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
