<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category as CategoryModel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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
            ->get(['id', 'name', 'slug', 'status', 'created_at']);

        return response()->json($categories);
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
        ]);

        $slug = $validated['slug'] ?? Str::slug($validated['name']);

        $category = CategoryModel::create([
            'name' => $validated['name'],
            'slug' => $slug,
            'status' => $validated['status'],
        ]);

        return response()->json([
            'message' => 'Category created successfully.',
            'data' => $category->only(['id', 'name', 'slug', 'status', 'created_at']),
        ], 201);
    }

    /**
     * Remove the specified category.
     */
    public function destroy(CategoryModel $category): JsonResponse
    {
        $category->delete();

        return response()->json([
            'message' => 'Category deleted successfully.',
        ]);
    }
}
