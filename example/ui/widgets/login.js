Chatter.LoginWidget = function(point) {
  this.point = $(point);
  this.set_connect();
  this.set_disconnect();
};

Chatter.LoginWidget.prototype.set_connect = function() {
  var that = this;
  $("#login").submit(function() {
    that.connect();
    return false;
  });
};

Chatter.LoginWidget.prototype.connect = function() {
  var jid = this.point.find("#username").val();
  var password = this.point.find("#password").val();
  Chatter.runner.run(jid, password);
};

Chatter.LoginWidget.prototype.set_disconnect = function() {
  $("#logout_form").submit(function(){
    that._disconnect();
    return false;
  });
};

Chatter.LoginWidget.prototype.disconnect = function() {
  Chatter.runner.stop();
};
