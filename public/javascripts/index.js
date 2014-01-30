$(function(){

  function scrollToBottomAnimated() {
    $("html,body").animate({scrollTop: document.body.scrollHeight}, "slow");
  };

  var sendingp = false;
  function sendFormData() {
    if (!sendingp) {
      sendingp = true;
      var name = $('#namae');
      var message = $('#message');
      connection.postMessage(name.val(), message.val());
      // $.cookie("name", name.val()); // store the name value
      message.val('');        // clear message
      $("#loading-area").removeClass("hidden");
    }
  };
  
  // check the cookie to recall name
  // if ($.cookie("name")) {
  //   $('input[name="namae"]').val($.cookie("name"));
  // }
  var connection = new MDChatConnection({user_id: LOGIN_USER_ID,
                                         not_use_open: false});
  connection.open();
  
  // need jquery.taboverride
  $('textarea').tabOverride(true);
  $('#btn').click(sendFormData);
  
  // S-Enter -> submit
  $('textarea').keydown(function(e) {
    if(e.keyCode == 13 && e.shiftKey) {
      if (e.preventDefault) {
        e.preventDefault();
        e.stopPropagation();
      }
      sendFormData();
    }
  });
});
