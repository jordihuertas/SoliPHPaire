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
            'color' => 'black',
        ]);
        CardTypes::create([
            'name' => 'diamond',
            'color' => 'red',
        ]);
        CardTypes::create([
            'name' => 'heart',
            'color' => 'red',
        ]);
        CardTypes::create([
            'name' => 'spade',
            'color' => 'black',
        ]);
    }
}
