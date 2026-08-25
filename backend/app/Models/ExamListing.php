<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ExamListing extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'title',
        'description',
        'category',
        'deadline',
        'status',
        'poster_path',
        'application_file_path',
        'poster_width',
        'poster_height',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'deadline' => 'date',
            'poster_width' => 'integer',
            'poster_height' => 'integer',
        ];
    }

    /**
     * Get inquiries for this exam listing.
     */
    public function inquiries(): HasMany
    {
        return $this->hasMany(ExamInquiry::class);
    }
}
