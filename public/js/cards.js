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
        if (data.repeat) {
          // Flip it back, and append it to the reviews container.
          console.log('Have to repeat this card.');
          flipCard(reviewContainer);
          $('.reviews').append(reviewContainer);
        }
        else {
          // Done with it, so fade it out.
          reviewContainer.fadeOut('fast');
          CARDS_LEFT -= 1;
        }
        updateCardsLeftText();
      }
    });
  });
});

function flipCard(reviewContainer) {
  reviewContainer.toggleClass('flipped');
}

function updateCardsLeftText() {
  if (CARDS_LEFT > 1) {
    $('#cards-left-banner').text(CARDS_LEFT + ' reviews left to go.');
  }
  else if (CARDS_LEFT > 0) {
    $('#cards-left-banner').text(CARDS_LEFT + ' review left to go.');
  }
  else {
    $('#cards-left-banner').text('All done! ✔')
  }
}