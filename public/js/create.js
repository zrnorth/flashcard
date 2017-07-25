// Depends on /lib/wanakana.min.js
$(function() {
  $(document).on('click', '.btn-add', function(e) {
    e.preventDefault();
    // Copy the current row
    var firstRow = $('.row:first');
    var newRow = $(firstRow.clone()).insertBefore('form .row:last');
    // Remove any previously entered text from the new row
    newRow.find('input').val('');
    // Replace the + button with a - button
    $('form').find('.row:not(:last) .btn-add')
      .removeClass('btn-add').addClass('btn-remove')
      .removeClass('btn-success').addClass('btn-danger')
      .html('<span class="glyphicon glyphicon-minus"></span>');
    updateKanaInput();
  }).on('click', '.btn-remove', function(e) {
    e.preventDefault();
    $(this).parents('.row:first').remove();
    return false;
  }).on('click', '#input-format-form', function(e) {
    updateKanaInput();
  });
});

var updateKanaInput = function() {
  var enabled = $('#kana-enabled').is(':checked');
  $('.japanese-input').each(function(i) {
    $(this).attr('data-kana-input', enabled);
  });
}