let draggableCards = document.querySelectorAll('[drag-item]');
let droppableSlots = document.querySelectorAll('[drop-item]');

let draggingElement = null;


draggableCards.forEach(item => {
    item.addEventListener('dragstart', e => {
        e.currentTarget.setAttribute('dragging', true);
        e.currentTarget.classList.add('poker-card--selected');
        draggingElement = e.currentTarget;
    });

    // item.addEventListener('drop', e => {
    //     console.log('drop A');
    // });

    item.addEventListener('dragenter', e => {
        e.preventDefault();
    });

    item.addEventListener('dragover', e => {
        e.preventDefault();
    });

    item.addEventListener('dragend', e => {
        e.currentTarget.classList.remove('poker-card--selected');
    });
});

droppableSlots.forEach(item => {
    item.addEventListener('drop', e => {
        // If same card, return
        if (e.currentTarget === draggingElement)
            return;

        // Dragging card index
        let draggingCardIndex = draggingElement.getAttribute('card-index');

        // Droppable card index slot
        let cardIndex = e.currentTarget.getAttribute('card-index');

        if (cardIndex == null)
            cardIndex = 1;
        else
            cardIndex++;

        // Update card index
        draggingElement.classList.remove('card-index-'+draggingCardIndex);
        draggingElement.classList.add('card-index-'+cardIndex);
        draggingElement.setAttribute('card-index', cardIndex);

        // Update dom
        e.currentTarget.after(draggingElement);
        e.currentTarget.classList.remove('poker-card--hover-drop');
    });

    item.addEventListener('dragenter', e => {
        console.log('Enter');
        // If not the same dragging card, add hover drop fx
        if (e.currentTarget !== draggingElement){
            e.currentTarget.classList.add('poker-card--hover-drop');
        }
        e.preventDefault();
    });

    item.addEventListener('dragover', e => {
        e.preventDefault();
    });

    item.addEventListener('dragleave', e => {
        e.currentTarget.classList.remove('poker-card--hover-drop');
        console.log('Leave');
    });
});
