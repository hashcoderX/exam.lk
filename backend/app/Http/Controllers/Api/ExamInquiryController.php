<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ExamInquiry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ExamInquiryController extends Controller
{
    /**
     * Convert inquiry model into API response item.
     *
     * @return array<string, mixed>
     */
    private function toResponseItem(ExamInquiry $inquiry): array
    {
        return [
            'id' => $inquiry->id,
            'exam_listing_id' => $inquiry->exam_listing_id,
            'exam_title' => $inquiry->examListing?->title,
            'date_of_birth' => optional($inquiry->date_of_birth)->format('Y-m-d'),
            'qualifications' => $inquiry->qualifications,
            'cv_path' => $inquiry->cv_path,
            'cv_url' => asset(Storage::url($inquiry->cv_path)),
            'whatsapp_number' => $inquiry->whatsapp_number,
            'mobile_number' => $inquiry->mobile_number,
            'nic' => $inquiry->nic,
            'address' => $inquiry->address,
            'inquiry' => $inquiry->inquiry,
            'status' => $inquiry->status,
            'created_at' => $inquiry->created_at,
        ];
    }

    /**
     * Display all exam inquiries.
     */
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $perPage = (int) ($validated['per_page'] ?? 10);

        $inquiries = ExamInquiry::query()
            ->with(['examListing:id,title'])
            ->latest()
            ->paginate($perPage);

        return response()->json([
            'data' => $inquiries->getCollection()->map(fn (ExamInquiry $inquiry) => $this->toResponseItem($inquiry))->values(),
            'meta' => [
                'current_page' => $inquiries->currentPage(),
                'last_page' => $inquiries->lastPage(),
                'per_page' => $inquiries->perPage(),
                'total' => $inquiries->total(),
            ],
        ]);
    }

    /**
     * Store a new exam inquiry.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'exam_listing_id' => ['required', 'integer', 'exists:exam_listings,id'],
            'date_of_birth' => ['required', 'date'],
            'qualifications' => ['required', 'string', 'max:5000'],
            'cv' => ['required', 'file', 'mimes:pdf,doc,docx', 'max:5120'],
            'whatsapp_number' => ['required', 'string', 'max:30'],
            'mobile_number' => ['required', 'string', 'max:30'],
            'nic' => ['required', 'string', 'max:50'],
            'address' => ['required', 'string', 'max:2000'],
            'inquiry' => ['nullable', 'string', 'max:5000'],
        ]);

        $cvPath = $request->file('cv')->store('exam-inquiries/cv', 'public');

        $inquiry = ExamInquiry::create([
            'exam_listing_id' => $validated['exam_listing_id'],
            'date_of_birth' => $validated['date_of_birth'],
            'qualifications' => $validated['qualifications'],
            'cv_path' => $cvPath,
            'whatsapp_number' => $validated['whatsapp_number'],
            'mobile_number' => $validated['mobile_number'],
            'nic' => $validated['nic'],
            'address' => $validated['address'],
            'inquiry' => $validated['inquiry'] ?? null,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Exam inquiry submitted successfully.',
            'data' => [
                'id' => $inquiry->id,
            ],
        ], 201);
    }

    /**
     * Mark an inquiry as rejected.
     */
    public function reject(ExamInquiry $examInquiry): JsonResponse
    {
        $examInquiry->update([
            'status' => 'rejected',
        ]);

        return response()->json([
            'message' => 'Exam inquiry rejected successfully.',
            'data' => [
                'id' => $examInquiry->id,
                'status' => $examInquiry->status,
            ],
        ]);
    }
}
