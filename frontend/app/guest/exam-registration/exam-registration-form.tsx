"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";

type ExamOption = {
  id: number;
  title: string;
  deadline: string;
};

type ApiError = {
  message?: string;
  errors?: Record<string, string[] | string>;
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

export function ExamRegistrationForm({
  exams,
  initialExamId,
}: {
  exams: ExamOption[];
  initialExamId: string;
}) {
  const firstExamId = exams[0] ? String(exams[0].id) : "";
  const [examId, setExamId] = useState(initialExamId || firstExamId);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [nic, setNic] = useState("");
  const [address, setAddress] = useState("");
  const [inquiry, setInquiry] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const selectedExam = useMemo(
    () => exams.find((exam) => String(exam.id) === String(examId)),
    [examId, exams],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessMessage("");
    setErrorMessages([]);

    if (!examId || !dateOfBirth || !qualifications.trim() || !cvFile || !whatsappNumber.trim() || !mobileNumber.trim() || !nic.trim() || !address.trim()) {
      setErrorMessages(["Please fill all required fields and upload your CV."]);
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("exam_listing_id", examId);
      formData.append("date_of_birth", dateOfBirth);
      formData.append("qualifications", qualifications.trim());
      formData.append("cv", cvFile);
      formData.append("whatsapp_number", whatsappNumber.trim());
      formData.append("mobile_number", mobileNumber.trim());
      formData.append("nic", nic.trim());
      formData.append("address", address.trim());
      formData.append("inquiry", inquiry.trim());

      const response = await fetch("/api/guest/exam-inquiries", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json().catch(() => ({}))) as ApiError;

      if (!response.ok) {
        setErrorMessages([
          ...(data.message ? [data.message] : ["Unable to submit exam inquiry."]),
          ...flattenErrors(data.errors),
        ]);
        return;
      }

      setSuccessMessage("Your exam inquiry has been submitted successfully.");
      setDateOfBirth("");
      setQualifications("");
      setCvFile(null);
      setWhatsappNumber("");
      setMobileNumber("");
      setNic("");
      setAddress("");
      setInquiry("");
    } catch {
      setErrorMessages(["Unable to submit exam inquiry right now. Please try again."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-[#d8d8d8] bg-white p-4 sm:p-6">
      <div className="border-b border-[#e1e1e1] pb-3">
        <h2 className="text-[24px] font-light text-[#6d6d6d]">Exam inquiry form</h2>
        <p className="mt-1 text-[12px] text-[#9a9a9a]">Submit your inquiry and application details for the selected exam.</p>
      </div>

      {selectedExam ? (
        <div className="mt-4 rounded border border-[#e6e6e6] bg-[#fafafa] px-3 py-2 text-[12px] text-[#6f6f6f]">
          Selected exam: <span className="font-semibold text-[#4f4f4f]">{selectedExam.title}</span> (Deadline: {selectedExam.deadline})
        </div>
      ) : null}

      {successMessage ? <p className="mt-4 border border-[#c7dfc8] bg-[#edf8ed] px-3 py-2 text-[12px] text-[#44744a]">{successMessage}</p> : null}
      {errorMessages.length ? (
        <div className="mt-4 border border-[#efcccc] bg-[#fff3f3] px-3 py-2 text-[12px] text-[#a44747]">
          {errorMessages.map((message) => (
            <p key={message}>{message}</p>
          ))}
        </div>
      ) : null}

      <form className="mt-4 grid gap-4" onSubmit={handleSubmit}>
        <label className="grid gap-1 text-[12px]">
          <span className="font-semibold text-[#7c7c7c]">Exam</span>
          <select
            value={examId}
            onChange={(event) => setExamId(event.target.value)}
            className="h-9 border border-[#d7d7d7] px-3 outline-none focus:border-[#c9a65c]"
            disabled={exams.length === 0}
          >
            {exams.length === 0 ? <option value="">No published exams available</option> : null}
            {exams.map((exam) => (
              <option key={exam.id} value={String(exam.id)}>
                {exam.title}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1 text-[12px]">
          <span className="font-semibold text-[#7c7c7c]">Date of birth</span>
          <input
            type="date"
            value={dateOfBirth}
            onChange={(event) => setDateOfBirth(event.target.value)}
            className="h-9 border border-[#d7d7d7] px-3 outline-none focus:border-[#c9a65c]"
          />
        </label>

        <label className="grid gap-1 text-[12px]">
          <span className="font-semibold text-[#7c7c7c]">Qualifications</span>
          <textarea
            value={qualifications}
            onChange={(event) => setQualifications(event.target.value)}
            className="min-h-24 border border-[#d7d7d7] px-3 py-2 outline-none focus:border-[#c9a65c]"
            placeholder="Enter your qualifications"
          />
        </label>

        <label className="grid gap-1 text-[12px]">
          <span className="font-semibold text-[#7c7c7c]">CV (PDF/DOC/DOCX)</span>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(event) => setCvFile(event.target.files?.[0] ?? null)}
            className="h-9 border border-[#d7d7d7] px-2 py-1 text-[12px] outline-none focus:border-[#c9a65c]"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1 text-[12px]">
            <span className="font-semibold text-[#7c7c7c]">WhatsApp number</span>
            <input
              value={whatsappNumber}
              onChange={(event) => setWhatsappNumber(event.target.value)}
              className="h-9 border border-[#d7d7d7] px-3 outline-none focus:border-[#c9a65c]"
              placeholder="Enter WhatsApp number"
            />
          </label>

          <label className="grid gap-1 text-[12px]">
            <span className="font-semibold text-[#7c7c7c]">Mobile number</span>
            <input
              value={mobileNumber}
              onChange={(event) => setMobileNumber(event.target.value)}
              className="h-9 border border-[#d7d7d7] px-3 outline-none focus:border-[#c9a65c]"
              placeholder="Enter mobile number"
            />
          </label>
        </div>

        <label className="grid gap-1 text-[12px]">
          <span className="font-semibold text-[#7c7c7c]">NIC</span>
          <input
            value={nic}
            onChange={(event) => setNic(event.target.value)}
            className="h-9 border border-[#d7d7d7] px-3 outline-none focus:border-[#c9a65c]"
            placeholder="Enter NIC"
          />
        </label>

        <label className="grid gap-1 text-[12px]">
          <span className="font-semibold text-[#7c7c7c]">Address</span>
          <textarea
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            className="min-h-20 border border-[#d7d7d7] px-3 py-2 outline-none focus:border-[#c9a65c]"
            placeholder="Enter address"
          />
        </label>

        <label className="grid gap-1 text-[12px]">
          <span className="font-semibold text-[#7c7c7c]">Exam inquiry</span>
          <textarea
            value={inquiry}
            onChange={(event) => setInquiry(event.target.value)}
            className="min-h-24 border border-[#d7d7d7] px-3 py-2 outline-none focus:border-[#c9a65c]"
            placeholder="Ask anything about this exam"
          />
        </label>

        <div className="flex items-center gap-2 pt-1">
          <button
            type="submit"
            disabled={loading || exams.length === 0}
            className="rounded-sm border border-[#dcae42] bg-[#f0be52] px-5 py-2 text-[12px] font-bold text-[#4f4329] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Submitting..." : "Submit Inquiry"}
          </button>
          <Link href="/guest/exam-listings" className="rounded-sm border border-[#d4d4d4] bg-white px-4 py-2 text-[12px] text-[#666]">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
