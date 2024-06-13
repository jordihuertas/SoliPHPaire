class WinGame {
    constructor() {
        this.gravity = 0.2;
        this.bounceFactor = 0.9;
        this.speed = 1;
        this.minBounceVelocityY = 0.005 * window.innerHeight;
        this.minVelocity = 0.01 * window.innerWidth;
        this.minSpawnDirectionX = 0.001 * window.innerWidth;
        this.maxSpawnDirectionX = 0.002 * window.innerWidth;
        this.cardHeight = 0.1 * window.innerHeight;
        this.cardWidth = 0.07 * window.innerWidth;
        this.cards = [];
        this.trailCards = [];
        this.trailInterval = 20;
        this.maxCards = 4;
        this.maxTrailCards = 100;
        this.cardSpawnPoints = document.querySelectorAll('.win-game-spawn-point');
        this.isDestroyed = false;
        this.init();
    }

    init() {
        this.isDestroyed = false;
        this.addCardPeriodically();
        this.animateCards = this.animateCards.bind(this);
        this.trailIntervalId = setInterval(this.createTrailCard.bind(this), this.trailInterval);
        this.animationFrameId = requestAnimationFrame(this.animateCards);
    }

    createCard() {
        if (this.cards.filter(card => card.active).length >= this.maxCards) {
            return;
        }

        const spawnPointIndex = Math.floor(Math.random() * this.cardSpawnPoints.length);
        const spawnPoint = this.cardSpawnPoints[spawnPointIndex];
        const spawnPointRect = spawnPoint.getBoundingClientRect();

        const velocityX = (Math.random() * (this.maxSpawnDirectionX - this.minSpawnDirectionX) + this.minSpawnDirectionX) * (Math.random() < 0.5 ? -1 : 1);

        const cardHtml = "<div card-uuid=\"1e41d558-88e2-46b0-963e-e7aa5eec2054\" card-deck=\"5\" class=\"poker-card poker-card--spade card-index-5 ratio ratio-2x3 mx-auto\" card-index=\"5\" drag-item=\"\" drop-item=\"\">\n" +
            "    <!--[if BLOCK]><![endif]-->        <div class=\"row poker-card--top m-0\">\n" +
            "            <div class=\"col text-start p-0\">\n" +
            "                <span class=\"icon-number\">K</span>\n" +
            "            </div>\n" +
            "            <div class=\"col text-end p-0\">\n" +
            "                <i class=\"icon bi bi-suit-spade-fill\"></i>\n" +
            "            </div>\n" +
            "        </div>\n" +
            "    <!--[if ENDBLOCK]><![endif]-->\n" +
            "    <div class=\"row d-flex align-items-center justify-content-center text-center poker-card--number m-0\">\n" +
            "        <span class=\"col gradient-text\"><!--[if BLOCK]><![endif]-->K<!--[if ENDBLOCK]><![endif]--></span>\n" +
            "    </div>\n" +
            "    <!--[if BLOCK]><![endif]-->        <div class=\"row poker-card--bottom m-0 align-items-end\">\n" +
            "            <div class=\"col text-end p-0\">\n" +
            "                <span class=\"icon-number\">K</span>\n" +
            "            </div>\n" +
            "            <div class=\"col text-start p-0\">\n" +
            "                <i class=\"icon bi bi-suit-spade-fill\"></i>\n" +
            "            </div>\n" +
            "        </div>\n" +
            "    <!--[if ENDBLOCK]><![endif]-->\n" +
            "</div>";

        const card = Utils.buildNodeFromHtml(cardHtml);
        card.classList.add('poker-card__win');
        card.style.top = `${spawnPointRect.top}px`;
        card.style.left = `${spawnPointRect.left}px`;
        document.body.appendChild(card);

        const cardData = {
            element: card,
            posX: parseFloat(card.style.left),
            posY: parseFloat(card.style.top),
            velocityX: velocityX,
            velocityY: ((Math.random() * 2 - 1) * this.speed || this.minVelocity) * -1,
            direction: 1,
            active: true
        };

        this.cards.push(cardData);
    }

    createTrailCard() {
        if (this.isDestroyed) return;

        this.cards.forEach(cardData => {
            if (cardData.active) {
                const trailCard = cardData.element.cloneNode(true);
                trailCard.classList.add('poker-card__trail');
                trailCard.style.top = `${cardData.posY}px`;
                trailCard.style.left = `${cardData.posX}px`;
                document.body.appendChild(trailCard);

                setTimeout(() => {
                    trailCard.remove();
                }, 5000);

                this.trailCards.push(trailCard);
                if (this.trailCards.length > this.maxTrailCards) {
                    const oldTrailCard = this.trailCards.shift();
                    oldTrailCard.remove();
                }
            }
        });
    }

    animateCards() {
        if (this.isDestroyed) return;

        const activeCardsCount = this.cards.filter(card => card.active).length;

        if (activeCardsCount < this.maxCards) {
            this.createCard();
        }

        this.cards.forEach(cardData => {
            if (cardData.active) {
                cardData.posX += cardData.velocityX;
                cardData.posY += cardData.velocityY;

                cardData.velocityY += this.gravity;

                if (cardData.posY + this.cardHeight >= window.innerHeight) {
                    cardData.posY = window.innerHeight - this.cardHeight;

                    if (Math.abs(cardData.velocityY) < this.minBounceVelocityY) {
                        cardData.velocityY = Math.sign(cardData.velocityY) * this.minBounceVelocityY;
                    } else {
                        cardData.velocityY *= -this.bounceFactor;
                    }
                }

                if (cardData.posX + this.cardWidth >= window.innerWidth || cardData.posX <= 0) {
                    cardData.element.remove();
                    this.cards.splice(this.cards.indexOf(cardData), 1);
                }

                cardData.element.style.top = `${cardData.posY}px`;
                cardData.element.style.left = `${cardData.posX}px`;
            }
        });

        this.animationFrameId = requestAnimationFrame(this.animateCards);
    }

    addCardPeriodically() {
        if (this.isDestroyed) return;

        if (this.cards.length < this.maxCards) {
            this.createCard();
        }
        this.cardIntervalId = setTimeout(() => this.addCardPeriodically(), 1000);
    }

    destroy() {
        this.isDestroyed = true;

        cancelAnimationFrame(this.animationFrameId);
        clearInterval(this.trailIntervalId);
        clearTimeout(this.cardIntervalId);

        this.cards.forEach(cardData => {
            cardData.element.remove();
        });
        this.trailCards.forEach(trailCard => {
            trailCard.remove();
        });

        this.cards = [];
        this.trailCards = [];
    }
}

class Utils {
    static buildNodeFromHtml(cardHtml){
        const range = document.createRange();
        return range.createContextualFragment(cardHtml).firstElementChild;
    }
}

window.WinGame = WinGame;
