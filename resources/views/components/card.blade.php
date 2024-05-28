<div class="poker-card poker-card--{{ $typeName }} card-index-{{ $cardIndex }} ratio ratio-2x3 mx-auto" card-index="{{ $cardIndex }}"
    @if(!$isHidden) drag-item drop-item @endif
    >
    @if(!$isHidden)
        <div class="row poker-card--top m-0">
            <div class="col text-start p-0">
                <span class="icon-number">{{ $number }}</span>
            </div>
            <div class="col text-end p-0">
                <i class="icon bi bi-suit-{{ $typeName }}-fill"></i>
            </div>
        </div>
    @endif
    <div class="row d-flex align-items-center justify-content-center text-center poker-card--number m-0">
        <span class="col gradient-text">@if(!$isHidden){{ $number }}@endif</span>
    </div>
    @if(!$isHidden)
        <div class="row poker-card--bottom m-0 align-items-end">
            <div class="col text-end p-0">
                <span class="icon-number">{{ $number }}</span>
            </div>
            <div class="col text-start p-0">
                <i class="icon bi bi-suit-{{ $typeName }}-fill"></i>
            </div>
        </div>
    @endif
</div>

{{--<span class="small text-secondary">Deck: {{ $cardDeck }} - Pos: {{ $cardPosition }}</span>--}}
