<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category as CategoryModel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    /**
     * Display a listing of categories.
     */
    public function index(): JsonResponse
    {
        $categories = CategoryModel::query()
            ->latest()
            ->get();

        return response()->json(
            $categories->map(fn ($category) => $this->toResponseItem($category))->values()
        );
    }

    /**
     * Store a newly created category.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('categories', 'slug')],
            'status' => ['required', Rule::in(['active', 'inactive'])],
            'icon' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,svg', 'max:5120'],
        ]);

        $slug = $validated['slug'] ?? Str::slug($validated['name']);
        $iconPath = $request->hasFile('icon')
            ? $request->file('icon')->store('categories/icons', 'public')
            : null;

        $category = CategoryModel::create([
            'name' => $validated['name'],
            'slug' => $slug,
            'status' => $validated['status'],
            'icon_path' => $iconPath,
        ]);

        return response()->json([
            'message' => 'Category created successfully.',
            'data' => $this->toResponseItem($category),
        ], 201);
    }

    /**
     * Remove the specified category.
     */
    public function destroy(CategoryModel $category): JsonResponse
    {
        if ($category->icon_path && Storage::disk('public')->exists($category->icon_path)) {
            Storage::disk('public')->delete($category->icon_path);
        }

        $category->delete();

        return response()->json([
            'message' => 'Category deleted successfully.',
        ]);
    }

    /**
     * Map category model to API response payload.
     *
     * @return array<string, mixed>
     */
    private function toResponseItem(CategoryModel $category): array
    {
        return [
            'id' => $category->id,
            'name' => $category->name,
            'slug' => $category->slug,
            'status' => $category->status,
            'icon_path' => $category->icon_path,
            'icon_url' => $category->icon_path ? asset(Storage::url($category->icon_path)) : null,
            'created_at' => $category->created_at,
        ];
    }
}
