class GameController {
    constructor() {
        this.dragAndDrop = new DragAndDrop('[drag-item]', '[drop-item]', this.onCardDropped.bind(this));
        this.mainDeck = document.querySelector('#main_deck');
        this.mainDeckShown = document.querySelector('#main_deck_shown');
        this.init();
    }

    init() {
        this.handleClickMainDeck = this.handleClickMainDeck.bind(this);
        this.mainDeck.addEventListener('click', this.handleClickMainDeck);
    }

    onCardDropped(data, callback) {
        const draggedElements = data.nextDraggingElements;
        const targetElement = data.target;

        let cards = [];
        draggedElements.forEach((card) => {
            let cardObject = {};
            cardObject.uuid = card.getAttribute('card-uuid');
            cardObject.deck = card.getAttribute('card-deck');
            cardObject.deckType = 'deck';
            if (card.parentNode.classList.contains('pile-deck')){
                cardObject.deckType = 'pile';
            }
            cards.push(cardObject);
        });

        let target = {};
        target.uuid = targetElement.getAttribute('card-uuid');
        target.deck = targetElement.parentNode.getAttribute('card-deck');
        target.deckType = 'deck';
        if (targetElement.parentNode.classList.contains('pile-deck')){
            target.deckType = 'pile';
        }

        console.log('Drop card action:');
        console.log('Cards:', cards);
        console.log('Target:', target);
        Livewire.dispatch('update-dropped-cards', { droppedCards: cards, dropSlot: target });
        const updateDroppedCardsCallback_cleanup = Livewire.on('update-dropped-cards-callback', (event) => {
            const data = event[0];
            if (callback && typeof callback === 'function') {
                callback(data.can_be_dropped);
            }

            console.log(data.next_card_to_be_shown);
            if (data.next_card_to_be_shown !== null && data.next_card_to_be_shown !== undefined){
                const cardNode = Utils.buildNodeFromHtml(data.next_card_to_be_shown);

                const firstDraggedElement = draggedElements[0];

                const cardDeck = firstDraggedElement.getAttribute('card-deck');
                const cardPosition = parseInt(firstDraggedElement.getAttribute('card-index')) - 1;

                cardNode.setAttribute('card-deck', cardDeck);
                cardNode.setAttribute('card-index', cardPosition);
                cardNode.classList.remove('card-index-0');
                cardNode.classList.add('card-index-'+cardPosition);

                const element = document.querySelector('.other-decks [card-deck="'+cardDeck+'"] [card-index="'+cardPosition+'"]');
                element.replaceWith(cardNode);

                this.dragAndDrop.reset();
            }
            updateDroppedCardsCallback_cleanup();
        });
    }

    async handleClickMainDeck(e) {
        Livewire.dispatch('main-deck-next-card');

        const mainDeckNextCardCallback_cleanup = Livewire.on('main-deck-next-card-callback', (event) => {
            const data = event[0];

            if (data.deck_is_empty) {
                this.resetMainDeck();
            }
            else{
                const cardNode = Utils.buildNodeFromHtml(event[0].card);

                if (data.last_deck_card){
                    this.mainDeck.querySelector('.poker-card').style.display = 'none';
                }

                this.mainDeckShown.appendChild(cardNode);

                this.dragAndDrop.reset();
            }
            mainDeckNextCardCallback_cleanup();
        });
    }

    resetMainDeck(){
        Livewire.dispatch('reset-main-deck');
        const resetMainDeckCallback_cleanup = Livewire.on('reset-main-deck-callback', (event) => {

            const cards = this.mainDeckShown.querySelectorAll('.poker-card');
            cards.forEach((card, index) => {
                card.remove();
            });
            this.mainDeck.querySelector('.poker-card').removeAttribute('style');

            this.resetDragAndDrop();
            resetMainDeckCallback_cleanup();
        });
    }

    resetDragAndDrop(){
        this.dragAndDrop.reset();
    }
}

class Utils {
    static buildNodeFromHtml(cardHtml){
        const range = document.createRange();
        return range.createContextualFragment(cardHtml).firstElementChild;
    }
}


window.GameController = GameController;
