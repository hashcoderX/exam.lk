<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ExamListing;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class ExamListingController extends Controller
{
    /**
     * Convert a listing model into API response shape.
     *
     * @return array<string, mixed>
     */
    private function toResponseItem(ExamListing $listing): array
    {
        return [
            'id' => $listing->id,
            'title' => $listing->title,
            'description' => $listing->description ?? '',
            'category' => $listing->category,
            'deadline' => optional($listing->deadline)->format('Y-m-d'),
            'status' => $listing->status,
            'poster_url' => asset(Storage::url($listing->poster_path)),
            'application_url' => $listing->application_file_path
                ? asset(Storage::url($listing->application_file_path))
                : null,
            'poster_width' => $listing->poster_width,
            'poster_height' => $listing->poster_height,
            'created_at' => $listing->created_at,
        ];
    }

    /**
     * Display all exam listings.
     */
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
            'status' => ['nullable', Rule::in(['published', 'pending'])],
            'sort' => ['nullable', Rule::in(['latest', 'oldest'])],
        ]);

        $perPage = (int) ($validated['per_page'] ?? 8);

        $query = ExamListing::query();

        if (!empty($validated['status'])) {
            $query->where('status', $validated['status']);
        }

        if (($validated['sort'] ?? 'latest') === 'oldest') {
            $query->oldest();
        } else {
            $query->latest();
        }

        $listings = $query->paginate($perPage);

        return response()->json([
            'data' => $listings->getCollection()->map(fn (ExamListing $listing) => $this->toResponseItem($listing))->values(),
            'meta' => [
                'current_page' => $listings->currentPage(),
                'last_page' => $listings->lastPage(),
                'per_page' => $listings->perPage(),
                'total' => $listings->total(),
            ],
        ]);
    }

    /**
     * Store a newly created exam listing.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:20000'],
            'category' => ['required', 'string', 'max:255'],
            'deadline' => ['required', 'date'],
            'status' => ['required', Rule::in(['published', 'pending'])],
            'poster' => ['required', 'image', 'max:5120'],
            'application_file' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
            'poster_width' => ['required', 'integer', 'min:100'],
            'poster_height' => ['required', 'integer', 'min:100'],
        ]);

        $posterPath = $request->file('poster')->store('exam-posters', 'public');
        $applicationFilePath = $request->hasFile('application_file')
            ? $request->file('application_file')->store('exam-applications', 'public')
            : null;

        $listing = ExamListing::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'category' => $validated['category'],
            'deadline' => $validated['deadline'],
            'status' => $validated['status'],
            'poster_path' => $posterPath,
            'application_file_path' => $applicationFilePath,
            'poster_width' => $validated['poster_width'],
            'poster_height' => $validated['poster_height'],
        ]);

        return response()->json([
            'message' => 'Exam listing created successfully.',
            'data' => $this->toResponseItem($listing),
        ], 201);
    }

    /**
     * Display a single exam listing.
     */
    public function show(ExamListing $examListing): JsonResponse
    {
        return response()->json([
            'data' => $this->toResponseItem($examListing),
        ]);
    }

    /**
     * Update an existing exam listing.
     */
    public function update(Request $request, ExamListing $examListing): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:20000'],
            'category' => ['required', 'string', 'max:255'],
            'deadline' => ['required', 'date'],
            'status' => ['required', Rule::in(['published', 'pending'])],
            'poster' => ['nullable', 'image', 'max:5120'],
            'application_file' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
            'poster_width' => ['required', 'integer', 'min:100'],
            'poster_height' => ['required', 'integer', 'min:100'],
        ]);

        $posterPath = $examListing->poster_path;
        $applicationFilePath = $examListing->application_file_path;

        if ($request->hasFile('poster')) {
            if ($posterPath && Storage::disk('public')->exists($posterPath)) {
                Storage::disk('public')->delete($posterPath);
            }

            $posterPath = $request->file('poster')->store('exam-posters', 'public');
        }

        if ($request->hasFile('application_file')) {
            if ($applicationFilePath && Storage::disk('public')->exists($applicationFilePath)) {
                Storage::disk('public')->delete($applicationFilePath);
            }

            $applicationFilePath = $request->file('application_file')->store('exam-applications', 'public');
        }

        $examListing->update([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'category' => $validated['category'],
            'deadline' => $validated['deadline'],
            'status' => $validated['status'],
            'poster_path' => $posterPath,
            'application_file_path' => $applicationFilePath,
            'poster_width' => $validated['poster_width'],
            'poster_height' => $validated['poster_height'],
        ]);

        return response()->json([
            'message' => 'Exam listing updated successfully.',
            'data' => $this->toResponseItem($examListing->fresh()),
        ]);
    }

    /**
     * Delete an existing exam listing.
     */
    public function destroy(ExamListing $examListing): JsonResponse
    {
        if ($examListing->poster_path && Storage::disk('public')->exists($examListing->poster_path)) {
            Storage::disk('public')->delete($examListing->poster_path);
        }

        if ($examListing->application_file_path && Storage::disk('public')->exists($examListing->application_file_path)) {
            Storage::disk('public')->delete($examListing->application_file_path);
        }

        $examListing->delete();

        return response()->json([
            'message' => 'Exam listing deleted successfully.',
        ]);
    }
}
