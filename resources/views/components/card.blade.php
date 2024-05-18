<div class="poker-card poker-card--{{ $typeName }} ratio ratio-2x3">
{{--    @if (!$reverse)--}}
        <i class="icon bi bi-suit-{{ $typeName }}-fill float-end"></i>
{{--    @endif--}}
    <div class="d-flex align-items-center justify-content-center text-center poker-card--number">
        <span class="gradient-text">{{ $number }}</span>
    </div>
</div>
