var CARDS_LEFT = -1;
var FRONT_IS_UP = true; // true: front is showing, false: back is showing. used for validating keyboard input

$(function() {
  $('.card-container').click(function (e) {
    flipCard();
  });

  $('.score-button').click(function(e) {
    e.preventDefault();

    const id = parseInt($('.review').first().attr('id'));
    const responseQuality = $(this).attr('value');

    logReview(id, responseQuality);
  });

  $('.reminder-button').click(function(e) {
    e.preventDefault();
    toggleReminder();
  });

  $('#reminder-text').click(function(e) {
    toggleReminder();
  })

  revealTopReviewContainer();

  // Listen for keypresses
  document.addEventListener('keydown', handleKeyboardInput);
});

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
    }
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
  FRONT_IS_UP = !FRONT_IS_UP;
}

function updateCardsLeftText() {
  if (CARDS_LEFT > 1) {
    $('#cards-left-banner').text(CARDS_LEFT + ' reviews to go.');
  }
  else if (CARDS_LEFT > 0) {
    $('#cards-left-banner').text(CARDS_LEFT + ' review to go.');
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