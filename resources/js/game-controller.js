class GameController {
    constructor() {
        this.dragAndDrop = new DragAndDrop('[drag-item]', '[drop-item]');
        this.mainDeck = document.querySelector('#main_deck');
        this.mainDeckShown = document.querySelector('#main_deck_shown');
        this.init();
    }

    init() {
        this.handleClick = this.handleClick.bind(this);
        this.mainDeck.addEventListener('click', this.handleClick);
    }

    async handleClick(e) {
        Livewire.dispatch('main-deck-next-card', { refreshPosts: true });

        const mainDeckNextCardCallback_cleanup = Livewire.on('main-deck-next-card-callback', (event) => {
            const data = event[0];
            Utils.revealCard(this.mainDeckShown, data, this.dragAndDrop);
            mainDeckNextCardCallback_cleanup();
        });
    }
}

class Utils {
    static revealCard(mainDeckShown, data, dragAndDrop){
        Livewire.dispatch('build-card', {card_data: data});

        const revealCardCallback_cleanup = Livewire.on('build-card-callback', (event) => {
            const cardHtml = event[0].card;
            const range = document.createRange();
            const cardNode = range.createContextualFragment(cardHtml).firstElementChild;
            mainDeckShown.appendChild(cardNode);
            // return event[0].card;
            this.resetDragAndDrop(dragAndDrop);
            revealCardCallback_cleanup();
        });
    }

    static resetDragAndDrop(dragAndDrop){
        dragAndDrop.reset();
    }
}


window.GameController = GameController;
