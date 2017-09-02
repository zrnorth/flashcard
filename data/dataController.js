const db = require('./postgres.js');
const SM2 = require('../helpers/SM2.js');
const kanjiHelpers = require('../helpers/kanjiHelpers.js');
require('../helpers/dateHelpers.js');

exports.newCard = function(front, back, userId) {
  return db.addCard(front, back, 2.5, userId)
  .then(function(data) {
    return data.id;
  });
}

exports.newCards = function(cards, userId) {
  return db.addCards(cards, userId)
  .then(function(data) {
    var ids = [];
    data.forEach(function(item) {
      ids.push(item.id);
    });
    return ids;
  })
  .catch(function(error) {
    if (error.message && error.message.includes('unique constraint')) {
      throw error.first.detail;
    }
    else {
      throw error;
    }
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

exports.deleteAllForUser = function(userId) {
  return db.deleteAllForUser(userId);
}

exports.deleteAll = function() {
  return db.deleteAll();
}

exports.updateCardSide = function(id, sideToUpdate, newString) {
  return db.getCard(id).then(function(card) {
    if (sideToUpdate === "front") {
      card.front = newString;
    }
    else if (sideToUpdate === "back") {
      card.back = newString;
    }
    else throw new Error("sideToUpdate must be set to front or back.");

    return db.updateCard(id, card.front, card.back, card.next_review, card.difficulty, card.reps).then(function(next_review) {
      return card;
    });
  });
}

exports.logReview = function(id, responseQuality) {
  return db.getCard(id).then(function(card) {
    // If the review was correct, update the card's correct reps and difficulty in the db.
    // Return the date the card should next be reviewed.
    if (responseQuality >= 3) {
      var difficulty = SM2.getUpdatedDifficulty(card.difficulty, responseQuality);
      var today = Date.simpleToday();
      var nextReviewDate = today.addDays(SM2.getDaysUntilNextReview(card.reps, difficulty));

      return db.updateCard(id, card.front, card.back, nextReviewDate, difficulty, card.reps + 1).then(function(updatedCard) {
        return updatedCard.next_review;
      });
    }
    // If it was incorrect, reset the number of reps, leaving the difficulty the same.
    else {
      return db.resetForgottenCard(id).then(function(updatedCard) {
        return updatedCard.next_review;
      });
    }
  });
}

exports.getTodaysCards = function(userId) {
  return db.getTodaysCards(userId);
}

exports.getAllCardsForUser = function(userId, limit, offset, orderBy) {
  return db.getAllCardsForUser(userId, limit, offset, orderBy);
}

exports.getTotalNumberOfCards = function(userId) {
  return db.getTotalNumberOfCards(userId).then(function(data) {
    return data.count;
  });
}

exports.getDataForAllKanjiInString = function(str) {
  var kanjis = kanjiHelpers.getAllKanjiInStringAsArray(str);
  if (kanjis.length === 0) { // Don't even make the call if no kanji in string, just resolve right away with an empty array.
    return Promise.resolve([]);
  }
  return db.getKanjiDataFromArray(kanjis);
}