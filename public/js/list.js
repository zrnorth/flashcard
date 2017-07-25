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
  })
  // Create the edit box when you click the front / back row
  .on('click', '.editable-front', function(e) {
    $(this).removeClass('editable-front');
    handleEditableFieldClick($(this), 'front');
  })
  .on('click', '.editable-back', function(e) {
    $(this).removeClass('editable-back');
    handleEditableFieldClick($(this), 'back');
  })

  // Handle the update call once you have updated a front / back field and want to submit
  .on('click', '.btn-update', function(e) {
    // Get the card ID and the value of the updated field
    var id = parseInt($(this).parents('tr:first').attr('id').substring(8));
    var newString = $(this).siblings('input:first').val();
    if (newString === "") { // Don't bother posting if it is bad data.
      return;
    }
    var side;
    if ($(this).hasClass('btn-update-front')) {
      side = 'front';
    }
    else if ($(this).hasClass('btn-update-back')) {
      side = 'back';
    }
    else {
      console.error('Something went wrong -- side is neither front nor back.');
      return;
    }

    $.ajax({
      url: '/updateCardSide',
      type: 'POST',
      cache: false,
      contentType: 'application/json',
      data: JSON.stringify({
        id: id,
        newString: newString,
        sideToUpdate: side
      }),
      success: function(card) {
        // Todo: reload inline. Right now it reloads the whole page.
        location.reload(true); // reload if we 200
      },
      error: function(e) {
        console.error(e);
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

var handleEditableFieldClick = function(element, fieldName) {
  // Change this from a text field to an input field with a checkmark button to save.
  var t = element.text();
  element.html($('<input />', {'value': t}));
  var btnHtml = '<button class="btn btn-success btn-update btn-update-' + fieldName + '">✔</button>';
  element.append($(btnHtml));
}