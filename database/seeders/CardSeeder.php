<?php

namespace Database\Seeders;

use App\Models\Cards;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 1; $i <= 4; $i++) {
            foreach (range(1, 13) as $index) {
                Cards::create([
                    'number' => $index,
                    'card_type_id' => $i,
                ]);
            }
        }
    }
}
