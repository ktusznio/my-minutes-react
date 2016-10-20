function rgbToHex(rgbString) {
  if( rgbString == null ) return false;
  var parts = rgbString.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if(parts == null ) return '#FFFFFF';

  delete (parts[0]);
  for (var i = 1; i <= 3; ++i) {
      parts[i] = parseInt(parts[i]).toString(16);
      if (parts[i].length == 1) parts[i] = '0' + parts[i];
  }
  return '#' + parts.join(''); // "0070ff"
}

function base_additional_markup() {
  $('.button').append('<div class="bt-shadow"></div>');
  $('.frame').append('<div class="overlay"></div>');
}

jQuery(document).ready(function($) {
  // Additional Markup
  base_additional_markup();

  // Pretty Print
  prettyPrint();

  // App Store button
  $('#appleButton, #appleBadge').click(function(e) {
    e.preventDefault();
    _gaq.push(['_trackEvent', 'App Store', 'clicked App Store button']);
    window.location.href = 'http://itunes.apple.com/us/app/my-minutes/id553366149?ls=1&mt=8';
  });

});
