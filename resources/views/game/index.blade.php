@extends("layouts.app")
@section("content")
    <header class="mb-auto align-self-center">
        <div>
            <h1 class="float-md-start mb-0">SoliPHPairE</h1>
            <a href="{{ route('mainMenu') }}">
                <h2>Back to menu</h2>
            </a>
        </div>
    </header>

    <main class="px-3">
        <div class="container">
            <div class="row">
                <div class="col-1">
                    Deck
                </div>
                <div class="col-1 offset-2">
                    Deck
                </div>
                <div class="col-1">
                    Deck
                </div>
                <div class="col-1">
                    Deck
                </div>
                <div class="col-1">
                    Deck
                </div>
            </div>
            <div class="row">
                <div class="col-1">
                    Deck
                </div>
                <div class="col-1">
                    Deck
                </div>
                <div class="col-1">
                    Deck
                </div>
                <div class="col-1">
                    Deck
                </div>
                <div class="col-1">
                    Deck
                </div>
                <div class="col-1">
                    Deck
                </div>
                <div class="col-1">
                    Deck
                </div>
            </div>
        </div>
        <div class="container">
            <h2>Main Deck</h2>
            @php $i=1; @endphp
            @foreach($cards->main_deck as $card)
                @if ($i % 7 == 1)
                    <div class="row">
                @endif
                <div class="col-1">
                    <x-card :number="$card->number" :typeName="$card->type->name" :isHidden="$card->isHidden" :cardDeck="$card->deck" :cardPosition="$card->position"/>
                </div>
                @php $i++ @endphp
                @if ($i % 7 == 1 || $loop->last)
                    </div>
                @endif
            @endforeach
            <h2>Deck 1</h2>
            @php $i=1; @endphp
            @foreach($cards->decks[1] as $card)
                @if ($i % 7 == 1)
                    <div class="row">
                        @endif
                        <div class="col-1">
                            <x-card :number="$card->number" :typeName="$card->type->name" :isHidden="$card->isHidden" :cardDeck="$card->deck" :cardPosition="$card->position"/>
                        </div>
                        @php $i++ @endphp
                        @if ($i % 7 == 1 || $loop->last)
                    </div>
                @endif
            @endforeach
            <h2>Deck 2</h2>
            @php $i=1; @endphp
            @foreach($cards->decks[2] as $card)
                @if ($i % 7 == 1)
                    <div class="row">
                        @endif
                        <div class="col-1">
                            <x-card :number="$card->number" :typeName="$card->type->name" :isHidden="$card->isHidden" :cardDeck="$card->deck" :cardPosition="$card->position"/>
                        </div>
                        @php $i++ @endphp
                        @if ($i % 7 == 1 || $loop->last)
                    </div>
                @endif
            @endforeach
            <h2>Deck 3</h2>
            <div class="row">
            @php $i=1; @endphp
            @foreach($cards->decks[3] as $card)
                @if ($i % 7 == 1)
                    <div class="row">
                        @endif
                        <div class="col-1">
                            <x-card :number="$card->number" :typeName="$card->type->name" :isHidden="$card->isHidden" :cardDeck="$card->deck" :cardPosition="$card->position"/>
                        </div>
                        @php $i++ @endphp
                        @if ($i % 7 == 1 || $loop->last)
                    </div>
                @endif
            @endforeach
            </div>
            <h2>Deck 4</h2>
            @php $i=1; @endphp
            @foreach($cards->decks[4] as $card)
                @if ($i % 7 == 1)
                    <div class="row">
                        @endif
                        <div class="col-1">
                            <x-card :number="$card->number" :typeName="$card->type->name" :isHidden="$card->isHidden" :cardDeck="$card->deck" :cardPosition="$card->position"/>
                        </div>
                        @php $i++ @endphp
                        @if ($i % 7 == 1 || $loop->last)
                    </div>
                @endif
            @endforeach
            <h2>Deck 5</h2>
            @php $i=1; @endphp
            @foreach($cards->decks[5] as $card)
                @if ($i % 7 == 1)
                    <div class="row">
                        @endif
                        <div class="col-1">
                            <x-card :number="$card->number" :typeName="$card->type->name" :isHidden="$card->isHidden" :cardDeck="$card->deck" :cardPosition="$card->position"/>
                        </div>
                        @php $i++ @endphp
                        @if ($i % 7 == 1 || $loop->last)
                    </div>
                @endif
            @endforeach
            <h2>Deck 6</h2>
            @php $i=1; @endphp
            @foreach($cards->decks[6] as $card)
                @if ($i % 7 == 1)
                    <div class="row">
                        @endif
                        <div class="col-1">
                            <x-card :number="$card->number" :typeName="$card->type->name" :isHidden="$card->isHidden" :cardDeck="$card->deck" :cardPosition="$card->position"/>
                        </div>
                        @php $i++ @endphp
                        @if ($i % 7 == 1 || $loop->last)
                    </div>
                @endif
            @endforeach
            <h2>Deck 7</h2>
            @php $i=1; @endphp
            @foreach($cards->decks[7] as $card)
                @if ($i % 7 == 1)
                    <div class="row">
                        @endif
                        <div class="col-1">
                            <x-card :number="$card->number" :typeName="$card->type->name" :isHidden="$card->isHidden" :cardDeck="$card->deck" :cardPosition="$card->position"/>
                        </div>
                        @php $i++ @endphp
                        @if ($i % 7 == 1 || $loop->last)
                    </div>
                @endif
            @endforeach
        </div>
    </main>

    <footer class="mt-auto text-white-50">
        <p>Made by Jordi Huertas</p>
    </footer>
@endsection

@push('custom-scripts')
{{--    @vite(['resources/js/test.js']) I think that I remember it should be added to vite config--}}
@endpush
