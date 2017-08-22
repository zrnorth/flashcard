var CARDS_LEFT = -1;
var FRONT_IS_UP = true; // true: front is showing, false: back is showing. used for validating keyboard input

$(function() {
  initCards();

  // We handle click handlers in this verbose way because we want some odd behavior:
  // If you click the card it should flip, but not if you click on the text.
  $(document).click(function(e) {
    if ($(e.target).is('.score-button')) {
      e.preventDefault();

      const id = parseInt($('.review').first().attr('id'));
      const responseQuality = $(e.target).attr('value');

      logReview(id, responseQuality);
    }

    else if ($(e.target).is('.reminder-button')) {
      e.preventDefault();
      toggleReminder();
    }

    else if ($(e.target).is('#reminder-text')) {
      toggleReminder();
    }

    else if ($(e.target).is('.front') || $(e.target).is('.back')) {
      flipCard();
    }

    else if ($(e.target).is('#kanji-help-btn')) {
      e.preventDefault();
      showKanjiHelp();
    }
  });

  // Keypress handler
  document.addEventListener('keydown', handleKeyboardInput);
});

function showKanjiHelp() {
  // temp
  const payload = {
    kanjiString: 'test山猫'
  };
  $.ajax({
    url: '/getKanjiData',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(payload),
    timeout: 5000,
    success: function(data) {
      console.log(data);
    },
    error: function(jqxhr, textStatus, errorThrown) {
      console.error("ERROR: " + textStatus);
    }
  });
}

function logReview(id, responseQuality) {
  console.log('Logging score of ' + responseQuality + ' for card #' + id);
  const payload = {
    id: id,
    responseQuality: responseQuality
  };

  $.ajax({
    url: '/logReview',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(payload),
    timeout: 5000, // 5 seconds
    success: function(data) {
      var afterFadingOut; // Once we fade out, behavior differs based on whether we got the card right or not.
      if (data.repeat) { // we got the card wrong, so move it to the end of the reviews list
        afterFadingOut = function() {
          flipCard();
          $(this).appendTo('.reviews');
          revealTopReviewContainer();
        }
      }
      else {
        // Done with it! remove the card from the page
        CARDS_LEFT -= 1;
        afterFadingOut = function() {
          $(this).remove();
          revealTopReviewContainer();
        }
      }
      $('.review-container').first().fadeOut(80, afterFadingOut);
      updateCardsLeftText();
    },
    error: function(jqxhr, textStatus, errorThrown) {
      console.error("ERROR: " + textStatus);
      $('#cards-left-banner').text('There was an error logging your review: ' + errorThrown);
      $('#cards-left-banner').css('color', 'red');
    }
  });
}

function initCards() {
  // First, iterate each review container, adjusting the font size, then hiding the review.
  // Need to adjust the font sizes before hiding all the reviews because can't check
  // font size on a non-visible element.
  $('.review-container').each(function() {
    fitCardTextToContainer($(this).children('.card-container'));
    $(this).css('display', 'none');
  });
  // Finally, make the top card visible.
  revealTopReviewContainer();
}

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

function revealTopReviewContainer() {
  $('.review-container').first().fadeToggle('fast');
}

function toggleReminder() {
  $('#reminder-text').fadeToggle('fast');
}

function flipCard() {
  $('.review-container').first().toggleClass('flipped');
  FRONT_IS_UP = !$('.review-container').first().hasClass('flipped');
}

function updateCardsLeftText() {
  if (CARDS_LEFT >= 1) {
    $('#cards-left-banner').text(CARDS_LEFT);
  }
  else {
    $('#cards-left-banner').text('All done! ✔')
  }
}

// handle keyboard input here
function handleKeyboardInput(event) {
  switch(event.key) {
    case 'Enter': // Show the help text
      toggleReminder();
      break;

    case ' ': // Flip the card
      flipCard();
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

      var id = parseInt($('.review').first().attr('id'));
      var responseQuality = parseInt(event.key);
      if (event.key === 'Escape' || event.key === '`') {
        responseQuality = 0;
      }

      logReview(id, responseQuality);
      break;
  }
}