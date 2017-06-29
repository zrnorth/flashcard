$(function() {
  $(document).on('click', '.btn-delete', function(e) {
    e.preventDefault();
    var row = $(this).parents('tr:first');
    // row id format is ex: 'card-id-7' so trim off the front
    var id = parseInt(row.attr('id').substring(8));
    if (!id) {
      console.error('Error getting card id from row!');
      return
    }
    // Send delete message, fade row on finished.
    $.ajax({
      url: '/deleteCard',
      type: 'DELETE',
      contentType: 'application/json',
      data: JSON.stringify({
        id: id
      }),
      success: function() {
        row.fadeOut(80);
        updateHeader();
      }
    });
  });
});

var updateHeader = function() {
  $('.cards-count-helper-text').text('Some cards were deleted');
  // decrement the total
  var total = parseInt($('.cards-count').text());
  $('.cards-count').text(total-1);
}