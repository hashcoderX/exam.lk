<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Advertisement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class AdvertisementController extends Controller
{
    /**
     * @return list<string>
     */
    private function placementOptions(): array
    {
        return [
            'home_top',
            'home_sidebar',
            'exam_details',
            'guest_sidebar',
            'footer',
            'exam_listings_top',
            'exam_listings_sidebar',
            'exam_details_top',
            'exam_details_sidebar',
            'exam_details_heading_banner',
            'exam_details_google_ads',
            'guest_dashboard_top',
            'guest_dashboard_sidebar',
            'guest_exam_listings_top',
            'guest_exam_listings_sidebar',
            'guest_exam_registration_top',
            'guest_exam_registration_sidebar',
            'global_header',
            'global_footer',
        ];
    }

    /**
     * @return list<string>
     */
    private function adNetworkOptions(): array
    {
        return [
            'direct_image',
            'google_adsense',
            'google_ad_manager',
            'media_net',
            'ezoic',
            'monumetric',
            'mediavine',
            'adsterra',
            'propellerads',
            'infolinks',
            'custom',
        ];
    }

    /**
     * Convert ad model to API response shape.
     *
     * @return array<string, mixed>
     */
    private function toResponseItem(Advertisement $advertisement): array
    {
        $impressions = (int) $advertisement->impressions;
        $clicks = (int) $advertisement->clicks;
        $ctr = $impressions > 0 ? round(($clicks / $impressions) * 100, 2) : 0;

        return [
            'id' => $advertisement->id,
            'title' => $advertisement->title,
            'description' => $advertisement->description ?? '',
            'advertiser_name' => $advertisement->advertiser_name,
            'placement' => $advertisement->placement,
            'target_url' => $advertisement->target_url,
            'start_date' => optional($advertisement->start_date)->format('Y-m-d'),
            'end_date' => optional($advertisement->end_date)->format('Y-m-d'),
            'status' => $advertisement->status,
            'ad_source' => $advertisement->ad_source ?? 'image',
            'ad_network' => $advertisement->ad_network,
            'ad_unit_reference' => $advertisement->ad_unit_reference,
            'google_ad_code' => $advertisement->google_ad_code,
            'budget' => $advertisement->budget,
            'impressions' => $impressions,
            'clicks' => $clicks,
            'ctr' => $ctr,
            'image_url' => $advertisement->image_path ? asset(Storage::url($advertisement->image_path)) : null,
            'image_width' => $advertisement->image_width,
            'image_height' => $advertisement->image_height,
            'created_at' => $advertisement->created_at,
        ];
    }

    /**
     * Display paginated advertisements.
     */
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
            'status' => ['nullable', Rule::in(['draft', 'active', 'paused', 'completed'])],
            'placement' => ['nullable', Rule::in($this->placementOptions())],
            'sort' => ['nullable', Rule::in(['latest', 'oldest'])],
        ]);

        $perPage = (int) ($validated['per_page'] ?? 8);

        $query = Advertisement::query();

        if (!empty($validated['status'])) {
            $query->where('status', $validated['status']);
        }

        if (!empty($validated['placement'])) {
            $query->where('placement', $validated['placement']);
        }

        if (($validated['sort'] ?? 'latest') === 'oldest') {
            $query->oldest();
        } else {
            $query->latest();
        }

        $advertisements = $query->paginate($perPage);

        return response()->json([
            'data' => $advertisements->getCollection()->map(fn (Advertisement $advertisement) => $this->toResponseItem($advertisement))->values(),
            'meta' => [
                'current_page' => $advertisements->currentPage(),
                'last_page' => $advertisements->lastPage(),
                'per_page' => $advertisements->perPage(),
                'total' => $advertisements->total(),
            ],
        ]);
    }

    /**
     * Store a newly created advertisement.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:20000'],
            'advertiser_name' => ['required', 'string', 'max:255'],
            'placement' => ['required', Rule::in($this->placementOptions())],
            'target_url' => ['nullable', 'url', 'max:2000'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'status' => ['required', Rule::in(['draft', 'active', 'paused', 'completed'])],
            'ad_source' => ['required', Rule::in(['image', 'google_code'])],
            'ad_network' => [
                Rule::requiredIf(fn () => $request->input('ad_source') === 'google_code'),
                'nullable',
                Rule::in($this->adNetworkOptions()),
            ],
            'ad_unit_reference' => ['nullable', 'string', 'max:255'],
            'google_ad_code' => [
                Rule::requiredIf(fn () => $request->input('ad_source') === 'google_code'),
                'nullable',
                'string',
                'max:50000',
            ],
            'budget' => ['nullable', 'numeric', 'min:0'],
            'impressions' => ['nullable', 'integer', 'min:0'],
            'clicks' => ['nullable', 'integer', 'min:0'],
            'image' => [
                Rule::requiredIf(fn () => $request->input('ad_source') === 'image'),
                'nullable',
                'image',
                'max:5120',
            ],
            'image_width' => ['required', 'integer', 'min:100'],
            'image_height' => ['required', 'integer', 'min:100'],
        ]);

        $imagePath = '';

        if ($validated['ad_source'] === 'image' && $request->hasFile('image')) {
            $imagePath = $request->file('image')->store('advertisements', 'public');
        }

        $advertisement = Advertisement::create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'advertiser_name' => $validated['advertiser_name'],
            'placement' => $validated['placement'],
            'target_url' => $validated['target_url'] ?? null,
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'status' => $validated['status'],
            'ad_source' => $validated['ad_source'],
            'ad_network' => $validated['ad_source'] === 'google_code'
                ? ($validated['ad_network'] ?? 'custom')
                : 'direct_image',
            'ad_unit_reference' => $validated['ad_unit_reference'] ?? null,
            'google_ad_code' => $validated['ad_source'] === 'google_code'
                ? ($validated['google_ad_code'] ?? null)
                : null,
            'budget' => $validated['budget'] ?? null,
            'impressions' => $validated['impressions'] ?? 0,
            'clicks' => $validated['clicks'] ?? 0,
            'image_path' => $imagePath,
            'image_width' => $validated['image_width'],
            'image_height' => $validated['image_height'],
        ]);

        return response()->json([
            'message' => 'Advertisement created successfully.',
            'data' => $this->toResponseItem($advertisement),
        ], 201);
    }

    /**
     * Display a single advertisement.
     */
    public function show(Advertisement $advertisement): JsonResponse
    {
        return response()->json([
            'data' => $this->toResponseItem($advertisement),
        ]);
    }

    /**
     * Update an existing advertisement.
     */
    public function update(Request $request, Advertisement $advertisement): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:20000'],
            'advertiser_name' => ['required', 'string', 'max:255'],
            'placement' => ['required', Rule::in($this->placementOptions())],
            'target_url' => ['nullable', 'url', 'max:2000'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'status' => ['required', Rule::in(['draft', 'active', 'paused', 'completed'])],
            'ad_source' => ['required', Rule::in(['image', 'google_code'])],
            'ad_network' => [
                Rule::requiredIf(fn () => $request->input('ad_source') === 'google_code'),
                'nullable',
                Rule::in($this->adNetworkOptions()),
            ],
            'ad_unit_reference' => ['nullable', 'string', 'max:255'],
            'google_ad_code' => [
                Rule::requiredIf(fn () => $request->input('ad_source') === 'google_code'),
                'nullable',
                'string',
                'max:50000',
            ],
            'budget' => ['nullable', 'numeric', 'min:0'],
            'impressions' => ['nullable', 'integer', 'min:0'],
            'clicks' => ['nullable', 'integer', 'min:0'],
            'image' => [
                Rule::requiredIf(fn () => $request->input('ad_source') === 'image' && empty($advertisement->image_path)),
                'nullable',
                'image',
                'max:5120',
            ],
            'image_width' => ['required', 'integer', 'min:100'],
            'image_height' => ['required', 'integer', 'min:100'],
        ]);

        $imagePath = $advertisement->image_path;

        if ($validated['ad_source'] === 'google_code') {
            if ($imagePath && Storage::disk('public')->exists($imagePath)) {
                Storage::disk('public')->delete($imagePath);
            }

            $imagePath = '';
        } elseif ($request->hasFile('image')) {
            if ($imagePath && Storage::disk('public')->exists($imagePath)) {
                Storage::disk('public')->delete($imagePath);
            }

            $imagePath = $request->file('image')->store('advertisements', 'public');
        }

        $advertisement->update([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'advertiser_name' => $validated['advertiser_name'],
            'placement' => $validated['placement'],
            'target_url' => $validated['target_url'] ?? null,
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'status' => $validated['status'],
            'ad_source' => $validated['ad_source'],
            'ad_network' => $validated['ad_source'] === 'google_code'
                ? ($validated['ad_network'] ?? 'custom')
                : 'direct_image',
            'ad_unit_reference' => $validated['ad_unit_reference'] ?? null,
            'google_ad_code' => $validated['ad_source'] === 'google_code'
                ? ($validated['google_ad_code'] ?? null)
                : null,
            'budget' => $validated['budget'] ?? null,
            'impressions' => $validated['impressions'] ?? 0,
            'clicks' => $validated['clicks'] ?? 0,
            'image_path' => $imagePath,
            'image_width' => $validated['image_width'],
            'image_height' => $validated['image_height'],
        ]);

        return response()->json([
            'message' => 'Advertisement updated successfully.',
            'data' => $this->toResponseItem($advertisement->fresh()),
        ]);
    }

    /**
     * Delete an advertisement.
     */
    public function destroy(Advertisement $advertisement): JsonResponse
    {
        if ($advertisement->image_path && Storage::disk('public')->exists($advertisement->image_path)) {
            Storage::disk('public')->delete($advertisement->image_path);
        }

        $advertisement->delete();

        return response()->json([
            'message' => 'Advertisement deleted successfully.',
        ]);
    }
}
