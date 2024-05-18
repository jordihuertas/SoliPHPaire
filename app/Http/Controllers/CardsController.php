<?php

namespace App\Http\Controllers;

use App\Models\Cards;
use App\Models\CardTypes;
use Illuminate\Http\Request;

class CardsController extends Controller
{
    public function getAllCards()
    {
        $cards = Cards::all();
        //$cards = Card::all()->shuffle();
        $card_types = CardTypes::all();

        // Setup cards
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
