<div id="game_container">
    <div class="container">
        <div class="row">
            <div class="col">
                <a href="/" wire:navigate>
                    <h2>Back to menu</h2>
                </a>
            </div>
        </div>
    </div>

    <div class="container main-decks">
        <div class="row ">
            <div id="main_deck" class="col-1">
                <x-card-slot :droppable="false"/>
                @php
                    $card = last($cards->main_deck);
                    $index = array_key_last($cards->main_deck);
                @endphp
                <x-card :uuid="$card->uuid" :number="$card->number" :typeName="$card->type->name" :isHidden="$card->isHidden" :cardDeck="$card->deck" :cardPosition="$card->position" :card-index="$index"/>
            </div>
            <div id="main_deck_shown" class="col-1">
                <x-card-slot :droppable="false"/>
            </div>
            <div class="col-1 offset-1 pile-deck h-0">
                <x-card-slot :droppable="true"/>
            </div>
            <div class="col-1 pile-deck">
                <x-card-slot :droppable="true"/>
            </div>
            <div class="col-1 pile-deck">
                <x-card-slot :droppable="true"/>
            </div>
            <div class="col-1 pile-deck">
                <x-card-slot :droppable="true"/>
            </div>
        </div>
    </div>
    <div class="container other-decks">
        <div class="row">
            <div class="col-1 card-deck" card-deck="1">
                <x-card-slot :droppable="false"/>
                @foreach($cards->decks[1] as $card)
                    @php $index = $loop->index + 1 @endphp
                    <x-card :uuid="$card->uuid" :number="$card->number" :typeName="$card->type->name" :isHidden="$card->isHidden" :cardDeck="$card->deck" :cardPosition="$card->position" :card-index="$index"/>
                @endforeach
            </div>
            <div class="col-1 card-deck" card-deck="2">
                <x-card-slot :droppable="false"/>
                @foreach($cards->decks[2] as $card)
                    @php $index = $loop->index + 1 @endphp
                    <x-card :uuid="$card->uuid" :number="$card->number" :typeName="$card->type->name" :isHidden="$card->isHidden" :cardDeck="$card->deck" :cardPosition="$card->position" :card-index="$index"/>
                @endforeach
            </div>
            <div class="col-1 card-deck" card-deck="3">
                <x-card-slot :droppable="false"/>
                @foreach($cards->decks[3] as $card)
                    @php $index = $loop->index + 1 @endphp
                    <x-card :uuid="$card->uuid" :number="$card->number" :typeName="$card->type->name" :isHidden="$card->isHidden" :cardDeck="$card->deck" :cardPosition="$card->position" :card-index="$index"/>
                @endforeach
            </div>
            <div class="col-1 card-deck" card-deck="4">
                <x-card-slot :droppable="false"/>
                @foreach($cards->decks[4] as $card)
                    @php $index = $loop->index + 1 @endphp
                    <x-card :uuid="$card->uuid" :number="$card->number" :typeName="$card->type->name" :isHidden="$card->isHidden" :cardDeck="$card->deck" :cardPosition="$card->position" :card-index="$index"/>
                @endforeach
            </div>
            <div class="col-1 card-deck" card-deck="5">
                <x-card-slot :droppable="false"/>
                @foreach($cards->decks[5] as $card)
                    @php $index = $loop->index + 1 @endphp
                    <x-card :uuid="$card->uuid" :number="$card->number" :typeName="$card->type->name" :isHidden="$card->isHidden" :cardDeck="$card->deck" :cardPosition="$card->position" :card-index="$index"/>
                @endforeach
            </div>
            <div class="col-1 card-deck" card-deck="6">
                <x-card-slot :droppable="false"/>
                @foreach($cards->decks[6] as $card)
                    @php $index = $loop->index + 1 @endphp
                    <x-card :uuid="$card->uuid" :number="$card->number" :typeName="$card->type->name" :isHidden="$card->isHidden" :cardDeck="$card->deck" :cardPosition="$card->position" :card-index="$index"/>
                @endforeach
            </div>
            {{-- DECK 7--}}
            <div class="col-1 card-deck" card-deck="7">
                <x-card-slot :droppable="false"/>
                @foreach($cards->decks[7] as $card)
                    @php $index = $loop->index + 1 @endphp
                    <x-card :uuid="$card->uuid" :number="$card->number" :typeName="$card->type->name" :isHidden="$card->isHidden" :cardDeck="$card->deck" :cardPosition="$card->position" :card-index="$index"/>
                @endforeach
            </div>
        </div>
    </div>
    <button @click="$dispatch('test-event')">...</button>


    @assets
        @vite('resources/js/drag-and-drop.js')
        @vite('resources/js/game-controller.js')
    @endassets

    @script
    <script>
        document.addEventListener('livewire:navigated', () => {
            const gameComponent = @this;
            new GameController();
        });
    </script>
    @endscript
</div>

