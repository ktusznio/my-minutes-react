function base_customize_panel() {
  // Init Color Value
  $('#background-color-custom').val( rgbToHex( $('#splash').css('background-color') ) );

  // Version
  $('input[name="custom-version"]').change(function(){
    $('body').removeClass('dark light').addClass( $(this).val() );
  });

  // Scheme
  $('#scheme-custom li').click(function(){
    $('body').removeClass('scheme-red scheme-orange scheme-green scheme-blue scheme-black').addClass('scheme-' + $(this).attr('data-scheme') );
  });

  // Background
  $('#background-color-custom').change(function(){
    $('#splash').css('background-color', $(this).val());
  });
  $('#background-texture-custom li').click(function(){
    $('#splash .pattern').css('background-image', 'url(./images/splash/texture/' + $(this).attr('data-texture') + '.png)');
  });
  $('#background-image-custom li').click(function(){
    if( $(this).attr('data-bg') == 'none' ) {
      $('#splash').css('background-image', 'none');
    } else {
      $('#splash').css('background-image', 'url(./custom/background-image/' + $(this).attr('data-bg') + ')');
    }
    
  });

  // Border
  $('#show-border-custom').change(function(){
    if( $(this).is(':checked') ){
      $('#border').show();
    }else{
      $('#border').hide();
    }
  });
  $('#border-color-custom').change(function(){
    $('#border').css('background-color', $(this).val());
  });
  $('#border-texture-custom li').click(function(){
    $('#border').css('background-image', 'url(./images/border/texture/' + $(this).attr('data-texture') + '.png)');
  });

  // Devices
  $('#device-custom').change(function(){
    $('#product-container').removeClass().addClass('container').addClass( $(this).attr('value') );
  });

}

jQuery(document).ready(function($) {

  // Customize Panel
  base_customize_panel();

});
