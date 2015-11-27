$(function(){

  // $(".btn_float").hover(function(){
  //   console.log("I got here");
  //   $(this).hide();
  //   $(".btn_custom").show();
  // });
  // $(".btn_custom").blur(function(){
  //   console.log("I got two");
  //   $(this).hide();
  //   $(".btn_float").show();
  // });
  // $(".btn_custom").mouseoutup(function(){
  //   console.log("I got two");
  //   $(this).hide();
  //   $(".btn_float").show();
  // });

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
      method: 'post',
      data: {uuser: this_data}
    }).done(function(data){
      $('div.pair-name').text(data).show();
      $(this_btn).hide();
    }).fail(function(jqXHR, textStatus){
      $('div.pair-name').html("<div class='col-xs-8 col-xs-offset-2 col-sm-8 col-sm-offset-2 alert alert-warning'>Please Try Again</div>").css({"font-size": '1em'}).show();
      // $('div.pair-name').text("Please Try Again").css({'font-size': '20px'}).addClass('text-center').show();
      $(this_btn).attr('disabled', false).text('Get Pair');
    });
  });
});
