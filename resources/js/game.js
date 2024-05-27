let draggableCards;
let droppableSlots;


let target = null;

let evLsDraggable_mouseOver = [];
let evLsDraggable_mouseLeave = [];
let evLsDraggable_mouseDown = [];

StartDragAndDrop();

function StartDragAndDrop() {
    draggableCards = document.querySelectorAll('[drag-item]');
    droppableSlots = document.querySelectorAll('[drop-item]');

    let draggingElement = null;
    let draggingElements = [];
    let prevDraggingElement = null;
    let nextDraggingElements = [];
    let offsetX = 0;
    let offsetY = 0;
    let originalPosition = null;

    draggableCards.forEach((item, i) => {
        const handleMouseOver = e => {
            e.target.classList.add('poker-card--selected');
        };
        evLsDraggable_mouseOver[i] = handleMouseOver;
        item.addEventListener('mouseover', handleMouseOver);

        const handleMouseLeave = e => {
            e.target.classList.remove('poker-card--selected');
        };
        evLsDraggable_mouseLeave[i] = handleMouseLeave;
        item.addEventListener('mouseleave', handleMouseLeave);

        const handleMouseDown = e => {
            e.preventDefault();
            draggingElement = e.target;

            //Get prev dragging el
            prevDraggingElement = e.target.previousElementSibling;

            // nextDraggingElements = getNextSiblings(draggingElement)
            nextDraggingElements = getNextSiblings(draggingElement, '.poker-card');

            offsetX = e.clientX - draggingElement.getBoundingClientRect().left;
            offsetY = e.clientY - draggingElement.getBoundingClientRect().top;
            originalPosition = draggingElement.parentNode; // Guarda la posición original
            document.querySelector('#game_container').after(draggingElement);

            draggingElement.style.position = 'fixed';
            draggingElement.style.left = `${e.clientX - offsetX}px`;
            draggingElement.style.top = `${e.clientY - offsetY}px`;

            if (nextDraggingElements.length > 0){
                nextDraggingElements.forEach((sibling, index) => {
                    sibling.style.position = 'fixed';
                    sibling.style.left = `${e.clientX - offsetX}px`;
                    sibling.style.top = `${e.clientY - offsetY + (+20)}px`;
                    sibling.style.zIndex = index.toString() + 9999;
                });
            }

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        };
        evLsDraggable_mouseDown[i] = handleMouseDown;
        item.addEventListener('mousedown', handleMouseDown);
    });

    const handleMouseMove = e => {
        if (draggingElement) {
            draggingElement.style.position = 'fixed';
            draggingElement.style.left = `${e.clientX - offsetX}px`;
            draggingElement.style.top = `${e.clientY - offsetY}px`;

            if (nextDraggingElements.length > 0){
                nextDraggingElements.forEach((sibling, index) => {
                    sibling.style.position = 'fixed';
                    sibling.style.left = `${e.clientX - offsetX}px`;
                    sibling.style.top = `${e.clientY - offsetY + (+20 * (index+1))}px`;
                    sibling.style.zIndex = index.toString() + 1;
                });
            }

            checkCollision();
        }
    };

    const handleMouseUp = () => {
        if (draggingElement) {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            if (target == null) {
                originalPosition.appendChild(draggingElement);
                draggingElement.removeAttribute('style');
                return;
            }

            let targetCardIndex= target.getAttribute('card-index');
            if (targetCardIndex === null ){
                targetCardIndex = 0;
            }
            let nextCardIndex = parseInt(targetCardIndex) + 1;
            target.after(draggingElement);
            let draggingElementCardIndex = draggingElement.getAttribute('card-index');
            draggingElement.classList.remove('card-index-'+draggingElementCardIndex);
            draggingElement.classList.add('card-index-'+nextCardIndex);
            draggingElement.setAttribute('card-index', nextCardIndex);
            draggingElement.removeAttribute('style');
            draggingElement = null;
            target.removeAttribute('drop-item');
            if (prevDraggingElement !== null){
                prevDraggingElement.setAttribute('drop-item', 'true');
            }
            droppableSlots.forEach(slot => {
                slot.classList.remove('poker-card--selected');
            });

            ResetDragAndDrop();
        }
    };

    const checkCollision = () => {
        if (!draggingElement) return;

        const draggingRect = draggingElement.getBoundingClientRect();
        let closestSlot = null;
        let minDistance = Infinity;

        droppableSlots.forEach(slot => {
            if (slot !== draggingElement && slot.hasAttribute('drop-item')) {
                const slotRect = slot.getBoundingClientRect();
                if (
                    draggingRect.left < slotRect.right &&
                    draggingRect.right > slotRect.left &&
                    draggingRect.top < slotRect.bottom &&
                    draggingRect.bottom > slotRect.top
                ) {
                    const slotCenterX = slotRect.left + slotRect.width / 2;
                    const slotCenterY = slotRect.top + slotRect.height / 2;
                    const draggingCenterX = draggingRect.left + draggingRect.width / 2;
                    const draggingCenterY = draggingRect.top + draggingRect.height / 2;
                    const distance = Math.sqrt(
                        Math.pow(draggingCenterX - slotCenterX, 2) +
                        Math.pow(draggingCenterY - slotCenterY, 2)
                    );

                    if (distance < minDistance) {
                        minDistance = distance;
                        closestSlot = slot;
                    }
                }
            }
        });

        droppableSlots.forEach(slot => {
            slot.classList.remove('poker-card--selected');
        });

        if (closestSlot) {
            closestSlot.classList.add('poker-card--selected');
            // console.log('Closest slot:', closestSlot);
            target = closestSlot;
        } else {
            target = null;
        }
    };
}

function ResetDragAndDrop(){
    draggableCards.forEach((item, i) => {
        item.removeEventListener('mouseover', evLsDraggable_mouseOver[i]);
        item.removeEventListener('mouseleave', evLsDraggable_mouseLeave[i]);
        item.removeEventListener('mousedown', evLsDraggable_mouseDown[i]);
    });

    StartDragAndDrop();
}

function matches(elem, filter) {
    if (elem && elem.nodeType === 1) {
        if (filter) {
            return elem.matches(filter);
        }
        return true;
    }
    return false;
}

function getNextSiblings(element, filter) {
    let siblings = [];
    while (element = element.nextSibling) {
        if (matches(element, filter)) {
            siblings.push(element);
        }
    }
    return siblings;
}
