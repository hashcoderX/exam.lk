<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('exam_inquiries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_listing_id')->constrained('exam_listings')->cascadeOnDelete();
            $table->date('date_of_birth');
            $table->text('qualifications');
            $table->string('cv_path');
            $table->string('whatsapp_number', 30);
            $table->string('mobile_number', 30);
            $table->string('nic', 50);
            $table->text('address');
            $table->text('inquiry')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exam_inquiries');
    }
};
