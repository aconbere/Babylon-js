Chatter.Status = function(stanza) { this.stanza = stanza; };
Chatter.Status.prototype = new Babylon.Controller();
Chatter.Status.prototype.name = "status";

Chatter.Status.prototype.on_status_change = function() {
  $.publish("connection_status", [{status: this.stanza.status, error: this.stanza.error}]);
  this.render({"nothing": true});
};

Chatter.Status.prototype.on_connecting = function() { this.on_status_change() };
Chatter.Status.prototype.on_connection_failed = function() { this.on_status_change() };
Chatter.Status.prototype.on_authenticating = function() { this.on_status_change() };
Chatter.Status.prototype.on_authentication_failed = function() { this.on_status_change() };
Chatter.Status.prototype.on_connected = function() { this.on_status_change() };
Chatter.Status.prototype.on_disconnecting = function() { this.on_status_change() };
Chatter.Status.prototype.on_disconnected = function() { this.on_status_change() };
