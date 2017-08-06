// Depends on /lib/wanakana.min.js
$(function() {
  $(document).on('click', '.btn-success', function(e) {
    e.preventDefault();
    // Copy the current row
    var thisRow = $(this).parents('.row');
    var newRow = $(thisRow.clone()).insertAfter(thisRow);
    // Remove any previously entered text from the new row
    newRow.find('input').val('');
    // Replace the + button with a - button
    $('form').find('.row:not(:last) .btn-success')
      .removeClass('btn-success').addClass('btn-danger')
      .html('<span class="glyphicon glyphicon-minus"></span>');
    updateKanaInput();
  }).on('click', '.btn-danger', function(e) {
    e.preventDefault();
    $(this).parents('.row').remove();
    return false;
  }).on('click', '#input-format-form', function(e) {
    updateKanaInput();
  });
  updateKanaInput();
});

var updateKanaInput = function() {
  var enabled = $('#kana-enabled').is(':checked');
  $('.japanese-input').each(function(i) {
    $(this).attr('data-kana-input', enabled);
  });
}