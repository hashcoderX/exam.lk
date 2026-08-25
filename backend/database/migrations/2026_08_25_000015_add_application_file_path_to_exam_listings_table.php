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
        Schema::table('exam_listings', function (Blueprint $table) {
            $table->string('application_file_path')->nullable()->after('poster_path');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('exam_listings', function (Blueprint $table) {
            $table->dropColumn('application_file_path');
        });
    }
};
