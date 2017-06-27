var CARDS_LEFT = -1;

$(function() {
  $('.card-container').click(function (e) {
    flipCard($(this).parent());
  });

  $('.score-button').click(function(e) {
    var cardContainer = $(this).parent();
    var reviewContainer = cardContainer.parent();

    e.preventDefault();
    var payload = {
      id: cardContainer.attr('id'),
      responseQuality: $(this).attr('value')
    }
    console.log('Logging score of ' + payload.responseQuality + ' for card #' + payload.id);

    $.ajax({
      url: '/logReview',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(payload),
      success: function(data) {
        var afterFadingOut; // Once we fade out, behavior differs based on whether we got the card right or not.
        if (data.repeat) { // we got the card wrong, so move it to the end of the reviews list
          afterFadingOut = function() {
            flipCard($(this));
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
        reviewContainer.fadeOut(80, afterFadingOut);
        updateCardsLeftText();
      }
    });
  });

  $('.reminder-button').click(function(e) {
    e.preventDefault();
    handleReminderClick();
  });

  $('#reminder-text').click(function(e) {
    handleReminderClick();
  })

  revealTopReviewContainer();
});

function revealTopReviewContainer() {
  $('.review-container').first().fadeToggle('fast');
}

function handleReminderClick() {
  $('#reminder-text').fadeToggle('fast');
}

function flipCard(reviewContainer) {
  reviewContainer.toggleClass('flipped');
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