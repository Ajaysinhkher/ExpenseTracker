<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Group;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\belongsTo;
class Expense extends Model
{
    use HasFactory, Notifiable,HasApiTokens;

    protected $fillable = [
        'group_id',
        'amount',
        'description',
        'date',
    ];

    public function group()
    {
        return $this->belongsTo(Group::class);
    }
    
}
