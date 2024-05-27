<?php

namespace App\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class CardSlot extends Component
{
    private bool $droppable;

    public function __construct($droppable)
    {
        $this->droppable = $droppable;
    }

    public function render(): View|Closure|string
    {
        $droppable = $this->droppable;
        dump($droppable);

        return view('components.card-slot', compact(['droppable']));
    }
}
