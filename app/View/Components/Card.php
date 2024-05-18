<?php

namespace App\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

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

    public function __construct($number, $typeName, $isHidden, $cardDeck, $cardPosition)
    {
        $this->number = $number;
        $this->typeName = $typeName;
        $this->isHidden = $isHidden;
        $this->cardDeck = $cardDeck;
        $this->cardPosition = $cardPosition;
    }

    public function render(): View|Closure|string
    {
        $number = 'hidden';
        $typeName = 'hidden';
        $isHidden = $this->isHidden;
        $cardDeck = $this->cardDeck;
        $cardPosition = $this->cardPosition;

        if (!$isHidden){
            $number = $this->number;
            $typeName = $this->typeName;

            switch ($number){
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

        return view('components.card', compact('number', 'typeName', 'isHidden', 'cardDeck', 'cardPosition'));
    }
}
