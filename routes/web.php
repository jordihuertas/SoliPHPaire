<?php

use Illuminate\Support\Facades\Route;

Route::get('/', [App\Http\Controllers\MainMenuController::class, 'index'])->name('mainMenu');
Route::get('/game', [App\Http\Controllers\GameController::class, 'index'])->name('game');
