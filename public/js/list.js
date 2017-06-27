$(function() {
  $(document).on('click', '.btn-delete', function(e) {
    e.preventDefault();
    var row = $(this).parents('tr:first');
    var id = parseInt(row.children('th').text());

    $.ajax({
      url: '/deleteCard',
      type: 'DELETE',
      contentType: 'application/json',
      data: JSON.stringify({
        id: id
      }),
      success: function() {
        row.fadeOut(80);
      }
    });
  });
});