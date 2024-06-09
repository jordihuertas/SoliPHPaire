<?php

namespace App\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class CardSlot extends Component
{
    private bool $droppable;
    private bool $winGameSpawnPoint;

    public function __construct($droppable, $winGameSpawnPoint = false)
    {
        $this->droppable = $droppable;
        $this->winGameSpawnPoint = $winGameSpawnPoint;
    }

    public function render(): View|Closure|string
    {
        $droppable = $this->droppable;
        $winGameSpawnPoint = $this->winGameSpawnPoint;

        return view('components.card-slot', compact(['droppable', 'winGameSpawnPoint']));
    }
}
