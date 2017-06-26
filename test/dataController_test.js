var dataController = require('../data/dataController.js')

/** (from https://github.com/lodash/lodash/issues/1743, slavafomin's comment)
 * Returns TRUE if the first specified array contains all elements
 * from the second one. FALSE otherwise.
 *
 * @param {array} superset
 * @param {array} subset
 *
 * @returns {boolean}
 */
function arrayContainsArray (superset, subset) {
  if (0 === subset.length) {
    return false;
  }
  return subset.every(function (value) {
    return (superset.indexOf(value) >= 0);
  });
}

const cards = [
    {
        front: 'test1',
        back: 'test1'
    },
    {
        front: 'test2',
        back: 'test2'
    },
    {
        front: 'test3',
        back: 'test3'
    }
];

exports.simpleCrudTest = function() {
    // add new cards
    dataController.newCards(cards).then(function(newCardIds) {
        // check that they should show up in todays reviews
        dataController.getTodaysCards().then(function(todaysCards) {
            var todaysCardsIds = [];
            todaysCards.forEach(function(card) {
                todaysCardsIds.push(card.id);
            });
            console.assert(arrayContainsArray(todaysCardsIds, newCardIds));
            // log a response (don't care what happens in this test)
            dataController.logReview(newCardIds[0], 5).then(function() {
                // delete the cards
                newCardIds.forEach(function(id) {
                    dataController.deleteCard(id);
                });
            })
        });
    });
}