$(function(){
  $('a#view_pair_btn').click(function(e){
    e.preventDefault();
    $(this).hide();
    $('div.pair-name').show();
  });

  $("a#get_pair_btn").click(function(e){
    e.preventDefault();
    var this_btn = $(this);
    var this_data = $(this).data('userinformation');
    $(this).attr('disabled', true).html("<i class='fa fa-spin fa-spinner' style='color: white;'></i>");
    $.ajax({
      url: '/get_pair',
      method: 'post',
      data: {uuser: this_data}
    }).done(function(data){
      $('div.pair-name').text(data).show();
      $(this_btn).hide();
    }).fail(function(jqXHR, textStatus){
      $('div.pair-name').text("Please Try Again").css({'font-size': '20px'}).addClass('text-center').show();
      $(this_btn).attr('disabled', false).text('Get Pair');
    });
  });
});
