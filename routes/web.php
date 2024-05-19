<?php

use App\Livewire\Game;
use App\Livewire\Menu;
use Illuminate\Support\Facades\Route;

Route::get('/', Menu::class);
Route::get('/game', Game::class);
