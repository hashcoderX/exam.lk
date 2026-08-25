<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class GuestAuthController extends Controller
{
    /**
     * Register a guest user.
     */
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')],
            'contact_no' => ['required', 'string', 'max:30'],
            'address' => ['required', 'string', 'max:1000'],
            'user_id' => ['required', 'string', 'max:255', Rule::unique('users', 'user_id')],
            'password' => ['required', 'string', 'min:8', 'max:255'],
        ]);

        $user = User::create([
            'name' => $validated['full_name'],
            'email' => $validated['email'],
            'contact_no' => $validated['contact_no'],
            'address' => $validated['address'],
            'user_id' => $validated['user_id'],
            'role' => 'guest',
            'password' => $validated['password'],
            'email_verified_at' => now(),
        ]);

        return response()->json([
            'message' => 'Guest account created successfully.',
            'data' => [
                'id' => $user->id,
                'full_name' => $user->name,
                'email' => $user->email,
                'contact_no' => $user->contact_no,
                'address' => $user->address,
                'user_id' => $user->user_id,
                'role' => $user->role,
            ],
        ], 201);
    }

    /**
     * Sign in a guest user with email or user ID.
     */
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'identifier' => ['required', 'string', 'max:255'],
            'password' => ['required', 'string', 'max:255'],
        ]);

        $identifier = trim($validated['identifier']);

        $user = User::query()
            ->where('email', $identifier)
            ->orWhere('user_id', $identifier)
            ->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials.',
            ], 422);
        }

        return response()->json([
            'message' => 'Sign in successful.',
            'data' => [
                'id' => $user->id,
                'full_name' => $user->name,
                'email' => $user->email,
                'contact_no' => $user->contact_no,
                'address' => $user->address,
                'user_id' => $user->user_id,
                'role' => $user->role,
            ],
        ]);
    }
}
