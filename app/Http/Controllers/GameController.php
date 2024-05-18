<?php

namespace App\Http\Controllers;

use App\View\Components\Card;
use Illuminate\Http\Request;

class GameController extends Controller
{
    public function index(Request $request): \Illuminate\Contracts\View\Factory|\Illuminate\Foundation\Application|\Illuminate\Contracts\View\View|\Illuminate\Contracts\Foundation\Application
    {
        $card_controller = new CardsController();
        $cards = $card_controller->getAllCards();

        $decks = $this->shuffleCards($cards);
        $cards = $decks;

        return view('game.index', compact('cards'));
    }

    private function shuffleCards($cards): \stdClass
    {
        // Deck init
        $main_deck = [];
        $decks = [];
        for ($i = 1; $i <= 7; $i++) {
            $decks[$i] = [];
        }

        // Distribute cards to decks following the specific pattern
        $cardIndex = 0;
        for ($i = 1; $i <= 7; $i++) {
            for ($j = $i; $j <= 7; $j++) {
                if ($cardIndex < count($cards)) {
                    $card = $cards[$cardIndex++];
                    $card->deck = strval($j);
                    $card->position = strval($i);
                    $decks[$j][] = $card;
                }
            }
        }

        // Set isHidden to false for the last card in each deck
        for ($i = 1; $i <= 7; $i++) {
            if (!empty($decks[$i])) {
                $decks[$i][count($decks[$i]) - 1]->isHidden = false;
            }
        }

        // Add the remaining cards to the main deck
        $i = 1;
        while ($cardIndex < count($cards)) {
            $card = $cards[$cardIndex++];
            $card->deck = "0";
            $card->position = strval($i);
            $main_deck[] = $card;
            $i++;
        }

        // Mount result
        $cards = new \stdClass();
        $cards->main_deck = $main_deck;
        $cards->decks = $decks;
        dump($cards);
        return $cards;
    }
}
