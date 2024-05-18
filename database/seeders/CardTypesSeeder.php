<?php

namespace Database\Seeders;

use App\Models\CardTypes;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CardTypesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        CardTypes::create([
            'name' => 'club',
        ]);
        CardTypes::create([
            'name' => 'diamond',
        ]);
        CardTypes::create([
            'name' => 'heart',
        ]);
        CardTypes::create([
            'name' => 'spade',
        ]);
    }
}
