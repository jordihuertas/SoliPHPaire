<?php

namespace App\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;
use Livewire\Attributes\On;
use Livewire\Attributes\Renderless;

class Card extends Component
{
    /**
     * Create a new component instance.
     * @param $number
     * @param $typeName
     * @param $isHidden
     * @param $cardDeck
     * @param $cardPosition
     */

    private string $number;
    private string $typeName;
    private bool $isHidden;
    private string $cardDeck;
    private string $cardPosition;
    private string $cardIndex;

    public function __construct($number, $typeName, $isHidden, $cardDeck, $cardPosition, $cardIndex)
    {
        $this->number = $number;
        $this->typeName = $typeName;
        $this->isHidden = $isHidden;
        $this->cardDeck = $cardDeck;
        $this->cardPosition = $cardPosition;
        $this->cardIndex = $cardIndex;
    }

    public function render(): View|Closure|string
    {
        $number = 'hidden';
        $typeName = 'hidden';
        $isHidden = $this->isHidden;
        $cardDeck = $this->cardDeck;
        $cardPosition = $this->cardPosition;
        $cardIndex = $this->cardIndex;

        if (!$isHidden){
            $number = $this->number;
            $typeName = $this->typeName;

            switch ($number){
                case '1':
                    $number = 'A';
                    break;
                case '11':
                    $number = 'J';
                    break;
                case '12':
                    $number = 'Q';
                    break;
                case '13':
                    $number = 'K';
                    break;
                default:
                    break;
            }
        }

        return view('components.card', compact('number', 'typeName', 'isHidden', 'cardDeck', 'cardPosition', 'cardIndex'));
    }

    #[Renderless]
    public static function buildCard($card_data){
        $card = new Card($card_data->number, $card_data->type->name, false, 1, $card_data->position, 0);
        return $card->render()->render();
    }
}
