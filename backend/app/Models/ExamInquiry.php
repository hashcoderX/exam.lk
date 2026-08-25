<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExamInquiry extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'exam_listing_id',
        'date_of_birth',
        'qualifications',
        'cv_path',
        'whatsapp_number',
        'mobile_number',
        'nic',
        'address',
        'inquiry',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
        ];
    }

    /**
     * Get the exam listing for this inquiry.
     */
    public function examListing(): BelongsTo
    {
        return $this->belongsTo(ExamListing::class);
    }
}
