<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("ALTER TABLE advertisements MODIFY placement ENUM(
            'home_top',
            'home_sidebar',
            'exam_details',
            'guest_sidebar',
            'footer',
            'exam_listings_top',
            'exam_listings_sidebar',
            'exam_details_top',
            'exam_details_sidebar',
            'guest_dashboard_top',
            'guest_dashboard_sidebar',
            'guest_exam_listings_top',
            'guest_exam_listings_sidebar',
            'guest_exam_registration_top',
            'guest_exam_registration_sidebar',
            'global_header',
            'global_footer'
        ) NOT NULL");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("UPDATE advertisements
            SET placement = 'home_sidebar'
            WHERE placement NOT IN ('home_top', 'home_sidebar', 'exam_details', 'guest_sidebar', 'footer')");

        DB::statement("ALTER TABLE advertisements MODIFY placement ENUM(
            'home_top',
            'home_sidebar',
            'exam_details',
            'guest_sidebar',
            'footer'
        ) NOT NULL");
    }
};
