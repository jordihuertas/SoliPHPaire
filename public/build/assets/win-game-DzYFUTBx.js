class n{constructor(){this.gravity=.2,this.bounceFactor=.9,this.speed=1,this.cardHeight=100,this.cards=[],this.init()}init(){this.animateCards(),this.addCardPeriodically()}createCard(){const e=document.createRange().createContextualFragment(`<div card-uuid="1e41d558-88e2-46b0-963e-e7aa5eec2054" card-deck="5" class="poker-card poker-card--spade card-index-5 ratio ratio-2x3 mx-auto" card-index="5" drag-item="" drop-item="">
    <!--[if BLOCK]><![endif]-->        <div class="row poker-card--top m-0">
            <div class="col text-start p-0">
                <span class="icon-number">K</span>
            </div>
            <div class="col text-end p-0">
                <i class="icon bi bi-suit-spade-fill"></i>
            </div>
        </div>
    <!--[if ENDBLOCK]><![endif]-->
    <div class="row d-flex align-items-center justify-content-center text-center poker-card--number m-0">
        <span class="col gradient-text"><!--[if BLOCK]><![endif]-->K<!--[if ENDBLOCK]><![endif]--></span>
    </div>
    <!--[if BLOCK]><![endif]-->        <div class="row poker-card--bottom m-0 align-items-end">
            <div class="col text-end p-0">
                <span class="icon-number">K</span>
            </div>
            <div class="col text-start p-0">
                <i class="icon bi bi-suit-spade-fill"></i>
            </div>
        </div>
    <!--[if ENDBLOCK]><![endif]-->
</div>`).firstElementChild;e.classList.add("poker-card__win"),e.style.top=`${Math.random()*window.innerHeight}px`,e.style.left=`${Math.random()*window.innerWidth}px`,document.body.appendChild(e);const t={element:e,posX:parseFloat(e.style.left),posY:parseFloat(e.style.top),velocityX:(Math.random()*2-1)*this.speed,velocityY:(Math.random()*2-1)*this.speed,direction:1};this.cards.push(t)}animateCards(){this.cards.forEach(i=>{i.posX+=i.velocityX,i.posY+=i.velocityY,i.velocityY+=this.gravity,i.posY+this.cardHeight>=window.innerHeight&&(i.posY=window.innerHeight-this.cardHeight,i.velocityY*=-this.bounceFactor),(i.posX+cardWidth>=window.innerWidth||i.posX<=0)&&(i.velocityX*=-1),i.element.style.top=`${i.posY}px`,i.element.style.left=`${i.posX}px`}),requestAnimationFrame(this.animateCards)}addCardPeriodically(){this.createCard(),setTimeout(this.addCardPeriodically,1e3)}}window.WinGame=n;
