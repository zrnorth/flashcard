const db = require('./postgres.js');
const SM2 = require('../helpers/SM2.js');
require('../helpers/dateHelpers.js');


exports.newCard = function(front, back) {
    return db.addCard(front, back, 2.5).then(function(data) {
        return data.id;
    });
}

exports.newCards = function(cards) {
    return db.addCards(cards).then(function(data) {
        var ids = [];
        data.forEach(function(item) {
            ids.push(item.id);
        });
        return ids;
    });
}

exports.deleteCard = function(id) {
    return db.deleteCard(id);
}

exports.deleteCardByFront = function(front) {
    return db.getCardByFront(front).then(function(cards) {
        if (cards.length > 0) { // just delete the first one you find for now
            return db.deleteCard(cards[0].id);
        }
    });
}

exports.deleteAll = function() {
    return db.deleteAll();
}

exports.logReview = function(id, responseQuality) {
    return db.getCard(id).then(function(card) {
        // If the review was correct, update the card's correct reps and difficulty in the db.
        if (responseQuality >= 3) {
            var difficulty = SM2.getUpdatedDifficulty(card.difficulty, responseQuality);
            var today = Date.simpleToday();
            var nextReviewDate = today.addDays(SM2.getDaysUntilNextReview(card.reps, difficulty));

            return db.updateCard(id, difficulty, nextReviewDate, card.reps + 1);
        }
        // If it was incorrect, reset the number of reps, leaving the difficulty the same.
        else {
            return db.resetForgottenCard(id);
        }
    });
}

exports.getTodaysCards = function() {
    return db.getTodaysCards();
}