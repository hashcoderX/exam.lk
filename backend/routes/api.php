<?php

use App\Http\Controllers\Api\AdvertisementController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ExamInquiryController;
use App\Http\Controllers\Api\ExamListingController;
use App\Http\Controllers\Api\GuestAuthController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/advertisements', [AdvertisementController::class, 'index']);
Route::post('/advertisements', [AdvertisementController::class, 'store']);
Route::get('/advertisements/{advertisement}', [AdvertisementController::class, 'show']);
Route::put('/advertisements/{advertisement}', [AdvertisementController::class, 'update']);
Route::delete('/advertisements/{advertisement}', [AdvertisementController::class, 'destroy']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/users', [UserController::class, 'index']);
Route::delete('/users/{user}', [UserController::class, 'destroy']);
Route::post('/categories', [CategoryController::class, 'store']);
Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);
Route::post('/guest/register', [GuestAuthController::class, 'register']);
Route::post('/guest/login', [GuestAuthController::class, 'login']);
Route::get('/exam-inquiries', [ExamInquiryController::class, 'index']);
Route::patch('/exam-inquiries/{examInquiry}/reject', [ExamInquiryController::class, 'reject']);
Route::post('/guest/exam-inquiries', [ExamInquiryController::class, 'store']);
Route::get('/exam-listings', [ExamListingController::class, 'index']);
Route::get('/exam-listings/{examListing}', [ExamListingController::class, 'show']);
Route::post('/exam-listings', [ExamListingController::class, 'store']);
Route::put('/exam-listings/{examListing}', [ExamListingController::class, 'update']);
Route::delete('/exam-listings/{examListing}', [ExamListingController::class, 'destroy']);
