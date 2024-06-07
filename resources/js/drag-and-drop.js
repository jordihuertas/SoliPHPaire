class DragAndDrop {
    constructor(draggableSelector, droppableSelector, onDropCallback) {
        this.draggableSelector = draggableSelector;
        this.droppableSelector = droppableSelector;
        this.draggingElement = null;
        this.prevDraggingElement = null;
        this.nextDraggingElements = [];
        this.offsetX = 0;
        this.offsetY = 0;
        this.originalParentNode = null;
        this.originalPosition = { top: 0, left: 0 };
        this.target = null;

        this.onDropCallback = onDropCallback;

        this.cssClass = {
            card: 'poker-card',
            dragging: 'poker-card--dragging',
            selected: 'poker-card--selected',
            selectedStack: 'poker-card--selected__stack',
            animating: 'poker-card--animating'
        };

        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);

        this.init();
    }

    init() {
        this.draggableCards = document.querySelectorAll(this.draggableSelector);
        this.droppableSlots = document.querySelectorAll(this.droppableSelector);
        this.attachEventListeners();
    }

    attachEventListeners() {
        this.draggableCards.forEach((item) => {
            item.addEventListener('mouseover', this.handleMouseOver);
            item.addEventListener('mouseleave', this.handleMouseLeave);
            item.addEventListener('mousedown', this.handleMouseDown);
        });
    }

    removeAllEventListeners() {
        this.draggableCards.forEach((item) => {
            item.removeEventListener('mouseover', this.handleMouseOver);
            item.removeEventListener('mouseleave', this.handleMouseLeave);
            item.removeEventListener('mousedown', this.handleMouseDown);
        });
    }

    handleMouseOver(e) {
        e.target.classList.add(this.cssClass.selected);
        const nextSiblings = Utils.getNextSiblings(e.target, `.${this.cssClass.card}`);
        nextSiblings.forEach(sibling => sibling.classList.add(this.cssClass.selectedStack));
    }

    handleMouseLeave(e) {
        e.target.classList.remove(this.cssClass.selected);
        const nextSiblings = Utils.getNextSiblings(e.target, `.${this.cssClass.card}`);
        nextSiblings.forEach(sibling => sibling.classList.remove(this.cssClass.selectedStack));
    }

    handleMouseDown(e) {
        e.preventDefault();
        this.draggingElement = e.target;
        this.prevDraggingElement = e.target.previousElementSibling || null;
        this.draggingElement.classList.remove(this.cssClass.selected);
        this.nextDraggingElements = Utils.getNextSiblings(this.draggingElement, `.${this.cssClass.card}`);
        const rect = this.draggingElement.getBoundingClientRect();
        this.offsetX = e.clientX - rect.left;
        this.offsetY = e.clientY - rect.top;
        this.originalParentNode = this.draggingElement.parentNode;
        this.originalPosition = { top: rect.top, left: rect.left };

        this.draggingElement.classList.add(this.cssClass.dragging);
        this.nextDraggingElements.forEach(sibling => sibling.classList.add(this.cssClass.dragging, this.cssClass.selectedStack));

        Utils.fixCardPosition(this.draggingElement, e, this.offsetX, this.offsetY);
        Utils.fixStackedCardsPosition(this.nextDraggingElements, e, this.offsetX, this.offsetY);

        e.target.removeEventListener('mouseover', this.handleMouseOver);
        e.target.removeEventListener('mouseleave', this.handleMouseLeave);

        this.nextDraggingElements.forEach((item) => {
            item.removeEventListener('mouseover', this.handleMouseOver);
            item.removeEventListener('mouseleave', this.handleMouseLeave);
            item.removeEventListener('mousedown', this.handleMouseDown);
        });

        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('mouseup', this.handleMouseUp);
    }

    handleMouseMove(e) {
        if (this.draggingElement) {
            Utils.fixCardPosition(this.draggingElement, e, this.offsetX, this.offsetY);
            Utils.fixStackedCardsPosition(this.nextDraggingElements, e, this.offsetX, this.offsetY);
            this.checkCollision();
        }
    }

    async handleMouseUp(e) {
        // return;
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);

        if (this.draggingElement) {
            this.nextDraggingElements.unshift(this.draggingElement);
            const nextDraggingElements = this.nextDraggingElements;
            const originalPosition = this.originalPosition;
            const originalParentNode = this.originalParentNode;

            // If target is empty (dropped on the air) reset to its original position
            if (!this.target) {
                await this.resetDraggedCards(nextDraggingElements, originalPosition,originalParentNode);
                return;
            }

            // Check if card can be dropped to the target and update data on the backend
            const target = this.target;
            const prevDraggingElement = this.prevDraggingElement;
            const droppableSlots = this.droppableSlots;

            if (this.onDropCallback && typeof this.onDropCallback === 'function') {
                const data = {
                    nextDraggingElements: nextDraggingElements,
                    target: target
                }

                this.onDropCallback(data, (canBeDropped) => {
                    console.log('Callback from GameController has been executed. Here should determine if card can be dropped or not');
                    console.log('canBeDropped: ', canBeDropped);
                    if (!canBeDropped){
                        this.resetDraggedCards(nextDraggingElements, originalPosition, originalParentNode);
                        return;
                    }

                    this.updateDraggingCardsToTargetPosition(target, nextDraggingElements, prevDraggingElement, droppableSlots);
                });
            }

            this.reset();
        }
    }

    async resetDraggedCards(nextDraggingElements, originalPosition, originalParentNode) {
        await Utils.moveElementsTo(nextDraggingElements, originalPosition);
        nextDraggingElements.forEach(sibling => {
            sibling.classList.remove('poker-card--selected', 'poker-card--selected__stack');
            sibling.removeAttribute('style');
            sibling.setAttribute('drop-item', 'true');
            originalParentNode.appendChild(sibling);
        });
        this.reset();
    }

    async updateDraggingCardsToTargetPosition(target, nextDraggingElements, prevDraggingElement, droppableSlots) {
        let targetCardIndex = target.getAttribute('card-index') || 0;
        let nextCardIndex = parseInt(targetCardIndex);

        const targetRect = target.getBoundingClientRect();
        const toPosition = {top: targetRect.top + 20, left: targetRect.left};
        await Utils.moveElementsTo(nextDraggingElements, toPosition);
        nextDraggingElements.forEach((sibling, index) => {
            sibling.classList.remove('poker-card--selected', 'poker-card--selected__stack');
            const siblingCardIndex = sibling.getAttribute('card-index');
            sibling.classList.remove('card-index-' + (siblingCardIndex));
            sibling.classList.remove(this.cssClass.dragging);
            sibling.removeAttribute('style');
            target.parentNode.appendChild(sibling);
            sibling.classList.add('card-index-' + (++nextCardIndex));
            sibling.setAttribute('card-index', nextCardIndex);
            sibling.setAttribute('card-deck', target.parentNode.getAttribute('card-deck'));
            if (index + 1 === nextDraggingElements.length) {
                sibling.setAttribute('drop-item', 'true');
            }
        });

        target.removeAttribute('drop-item');
        if (prevDraggingElement) {
            prevDraggingElement.setAttribute('drop-item', 'true');
        }

        droppableSlots.forEach(slot => slot.classList.remove(this.cssClass.selected));
    }

    checkCollision() {
        if (!this.draggingElement) return;

        const draggingRect = this.draggingElement.getBoundingClientRect();
        let closestSlot = null;
        let minDistance = Infinity;

        this.droppableSlots = document.querySelectorAll(this.droppableSelector);
        this.droppableSlots.forEach(slot => {
            if (slot !== this.draggingElement && slot.hasAttribute('drop-item')) {
                const slotRect = slot.getBoundingClientRect();
                if (
                    draggingRect.left < slotRect.right &&
                    draggingRect.right > slotRect.left &&
                    draggingRect.top < slotRect.bottom &&
                    draggingRect.bottom > slotRect.top
                ) {
                    const distance = Utils.calculateDistance(draggingRect, slotRect);
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestSlot = slot;
                    }
                }
            }
        });

        this.droppableSlots.forEach(slot => slot.classList.remove(this.cssClass.selected));

        if (closestSlot) {
            closestSlot.classList.add(this.cssClass.selected);
            this.target = closestSlot;
        } else {
            this.target = null;
        }
    }

    reset() {
        this.draggingElement = null;
        this.prevDraggingElement = null;
        this.nextDraggingElements = [];
        this.offsetX = 0;
        this.offsetY = 0;
        this.originalParentNode = null;
        this.originalPosition = { top: 0, left: 0 };
        this.target = null;

        this.removeAllEventListeners();
        this.init();
    }
}

