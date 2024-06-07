<?php

namespace App\Livewire;

use App\Http\Controllers\CardsController;
use App\View\Components\Card;
use Livewire\Attributes\Renderless;
use Livewire\Component;
use Livewire\Attributes\On;
use Ramsey\Uuid\Uuid;

class Game extends Component
{
    public $cards;

    public function mount()
    {
        $card_controller = new CardsController();
        $cards = $card_controller->getAllCards();
        // $cards->shuffle(); //Remove for getting and ordered deck for testing purposes

        $this->generateUuids($cards);
        $decks = $this->mountDecks($cards);
        $this->cards = $decks;
    }
    public function render(): \Illuminate\Contracts\View\View|\Illuminate\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\View\View|\Illuminate\Contracts\Foundation\Application
    {
        return view('livewire.game');
    }

    private function mountDecks($cards): \stdClass
    {
        // Deck init
        $main_deck = [];
        $main_deck_shown = [];
        $pile_decks = [];
        for ($i = 1; $i <= 4; $i++) {
            $pile_decks[$i] = [];
        }
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
                    $card->uuid = $cards[$cardIndex]->uuid;
                    $card->number = $cards[$cardIndex]->number;
                    $card->card_type_id = $cards[$cardIndex]->card_type_id;
                    $card->type = $cards[$cardIndex]->type;
                    $card->deck = strval($j);
                    $card->deck_type = 'deck';
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
            }
        }

        // Add the remaining cards to the main deck
        $i = 1;
        while ($cardIndex < count($cards)) {
            $card = new \StdClass();
            $card->id = $cards[$cardIndex]->id;
            $card->uuid = $cards[$cardIndex]->uuid;
            $card->number = $cards[$cardIndex]->number;
            $card->card_type_id = $cards[$cardIndex]->card_type_id;
            $card->type = $cards[$cardIndex]->type;
            $card->deck = "0";
            $card->deck_type = null;
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
        $cards->pile_decks = $pile_decks;
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
        $card_html = null;

        if (!is_null($next_card)) {
            $deck_is_empty = false;
            array_push($this->cards->main_deck_shown, $next_card);
            $card_html = Card::buildCard($next_card);
            if (count($this->cards->main_deck) == 0){
                $last_deck_card = true;
            }
        }

        // Return next card to js event
        $this->dispatch('main-deck-next-card-callback', ['card' => $card_html, 'last_deck_card' => $last_deck_card, 'deck_is_empty' => $deck_is_empty]);
    }

    #[On('update-dropped-cards')]
    #[Renderless]
    public function updateDroppedCards($droppedCards, $dropSlot){
        $droppedCards = json_decode(json_encode($droppedCards));
        $foundCards = $this->findDroppedCards($droppedCards);

//        dump($droppedCards, $foundCards);

        if (!$this->canBeDropped($foundCards[0], $dropSlot)){
            $this->dispatch('update-dropped-cards-callback', ['can_be_dropped' => false]);
            return;
        }

        foreach ($foundCards as $foundCard) {
            $droppedCard = array_values(array_filter($droppedCards, function($droppedCard) use ($foundCard) {
                return $droppedCard->uuid === $foundCard->uuid;
            }))[0];

            if (isset($this->cards->decks[$droppedCard->deck])) {
                $this->addToNewDeck($foundCard, $droppedCard->deckType, $droppedCard->deck);
                $this->removeFromOldDeck($foundCard, $droppedCard->deckType, $droppedCard->deck);
            }
        }

        $this->dispatch('update-dropped-cards-callback', ['can_be_dropped' => true]);
    }

    private function canBeDropped($fromCard, $toCard): bool
    {
        return false;
    }

    private function addToNewDeck($card, $deckType, $newDeck) {
        if ($deckType === 'deck'){
            $this->cards->decks[$newDeck][] = $card;
        }
        else if ($deckType === 'pile'){
            $this->cards->pile_decks[$newDeck][] = $card;
        }
    }

    private function removeFromOldDeck($card, $deckType, $newDeck) {
        // If main deck
        if ($card->deck === '0') {
            $this->removeFromMainDeckShown($card);
        } else {
            // If numeric deck
            $this->removeFromNumericDeck($card, $deckType, $newDeck);
        }
        $card->deck = $newDeck;
    }

    private function removeFromMainDeckShown($card) {
        foreach ($this->cards->main_deck_shown as $key => $currentCard) {
            if ($currentCard->uuid === $card->uuid) {
                unset($this->cards->main_deck_shown[$key]);
                $this->cards->main_deck_shown = array_values($this->cards->main_deck_shown);
                break;
            }
        }
    }

    private function removeFromNumericDeck($card, $deckType, $newDeck) {
        $card_deck = intval($card->deck);

        if ($card->deck_type === 'deck'){
            foreach ($this->cards->decks[$card_deck] as $key => $currentCard) {
                if ($currentCard->uuid === $card->uuid) {
                    $card->deck_type = $deckType;
                    unset($this->cards->decks[$card_deck][$key]);
                    $this->cards->decks[$card_deck] = array_values($this->cards->decks[$card_deck]);
                }
            }
        }
        else if ($card->deck_type === 'pile'){
            foreach ($this->cards->pile_decks[$card_deck] as $key => $currentCard) {
                if ($currentCard->uuid === $card->uuid) {
                    $card->deck_type = $deckType;
                    unset($this->cards->pile_decks[$card_deck][$key]);
                    $this->cards->pile_decks[$card_deck] = array_values($this->cards->pile_decks[$card_deck]);
                }
            }
        }
    }

    public function findDroppedCards($droppedCards) {
        $foundCards = [];

        $droppedUuids = array_map(function($droppedCard) {
            return $droppedCard->uuid;
        }, $droppedCards);

        foreach ($this->cards->main_deck as $card) {
            if (in_array($card->uuid, $droppedUuids)) {
                $foundCards[] = $card;
            }
        }

        foreach ($this->cards->main_deck_shown as $card) {
            if (in_array($card->uuid, $droppedUuids)) {
                $foundCards[] = $card;
            }
        }

        foreach ($this->cards->pile_decks as $deck) {
            foreach ($deck as $card) {
                if (in_array($card->uuid, $droppedUuids)) {
                    $foundCards[] = $card;
                }
            }
        }

        foreach ($this->cards->decks as $deck) {
            foreach ($deck as $card) {
                if (in_array($card->uuid, $droppedUuids)) {
                    $foundCards[] = $card;
                }
            }
        }

        return $foundCards;
    }

    function generateUniqueUuid(&$existingUuids): string
    {
        do {
            $uuid = Uuid::uuid4()->toString();
        } while (in_array($uuid, $existingUuids));

        return $uuid;
    }

    function generateUuids(&$cards): void
    {
        $existingUuids = [];

        for ($i = 0; $i < count($cards); $i++) {
            $uniqueUuid = $this->generateUniqueUuid($existingUuids);
            $existingUuids[] = $uniqueUuid;
            $cards[$i]->uuid = $uniqueUuid;
        }
    }
}
