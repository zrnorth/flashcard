var CARDS_LEFT = -1; // This gets set inside the view (reviewPage.pug)
var DRY_RUN = false; // If dry run is set to true (by the view controller), any review logging won't be saved. Used for custom reviews.
var FRONT_IS_UP = true; // true: front is showing, false: back is showing. used for validating keyboard input
const FADE_TIME = 200; // 200 ms, equivalent to 'fast'

// ====== Page init
$(function() {
  console.log('dry run? ' + DRY_RUN);
  initCards();

  // We handle click handlers in this verbose way because we want some odd behavior:
  // If you click the card it should flip, but not if you click on the text.
  $(document).click(function(e) {
    if ($(e.target).is('.score-button')) {
      e.preventDefault();

      const responseQuality = $(e.target).attr('value');

      logReview(topCardId(), responseQuality);
    }

    else if ($(e.target).is('.reminder-button')) {
      e.preventDefault();
      toggleReminder(e.target.value);
    }

    else if ($(e.target).is('.btn-delete')) {
      e.preventDefault();
      if (confirm('Really delete this card?')) {
        deleteTopCard();
      }
      toggleReminder();
    }

    else if ($(e.target).is('.reminder-text')) {
      $(e.target).fadeToggle(FADE_TIME);
    }

    else if ($(e.target).is('.front') || $(e.target).is('.back')) {
      flipTopCard();
    }
  });

  // Keypress handler
  document.addEventListener('keydown', handleKeyboardInput);
});

// ====== Display functions
function initCards() {
  // First, iterate each review container, adjusting the font size, then hiding the review.
  // Need to adjust the font sizes before hiding all the reviews because can't check
  // font size on a non-visible element.
  $('.review-container').each(function() {
    fitCardTextToContainer($(this).children('.card-container'));
    $(this).css('display', 'none');
  });
  // Finally, make the first card visible.
  displayNextCard();
}

function flipTopCard() {
  topCard().toggleClass('flipped');
  FRONT_IS_UP = !topCard().hasClass('flipped');
}

// Reminder type is either 'scoring', 'kanji', or 'other' to enable, or null to disable.
function toggleReminder(reminderType) {
  var target = '#' + reminderType + '-help-text';
  // If the reminder is currently visible, or we want to disable all the reminders, we're trying to disable it.
  // If its not visible, we're trying to enable it.
  var enable = true;
  if (!reminderType || $(target).is(':visible')) {
    var enable = false;
  }
  // Disable all the reminders before enabling any.
  // Only want one reminder on the screen at a time.
  $('.reminder-text').each(function() {
    $(this).fadeOut(FADE_TIME);
  });

  if (enable) {
    $(target).delay(FADE_TIME).fadeIn(FADE_TIME); // Delay to let the other one timeout if need be.
  }
}

// Hides the currently top card, and shows the next one. Appends the current card to the end
// of the card list of repeatCard == true.
function gotoNextCard(repeatCard) {
  var afterFadingOut; // Once we fade out, behavior differs based on whether we got the card right or not.
  if (repeatCard) {
    afterFadingOut = function() {
      flipTopCard();
      topCard().appendTo('.reviews');
      displayNextCard();
    }
  }
  else {
    // Done with it! remove the card from the page
    CARDS_LEFT -= 1;
    afterFadingOut = function() {
      topCard().remove();
      displayNextCard();
    }
  }
  topCard().fadeOut(80, afterFadingOut);
  // Update the number of cards left, displayed at the top of the screen.
  if (CARDS_LEFT >= 1) {
    $('#cards-left-banner').text(CARDS_LEFT);
  }
  else {
    $('#cards-left-banner').text('All done! ✔')
  }
}

function displayNextCard() {
  topCard().fadeToggle(FADE_TIME);
  populateKanjiReminder();
}

// Show an error at the top of the screen if something goes wrong
function displayError(textStatus, errorThrown) {
  console.error("ERROR: " + textStatus);
  $('#cards-left-banner').text('There was an error with your request: ' + errorThrown);
  $('#cards-left-banner').css('color', 'red');
}

// ====== AJAX wrapper functions

