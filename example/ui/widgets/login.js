Chatter.LoginWidget = function(point) {
  this.point = $(point);
};

Chatter.LoginWidget.prototype.set_connect = function() {
  var that = this;
  $("#login").submit(function() {
    that.connect();
  });
};

Chatter.LoginWidget.prototype.connect = function() {
  var jid = this.point.find("#username").val();
  var password = this.point.find("#password").val();
  Chatter.runner.run(jid, password);
  return false;
};

Chatter.LoginWidget.prototype.set_disconnect = function() {
  $("#logout_form").submit(function(){
    that._disconnect();
  });
};

Chatter.LoginWidget.prototype.disconnect = function() {
  Chatter.runner.stop();
};
