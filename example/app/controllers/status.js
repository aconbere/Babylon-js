HTH.Status = function(stanza) { this.stanza = stanza; };
HTH.Status.prototype = new Babylon.Controller();
HTH.Status.prototype.name = "status";

HTH.Status.prototype.on_status_change = function() {
  $.publish("connection_status", [{status: this.stanza.status, error: this.stanza.error}]);
  this.render({"nothing": true});
};

HTH.Status.prototype.on_connecting = function() { this.on_status_change() };
HTH.Status.prototype.on_connection_failed = function() { this.on_status_change() };
HTH.Status.prototype.on_authenticating = function() { this.on_status_change() };
HTH.Status.prototype.on_authentication_failed = function() { this.on_status_change() };
HTH.Status.prototype.on_connected = function() { this.on_status_change() };
HTH.Status.prototype.on_disconnecting = function() { this.on_status_change() };
HTH.Status.prototype.on_disconnected = function() { this.on_status_change() };
