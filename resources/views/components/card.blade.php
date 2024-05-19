<div class="poker-card poker-card--{{ $typeName }} card-index-{{ $cardIndex }} ratio ratio-2x3 mx-auto">
    @if(!$isHidden)
        <i class="icon bi bi-suit-{{ $typeName }}-fill float-end"></i>
    @endif
    <div class="d-flex align-items-center justify-content-center text-center poker-card--number">
        <span class="gradient-text">@if(!$isHidden){{ $number }}@endif</span>
    </div>
</div>

{{--<span class="small text-secondary">Deck: {{ $cardDeck }} - Pos: {{ $cardPosition }}</span>--}}
