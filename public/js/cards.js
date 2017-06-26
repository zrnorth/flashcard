$(function() {
  $('.card-container').click(function (e) {
    $(this).parent().toggleClass('flipped');
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
      success: function() {
        console.log('Review logged successfully.');
      }
    });
    // temp: hide the whole card so they slide up.
    reviewContainer.fadeOut('fast');
  });
});