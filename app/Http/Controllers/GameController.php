<?php

namespace App\Http\Controllers;

use App\View\Components\Card;
use Illuminate\Http\Request;

class GameController extends Controller
{
    public function index(Request $request): \Illuminate\Contracts\View\Factory|\Illuminate\Foundation\Application|\Illuminate\Contracts\View\View|\Illuminate\Contracts\Foundation\Application
    {
//        $card = $this->generateCard();
        $card_controller = new CardsController();
        $cards = $card_controller->getAllCards();
        return view('game.index', compact('cards'));
    }

    private function generateCard(){
        return view('components.card')->render();
//        return view('components.card', compact(['gift_card', 'used_money_beautified', 'money_left_beautified', 'outstanding_beautified']))->render();
    }
}
