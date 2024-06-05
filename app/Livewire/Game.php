<?php

namespace App\Livewire;

use App\Http\Controllers\CardsController;
use App\View\Components\Card;
use Livewire\Attributes\Renderless;
use Livewire\Component;
use Livewire\Attributes\On;

class Game extends Component
{
    public $cards;

    public function mount()
    {
        $card_controller = new CardsController();
        $cards = $card_controller->getAllCards();
        // $cards->shuffle(); //Remove for getting and ordered deck for testing purposes

        $decks = $this->mountDecks($cards);
        $this->cards = $decks;
    }
    public function render(): \Illuminate\Contracts\View\View|\Illuminate\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\View\View|\Illuminate\Contracts\Foundation\Application
    {
//        dump($this->cards);
        return view('livewire.game');
    }

    private function mountDecks($cards): \stdClass
    {
        // Deck init
        $main_deck = [];
        $main_deck_shown = [];
        $decks = [];
        for ($i = 1; $i <= 7; $i++) {
            $decks[$i] = [];
        }

        // Distribute cards to decks following the specific pattern
        $cardIndex = 0;
        for ($i = 1; $i <= 7; $i++) {
            for ($j = $i; $j <= 7; $j++) {
                if ($cardIndex < count($cards)) {
                    $card = new \StdClass();
                    $card->id = $cards[$cardIndex]->id;
                    $card->number = $cards[$cardIndex]->number;
                    $card->card_type_id = $cards[$cardIndex]->card_type_id;
                    $card->type = $cards[$cardIndex]->type;
                    $card->deck = strval($j);
                    $card->position = strval($i);
                    $card->isHidden = true;
                    $decks[$j][] = $card;
                    $cardIndex++;
                }
            }
        }

        // Set isHidden to false for the last card in each deck
        for ($i = 1; $i <= 7; $i++) {
            if (!empty($decks[$i])) {
                $decks[$i][count($decks[$i]) - 1]->isHidden = false;
//                dump($decks[$i]);
            }
        }

        // Add the remaining cards to the main deck
        $i = 1;
        while ($cardIndex < count($cards)) {
            $card = new \StdClass();
            $card->id = $cards[$cardIndex]->id;
            $card->number = $cards[$cardIndex]->number;
            $card->card_type_id = $cards[$cardIndex]->card_type_id;
            $card->type = $cards[$cardIndex]->type;
            $card->deck = "0";
            $card->position = strval($i);
            $card->isHidden = true;
            $main_deck[] = $card;
            $cardIndex++;
            $i++;
        }

        // Mount result
        $cards = new \stdClass();
        $cards->main_deck = $main_deck;
        $cards->main_deck_shown = $main_deck_shown;
        $cards->decks = $decks;

        return $cards;
    }

    #[On('reset-main-deck')]
    #[Renderless]
    public function resetMainDeck(){
        $this->cards->main_deck = array_reverse($this->cards->main_deck_shown);
        $this->cards->main_deck_shown = [];
        $this->dispatch('reset-main-deck-callback');
    }

    #[On('main-deck-next-card')]
    #[Renderless]
    public function getNextCardFromMainDeck(): void
    {
        // Moves the main deck next card to the main deck shown cards
        $next_card = array_pop($this->cards->main_deck);
        $deck_is_empty = true;
        $last_deck_card = false;

        if (!is_null($next_card)) {
            $deck_is_empty = false;
            array_push($this->cards->main_deck_shown, $next_card);
            if (count($this->cards->main_deck) == 0){
                $last_deck_card = true;
            }
        }

        // Return next card to js event
        $this->dispatch('main-deck-next-card-callback', ['card' => $next_card, 'last_deck_card' => $last_deck_card, 'deck_is_empty' => $deck_is_empty]);
    }

    #[On('build-card')]
    #[Renderless]
    public function buildCard($card_data){
        $this->dispatch('build-card-callback', ['card' => Card::buildCard($card_data)]);
    }
}
