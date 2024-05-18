<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MainMenuController extends Controller
{
    public function index(Request $request){
        return view('main_menu.index');
    }
}
