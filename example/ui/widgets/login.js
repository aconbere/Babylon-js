Chatter.LoginWidget = function() {
  $("#login").submit(function() {
    var jid = $("#login #username").val();
    var password = $("#login #password").val();
    Chatter.runner.run(jid, password);
    return false;
  });

  $("#logout_form").submit(function(){
    Chatter.runner.stop();
  });
};
