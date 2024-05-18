@extends("layouts.app")
@section("content")
        <header class="mb-auto align-self-center">
            <div>
                <h1 class="float-md-start mb-0">SoliPHPairE</h1>
            </div>
        </header>

        <main class="px-3">
            <a href="{{ route('game') }}">
                <h2>New Game</h2>
            </a>
            <a href="javascript:void(0);">
                <h2>Exit</h2>
            </a>
        </main>

        <footer class="mt-auto text-white-50">
            <p>Made by Jordi Huertas</p>
        </footer>
@endsection
