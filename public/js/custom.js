$(function(){
  $('a#view_pair_btn').click(function(e){
    e.preventDefault();
    $(this).hide();
    $('div.pair').show();
  });

  $("a#get_pair_btn").click(function(e){
    e.preventDefault();
    var this_btn = $(this);
    var this_data = $(this).data('userinformation');
    $(this).attr('disabled', true).html("<i class='fa fa-spin fa-spinner' style='color: white;'></i>");

    $.ajax({
      url: '/get_pair',
      method: 'POST',
      data: {uuser: this_data}
    }).done(function(data){

      data = JSON.parse(data);
      $(this_btn).hide();
      $('div.pair-name').html("<div>" + data.name + "</div><div>" + data.email + "</div>");
      $('div.pair-error').hide()
      $('div.pair').show();

    }).fail(function(jqXHR, textStatus){
      var message = jqXHR.responseText || 'Please Try Again';
      $('div.pair-error').html("<div class='col-xs-8 col-xs-offset-2 col-sm-8 col-sm-offset-2 alert alert-warning'>" + message + "</div>").css({"font-size": '1em'}).show();
      $('div.pair-name').hide();
      $('div.pair').show();
      $(this_btn).attr('disabled', false).text('Get Pair');
    });
  });
});
