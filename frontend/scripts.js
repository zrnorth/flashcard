var CURRENT_CARD_INDEX = 0;

var initEventHandlers = function() {
    var cardFront = document.getElementById('card-front');
    var cardBack = document.getElementById('card-back');

    // By default, the cardBack is not displayed and the cardFront is.
    cardFront.style.display = '';
    cardBack.style.display = 'none';

    cardFront.addEventListener('click', function(e) {
        console.log('clicked front, flipping card...');
        cardFront.style.display = 'none';
        cardBack.style.display = '';
    });

    cardBack.addEventListener('click', function(e) {
        console.log('clicked back, going to next card');
        // for now just flip back
        loadNextCard();
        cardFront.style.display = '';
        cardBack.style.display = 'none';
    });
};

var loadNextCard = function() {
    // do some work to get the next card. update cardFront and cardBack
    CURRENT_CARD_INDEX++;
    document.getElementById('card-index').innerHTML = CURRENT_CARD_INDEX;
};

document.addEventListener('DOMContentLoaded', function() {
    loadNextCard();
    initEventHandlers();
});