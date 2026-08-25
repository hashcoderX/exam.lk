<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Advertisement extends Model
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
        'advertiser_name',
        'placement',
        'target_url',
        'start_date',
        'end_date',
        'status',
        'ad_source',
        'ad_network',
        'ad_unit_reference',
        'google_ad_code',
        'budget',
        'impressions',
        'clicks',
        'image_path',
        'image_width',
        'image_height',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'budget' => 'decimal:2',
            'impressions' => 'integer',
            'clicks' => 'integer',
            'image_width' => 'integer',
            'image_height' => 'integer',
        ];
    }
}
