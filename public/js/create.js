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
    // update ime bindings
    updateIMEBinding();
  }).on('click', '.btn-remove', function(e) {
      e.preventDefault();
      $(this).parents('.row:first').remove();
      return false;
  }).on('click', '#input-format-form', function(e) { 
    updateIMEBinding();
  });
  // First time setup
  updateIMEBinding();
});

function updateIMEBinding() {
  var hiraganaEnabled = ($('#hiragana-enabled').is(':checked'));
  var katakanaEnabled = ($('#katakana-enabled').is(':checked'));

  document.querySelectorAll('.wanakana-input').forEach(function(input) {
    wanakana.unbind(input);

    if (hiraganaEnabled) {
      wanakana.bind(input, {
        IMEMode: 'toHiragana'
      });
    }
    else if (katakanaEnabled) {
      wanakana.bind(input, {
        IMEMode: 'toKatakana'
      });
    }
  });
}