// Load in the definitions for the kanji for the top card.
function populateKanjiReminder() {
  const payload = {
    kanjiString: $('.back').first().text()
  };

  $.ajax({
    url: '/getKanjiData',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(payload),
    timeout: 5000,
    success: function(data) {
      $('#kanji-help-text').html(getFormattedKanjiHelpText(data.kanjiData));
      // TODO would be cool if this worked
      // fitCardTextToContainer($('#kanji-help-text'));
    },
    error: function(jqxhr, textStatus, errorThrown) {
      console.error("ERROR: " + textStatus);
    }
  });
}

function logReview(id, responseQuality) {
  const payload = {
    id: id,
    responseQuality: responseQuality
  };

  // First, close all reminders
  toggleReminder();

  // If we are doing a dry run (custom review) don't actually fire the AJAX, just continue like it succeeded.
  if (DRY_RUN) {
    var repeat = (responseQuality < 3);
    gotoNextCard(repeat);
    return;
  }

  $.ajax({
    url: '/logReview',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(payload),
    timeout: 5000, // 5 seconds
    success: function(res) {
      console.log('Logged score of ' + responseQuality + ' for card #' + id);
      gotoNextCard(res.repeat);
    },
    error: function(jqxhr, textStatus, errorThrown) {
      displayError(textStatus, errorThrown);
    }
  });
}

function deleteTopCard() {
  const id = topCardId(); 
  $.ajax({
    url: '/deleteCard',
    type: 'DELETE',
    contentType: 'application/json',
    data: JSON.stringify({
      id: id
    }),
    success: function() {
      console.log('Deleted card ' + id);
      gotoNextCard(false);
    },
    error: function(jqxhr, textStatus, errorThrown) {
      displayError(textStatus, errorThrown);
    }
  });
}

// ====== Helper functions

// Given an array of kanjiData, formats it into a nice string for displaying in the reminder.
function getFormattedKanjiHelpText(kanjiDataArray) {
  var outputHTML = '';
  if (!kanjiDataArray || kanjiDataArray.length === 0) {
    outputHTML = '<p>No kanji.</p>';
  }
  for (var i = 0; i < kanjiDataArray.length; i++) {
    var kanjiData = kanjiDataArray[i];
    outputHTML += '<p>' + kanjiData.kanji + ': ' + kanjiData.heisig + '</p>';
  }
  return outputHTML;
}

// Returns the jquery selector for the topmost (currently displayed) card
function topCard() {
  return $('.review-container').first();
}

// Returns the integer id of the currently displayed card.
function topCardId() {
  return parseInt($('.review').first().attr('id'));
}

// Increases or decreases the size of the text in a review card to the size of the review container.
function fitCardTextToContainer(cardContainer) {
  const minFontSize = 10;
  const maxFontSize = 75;

  $(cardContainer).children().each(function(i, text) {
    var line = $(this).children()[0];

    // We want the font to fill as much of the container (minus the margin) as possible
    const targetWidth = cardContainer.width() - parseInt(cardContainer.css('margin-top'));
    // The font starts at 1px, so the width scales correctly.
    var onePxWidth = $(line).width();
    var calculatedFontSize = parseInt(targetWidth / onePxWidth);
    // Ensure its inside the correct range of font sizes
    if (calculatedFontSize > maxFontSize) {
      calculatedFontSize = maxFontSize;
    }
    else if (calculatedFontSize < minFontSize) {
      calculatedFontSize = minFontSize;
    }
    $(this).css('font-size', calculatedFontSize + 'px');
  });
}

// Handler for keyboard controls
function handleKeyboardInput(event) {
  switch(event.key) {
    case 'Enter': // Show the kanji help text
      toggleReminder('kanji');
      break;

    case ' ': // Flip the card
      flipTopCard();
      break;

    case '0':
    case 'Escape':
    case '`':
    case '1':
    case '2':
    case '3':
    case '4':
    case '5': 
      if (FRONT_IS_UP) { // Only log a review if the back of the card is facing up
        break;
      }

      var responseQuality = parseInt(event.key);
      if (event.key === 'Escape' || event.key === '`') {
        responseQuality = 0;
      }

      logReview(topCardId(), responseQuality);
      break;
  }
}