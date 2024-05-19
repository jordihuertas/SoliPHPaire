<div>
    <div class="container">
        <div class="row">
            <div class="col">
                <a href="/" wire:navigate>
                    <h2>Back to menu</h2>
                </a>
            </div>
        </div>
    </div>

    <div class="container main-decks pt-5 mt-5">
        <div class="row ">
            <div class="col-1">
                <x-card-slot/>
                @php
                    $card = last($cards->main_deck);
                    $index = array_key_last($cards->main_deck);
                @endphp
                <x-card :number="$card->number" :typeName="$card->type->name" :isHidden="$card->isHidden" :cardDeck="$card->deck" :cardPosition="$card->position" :card-index="$index"/>
            </div>
            <div class="col-1">
                <x-card-slot/>
            </div>
            <div class="col-1 offset-1">
                <x-card-slot/>
            </div>
            <div class="col-1">
                <x-card-slot/>
            </div>
            <div class="col-1">
                <x-card-slot/>
            </div>
            <div class="col-1">
                <x-card-slot/>
            </div>
        </div>
    </div>
    <div class="container other-decks pt-5 mt-5">
        <div class="row">
            <div class="col-1">
                <x-card-slot/>
                @foreach($cards->decks[1] as $card)
                    @php $index = $loop->index + 1 @endphp
                    <x-card :number="$card->number" :typeName="$card->type->name" :isHidden="$card->isHidden" :cardDeck="$card->deck" :cardPosition="$card->position" :card-index="$index"/>
                @endforeach
            </div>
            <div class="col-1">
                <x-card-slot/>
                @foreach($cards->decks[2] as $card)
                    @php $index = $loop->index + 1 @endphp
                    <x-card :number="$card->number" :typeName="$card->type->name" :isHidden="$card->isHidden" :cardDeck="$card->deck" :cardPosition="$card->position" :card-index="$index"/>
                @endforeach
            </div>
            <div class="col-1">
                <x-card-slot/>
                @foreach($cards->decks[3] as $card)
                    @php $index = $loop->index + 1 @endphp
                    <x-card :number="$card->number" :typeName="$card->type->name" :isHidden="$card->isHidden" :cardDeck="$card->deck" :cardPosition="$card->position" :card-index="$index"/>
                @endforeach
            </div>
            <div class="col-1">
                <x-card-slot/>
                @foreach($cards->decks[4] as $card)
                    @php $index = $loop->index + 1 @endphp
                    <x-card :number="$card->number" :typeName="$card->type->name" :isHidden="$card->isHidden" :cardDeck="$card->deck" :cardPosition="$card->position" :card-index="$index"/>
                @endforeach
            </div>
            <div class="col-1">
                <x-card-slot/>
                @foreach($cards->decks[5] as $card)
                    @php $index = $loop->index + 1 @endphp
                    <x-card :number="$card->number" :typeName="$card->type->name" :isHidden="$card->isHidden" :cardDeck="$card->deck" :cardPosition="$card->position" :card-index="$index"/>
                @endforeach
            </div>
            <div class="col-1">
                <x-card-slot/>
                @foreach($cards->decks[6] as $card)
                    @php $index = $loop->index + 1 @endphp
                    <x-card :number="$card->number" :typeName="$card->type->name" :isHidden="$card->isHidden" :cardDeck="$card->deck" :cardPosition="$card->position" :card-index="$index"/>
                @endforeach
            </div>
            {{-- DECK 7--}}
            <div class="col-1">
                <x-card-slot/>
                @foreach($cards->decks[7] as $card)
                    @php $index = $loop->index + 1 @endphp
                    <x-card :number="$card->number" :typeName="$card->type->name" :isHidden="$card->isHidden" :cardDeck="$card->deck" :cardPosition="$card->position" :card-index="$index"/>
                @endforeach
            </div>
        </div>
    </div>
</div>
