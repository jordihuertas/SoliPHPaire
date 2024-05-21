let draggableCards;
let droppableSlots;

let evLsDraggable_start = [];
let evLsDraggable_enter = [];
let evLsDraggable_over = [];
let evLsDraggable_end = [];
let evLsDroppable_drop = [];
let evLsDroppable_enter = [];
let evLsDroppable_over = [];
let evLsDroppable_leave = [];

StartDragAndDrop();

function StartDragAndDrop(){
    draggableCards = document.querySelectorAll('[drag-item]');
    droppableSlots = document.querySelectorAll('[drop-item]');

    let draggingElement = null;

    // DRAGGABLE CARDS
    draggableCards.forEach((item, i) => {
        // DRAG START
        const handleDragStart = e => {
            // e.currentTarget.setAttribute('dragging', true);
            e.currentTarget.classList.add('poker-card--selected');
            draggingElement = e.currentTarget;
        };
        evLsDraggable_start[i] = handleDragStart;
        item.addEventListener('dragstart', handleDragStart);

        // DRAG ENTER
        const handleDragEnter = e => {
            e.preventDefault();
        };
        evLsDraggable_enter[i] = handleDragEnter;
        item.addEventListener('dragenter', handleDragEnter);

        // DRAG OVER
        const handleDragOver = e => {
            e.preventDefault();
        };
        evLsDraggable_over[i] = handleDragOver;
        item.addEventListener('dragover', handleDragOver);

        // DRAG END
        const handleDragEnd = e => {
            e.currentTarget.classList.remove('poker-card--selected');
        };
        evLsDraggable_end[i] = handleDragEnd;
        item.addEventListener('dragend', handleDragEnd);
    });

    // DROPPABLE SLOTS
    droppableSlots.forEach((item, i) => {
        // DRAG DROP
        const handleDrop = e => {
            // Prevent drop if same card
            if (e.currentTarget === draggingElement)
                return;

            // Get dragging card index
            let draggingCardIndex = draggingElement.getAttribute('card-index');

            // Get dropping slot index
            let cardIndex = e.currentTarget.getAttribute('card-index');
            if (cardIndex == null) // If is null it is a slot, so the card index should be 1
                cardIndex = 1;
            else
                cardIndex++; // Increment the card index to apply the correct class style

            if (cardIndex >= 1){
                let previousSibling = draggingElement.previousElementSibling;
                previousSibling.setAttribute('drop-item', "true");
            }

            // Update dragging element index
            draggingElement.classList.remove('card-index-'+draggingCardIndex);
            draggingElement.classList.add('card-index-'+cardIndex);
            draggingElement.setAttribute('card-index', cardIndex);

            // Update dragging element dom
            e.currentTarget.after(draggingElement);
            e.currentTarget.classList.remove('poker-card--hover-drop');

            // Remove drop-item from dropped slot to prevent others drop here
            e.currentTarget.removeAttribute('drop-item');

            // Resets drag and drop
            ResetDragAndDrop();
        };
        evLsDroppable_drop[i] = handleDrop;
        item.addEventListener('drop', handleDrop);

        // DRAG ENTER
        const handleDragEnter = e => {
            console.log('Enter');
            if (e.currentTarget !== draggingElement){
                e.currentTarget.classList.add('poker-card--hover-drop');
            }
            e.preventDefault();
        };
        evLsDroppable_enter[i] = handleDragEnter;
        item.addEventListener('dragenter', handleDragEnter);

        // DRAG OVER
        const handleDragOver = e => {
            e.preventDefault();
        };
        evLsDroppable_over[i] = handleDragOver;
        item.addEventListener('dragover', handleDragOver);

        // DRAG LEAVE
        const handleDragLeave = e => {
            e.currentTarget.classList.remove('poker-card--hover-drop');
            console.log('Leave');
        };
        evLsDroppable_leave[i] = handleDragLeave;
        item.addEventListener('dragleave', handleDragLeave);
    });
}

function ResetDragAndDrop(){
    draggableCards.forEach((item, i) => {
        item.removeEventListener('dragstart', evLsDraggable_start[i]);
        item.removeEventListener('dragenter', evLsDraggable_enter[i]);
        item.removeEventListener('dragover', evLsDraggable_over[i]);
        item.removeEventListener('dragend', evLsDraggable_end[i]);
    });

    droppableSlots.forEach((item, i) => {
        item.removeEventListener('drop', evLsDroppable_drop[i]);
        item.removeEventListener('dragenter', evLsDroppable_enter[i]);
        item.removeEventListener('dragover', evLsDroppable_over[i]);
        item.removeEventListener('dragleave', evLsDroppable_leave[i]);
    });

    StartDragAndDrop();
}
