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
            this.revealCard(data);
            mainDeckNextCardCallback_cleanup();
        });
    }

    revealCard(data){
        if (data.deck_is_empty) {
            this.resetMainDeck();
            return;
        }

        Livewire.dispatch('build-card', {card_data: data});

        const revealCardCallback_cleanup = Livewire.on('build-card-callback', (event) => {
            const cardHtml = event[0].card;
            const range = document.createRange();
            const cardNode = range.createContextualFragment(cardHtml).firstElementChild;

            if (data.last_deck_card){
                this.mainDeck.querySelector('.poker-card').style.display = 'none';
            }

            this.mainDeckShown.appendChild(cardNode);

            this.dragAndDrop.reset();
            revealCardCallback_cleanup();
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

}


window.GameController = GameController;
