Chatter.Chat = function(stanza) { this.stanza = stanza; }
Chatter.Chat.prototype = new Babylon.Controller();
Chatter.Chat.prototype.name = "chat";

Chatter.Chat.prototype.send_message = function() {
};

Chatter.Chat.prototype.message = function() {
  $.publish("message", [{body: this.stanza.message}]);
  this.render({nothing: true});
};
