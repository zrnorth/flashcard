const db = require('../data/postgres.js');
require('../helpers/dateHelpers.js');

exports.simpleCrudTest = function() {
    const cardFront = 'crudTestCardFront';
    const cardBack = 'crudTestCardBack';
    const updateDiff = 1.0;
    const updateDate = new Date(2017, 1, 1);
    const updateReps = 3;
    // add a card
    db.addCard(cardFront, cardBack, 2.5).then(function(card) {
        // update the card
        db.updateCard(card.id, updateDiff, updateDate, updateReps).then(function() {
            // retrieve the card
            db.getCard(card.id).then(function(card) {
                // check that card has correct stuff
                console.assert(card.front === cardFront);
                console.assert(card.back  === cardBack);
                console.assert(card.difficulty === updateDiff);
                console.assert(card.next_review.getTime() === updateDate.getTime());
                console.assert(card.reps === updateReps);
                // then, delete the card
                db.deleteCard(card.id);
            });
        });
    });
}