class Utils {
    static getNextSiblings(element, filter) {
        let siblings = [];
        while (element = element.nextSibling) {
            if (element.matches && element.matches(filter)) {
                siblings.push(element);
            }
        }
        return siblings;
    }

    static fixCardPosition(element, event, offsetX, offsetY) {
        element.style.position = 'fixed';
        element.style.left = `${event.clientX - offsetX}px`;
        element.style.top = `${event.clientY - offsetY}px`;
        element.style.zIndex = "1";
        element.removeAttribute('drop-item');
    }

    static fixStackedCardsPosition(elements, event, offsetX, offsetY) {
        elements.forEach((element, index) => {
            element.style.position = 'fixed';
            element.style.left = `${event.clientX - offsetX}px`;
            element.style.top = `${event.clientY - offsetY + (index + 1) * 20}px`;
            element.style.zIndex = (index + 1).toString();
            element.removeAttribute('drop-item');
        });
    }

    static calculateDistance(rect1, rect2) {
        const center1 = { x: rect1.left + rect1.width / 2, y: rect1.top + rect1.height / 2 };
        const center2 = { x: rect2.left + rect2.width / 2, y: rect2.top + rect2.height / 2 };
        return Math.sqrt(Math.pow(center1.x - center2.x, 2) + Math.pow(center1.y - center2.y, 2));
    }

    static async moveElementsTo(elements, toPosition) {
        elements.forEach((element, index) => {
            const top = toPosition.top + 20 * index;
            element.style.top = `${top}px`;
            element.style.left = `${toPosition.left}px`;
            element.classList.add('poker-card--animating');
            element.classList.remove('poker-card--dragging');
            element.classList.remove('poker-card--selected');
            element.classList.remove('poker-card--selected__stack');
        });

        await new Promise(resolve => setTimeout(resolve, 100));

        elements.forEach(element => element.classList.remove('poker-card--animating'));
    }
}

window.DragAndDrop = DragAndDrop;
