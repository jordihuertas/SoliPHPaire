let draggableCards;
let droppableSlots;

let target = null;

let evLsDraggable_mouseOver = [];
let evLsDraggable_mouseLeave = [];
let evLsDraggable_mouseDown = [];

const cssClass_pokerCard = 'poker-card';
const cssClass_pokerCardDragging = 'poker-card--dragging';
const cssClass_pokerCardSelected = 'poker-card--selected';
const cssClass_pokerCardSelectedStack = 'poker-card--selected__stack';
const cssClass_pokerCardAnimating = 'poker-card--animating';

const attr_dragItem = 'drag-item';
const attr_dropItem = 'drop-item';

StartDragAndDrop();

function StartDragAndDrop() {
    let draggingElement = null;
    let prevDraggingElement = null;
    let nextDraggingElements = [];
    let offsetX = 0;
    let offsetY = 0;
    let originalParentNode = null;
    let originalPosition = {
        top: 0,
        left : 0
    };

    draggableCards = document.querySelectorAll('['+attr_dragItem+']');
    droppableSlots = document.querySelectorAll('['+attr_dropItem+']');

    draggableCards.forEach((item, i) => {
        const handleMouseOver = e => {
            e.target.classList.add(cssClass_pokerCardSelected);
            let nextDraggingElements = getNextSiblings(e.target, '.'+cssClass_pokerCard);
            if (nextDraggingElements.length > 0){
                nextDraggingElements.forEach((sibling, index) => {
                    sibling.classList.add(cssClass_pokerCardSelectedStack);
                });
            }
        };
        evLsDraggable_mouseOver[i] = handleMouseOver;
        item.addEventListener('mouseover', handleMouseOver);

        const handleMouseLeave = e => {
            // Remove card selected class
            e.target.classList.remove(cssClass_pokerCardSelected);
            let nextDraggingElements = getNextSiblings(e.target, '.'+cssClass_pokerCard);
            // If is a card stack, remove the card stack selected class for each card
            if (nextDraggingElements.length > 0){
                nextDraggingElements.forEach((sibling, index) => {
                    sibling.classList.remove(cssClass_pokerCardSelectedStack);
                });
            }
        };
        evLsDraggable_mouseLeave[i] = handleMouseLeave;
        item.addEventListener('mouseleave', handleMouseLeave);

        const handleMouseDown = e => {
            e.preventDefault();
            draggingElement = e.target;

            // Remove mouseover and mouseleave event listeners
            item.removeEventListener('mouseover', evLsDraggable_mouseOver[i]);
            item.removeEventListener('mouseleave', evLsDraggable_mouseLeave[i]);

            // Get previous sibling of the dragging element
            prevDraggingElement = e.target.previousElementSibling;

            // Get all next siblings of the dragging element
            nextDraggingElements = getNextSiblings(draggingElement, '.'+cssClass_pokerCard);

            // Get bounding
            offsetX = e.clientX - draggingElement.getBoundingClientRect().left;
            offsetY = e.clientY - draggingElement.getBoundingClientRect().top;

            // Save the original dragging element position.
            // (In case the player drops the card on an invalid drop site, it should return to its original position).
            originalParentNode = draggingElement.parentNode;
            originalPosition.top = draggingElement.getBoundingClientRect().top;
            originalPosition.left = draggingElement.getBoundingClientRect().left;

            draggingElement.classList.remove(cssClass_pokerCardSelected);
            draggingElement.classList.add(cssClass_pokerCardDragging);
            nextDraggingElements.forEach((item, i) => {
                item.classList.add(cssClass_pokerCardDragging);
                item.classList.add(cssClass_pokerCardSelectedStack);
            });

            // Fix the dragging card and stacked cards position to bounding before mouse move
            fixCardPositionToBounding(draggingElement, e, offsetX, offsetY, true);
            fixStackedCardsPositionToBounding(nextDraggingElements, e, offsetX, offsetY, true);

            // Add required event listeners to move and drop the cards
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);

            // Move the dragging element to another container to avoid zIndex issues on hovering drop slots.
            draggingElement.style.zIndex=1;
            // document.querySelector('#game_container').after(draggingElement);
        };
        evLsDraggable_mouseDown[i] = handleMouseDown;
        item.addEventListener('mousedown', handleMouseDown);
    });

    const handleMouseMove = e => {
        if (draggingElement) {
            // Fix the dragging card and stacked cards position to bounding while mouse move
            fixCardPositionToBounding(draggingElement, e, offsetX, offsetY, false);
            fixStackedCardsPositionToBounding(nextDraggingElements, e, offsetX, offsetY, false)

            // Collision detection for droppable slots
            checkCollision();
        }
    };

    const handleMouseUp = async () => {
        if (draggingElement) {
            // Remove unused event listeners for this card
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);

            // If player mouse up on undroppable slot...
            if (target == null) {
                // Reset dragging element styles and position to its original
                nextDraggingElements.unshift(draggingElement);
                await moveElementsTo(nextDraggingElements, originalPosition);
                nextDraggingElements.forEach((sibling, index) => {
                    sibling.classList.remove(cssClass_pokerCardDragging);
                    sibling.removeAttribute('style');
                    originalParentNode.appendChild(sibling);
                    // Set the last element as droppable slot
                    if ((index+1) === nextDraggingElements.length){
                        sibling.setAttribute(attr_dropItem, 'true');
                    }
                });

                // Stop execution and reset drag and drop to restart all event listeners.
                ResetDragAndDrop();
                return;
            }

            // If player mouse up on a droppable slot...
            // Get droppable slot card index to calculate witch classes will have each card.
            let targetCardIndex= target.getAttribute('card-index');
            if (targetCardIndex === null ){
                targetCardIndex = 0;
            }
            let nextCardIndex = parseInt(targetCardIndex);

            nextDraggingElements.unshift(draggingElement);
            originalPosition.top = target.getBoundingClientRect().top + 20;
            originalPosition.left = target.getBoundingClientRect().left;
            await moveElementsTo(nextDraggingElements, originalPosition);
            nextDraggingElements.forEach((sibling, index) => {
                sibling.classList.remove(cssClass_pokerCardDragging);
                sibling.removeAttribute('style');
                target.parentNode.appendChild(sibling);
                nextCardIndex++;
                let siblingCardIndex = sibling.getAttribute('card-index');
                sibling.classList.remove('card-index-'+siblingCardIndex);
                sibling.classList.add('card-index-'+nextCardIndex);
                sibling.setAttribute('card-index', nextCardIndex);
                sibling.removeAttribute('style');
                // Set the last element as droppable slot
                if ((index+1) === nextDraggingElements.length){
                    sibling.setAttribute(attr_dropItem, 'true');
                }
            });

            // Remove droppable slot where the dragging card has been dropped on.
            target.removeAttribute(attr_dropItem);
            if (prevDraggingElement !== null){
                prevDraggingElement.setAttribute(attr_dropItem, 'true');
            }

            // Remove selected classes of the droppable slots
            droppableSlots.forEach(slot => {
                slot.classList.remove(cssClass_pokerCardSelected);
            });

            // SReset drag and drop to restart all event listeners.
            ResetDragAndDrop();
        }
    };

    const checkCollision = () => {
        if (!draggingElement) return;

        const draggingRect = draggingElement.getBoundingClientRect();
        let closestSlot = null;
        let minDistance = Infinity;

        // It is necessary to get all droppable slots again because they change on selecting cards
        droppableSlots = document.querySelectorAll('['+attr_dropItem+']');

        droppableSlots.forEach(slot => {
            if (slot !== draggingElement && slot.hasAttribute(attr_dropItem)) {
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
            slot.classList.remove(cssClass_pokerCardSelected);
        });

        if (closestSlot) {
            closestSlot.classList.add(cssClass_pokerCardSelected);
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

function fixCardPositionToBounding(draggingElement, event, offsetX, offsetY, removeDropItemAttr){
    // Fix position
    draggingElement.style.position = 'fixed';
    draggingElement.style.left = `${event.clientX - offsetX}px`;
    draggingElement.style.top = `${event.clientY - offsetY}px`;

    if (!removeDropItemAttr) return;
    // Removes drop-item attr to avoid collision itself.
    draggingElement.removeAttribute(attr_dropItem);
}

function fixStackedCardsPositionToBounding(nextDraggingElements, event, offsetX, offsetY, removeDropItemAttr){
    // Fix position
    if (nextDraggingElements.length > 0){
        nextDraggingElements.forEach((sibling, index) => {
            sibling.style.position = 'fixed';
            sibling.style.left = `${event.clientX - offsetX}px`;
            sibling.style.top = `${event.clientY - offsetY + ((index+1) * 20)}px`;
            sibling.style.zIndex = (index + 1).toString();

            if (removeDropItemAttr){
                // Removes drop-item attr to avoid collision with the dragging top card.
                sibling.removeAttribute(attr_dropItem);
            }
        });
    }
}

const moveElementsTo = async (elements, toPosition) => {
    elements.forEach((item, i) => {
        const top = toPosition.top + 20 * (i);
        item.style.top = `${top}px`;
        item.style.left = `${toPosition.left}px`;
        item.classList.remove(cssClass_pokerCardSelected);
        item.classList.remove(cssClass_pokerCardSelectedStack);
        item.classList.add(cssClass_pokerCardAnimating);
    });

    await sleep(100); //300

    elements.forEach((item, i) => {
        item.classList.remove(cssClass_pokerCardAnimating);
    });
}

function sleep(time) {
    return new Promise(resolve=>setTimeout(resolve, time));
}
