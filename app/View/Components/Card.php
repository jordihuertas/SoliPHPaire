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
     */

    private string $number;
    private string $typeName;


    public function __construct($number, $typeName)
    {
        $this->number = $number;
        $this->typeName = $typeName;
    }

    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View|Closure|string
    {
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

        return view('components.card', compact('number', 'typeName'));
    }
}
