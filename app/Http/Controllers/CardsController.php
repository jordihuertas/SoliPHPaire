<?php

namespace App\Http\Controllers;

use App\Models\Cards;
use App\Models\CardTypes;
use Illuminate\Http\Request;

class CardsController extends Controller
{
    public function getAllCards()
    {
        // Get all cards and shuffle
        $cards = Cards::all();

        // Setup cards types
        $card_types = CardTypes::all();
        foreach ($cards as $card) {
            $card->isHidden = true;
            foreach ($card_types as $card_type) {
                if ($card_type->id == $card->card_type_id) {
                    $card->type = $card_type;
                }
            }
        }

        return $cards;
    }
}
