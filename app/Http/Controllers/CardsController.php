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
            foreach ($card_types as $card_type) {
                if ($card_type->id == $card->card_type_id) {
                    $card->type = $card_type;
                }
            }
        }

        // Deck init
        $main_deck = [];
        $decks = [];
        for ($i = 1; $i <= 7; $i++) {
            $decks[$i] = [];
        }

        // Distribute cards to decks
        $current_deck = 1;
        foreach ($cards as $card) {
            // If deck is full, go next deck
            while ($current_deck <= 7 && count($decks[$current_deck]) >= $current_deck) {
                $current_deck++;
            }

            // Add cards to decks if they have available space
            if ($current_deck <= 7) {
                $decks[$current_deck][] = $card;
            } else { // Add cards to main deck if all decks are already filled up
                $main_deck[] = $card;
            }
        }

        // Mount result
//        $cards = new \stdClass();
//        $cards->main_deck = $main_deck;
//        $cards->decks = $decks;
//        dump($cards);

        return $cards;
    }
}
