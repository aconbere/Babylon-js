Chatter.Chat = function(stanza) { this.stanza = stanza; }
Chatter.Chat.prototype = new Babylon.Controller();
Chatter.Chat.prototype.name = "chat";

Chatter.Chat.prototype.send_message = function() {
  this.from = Babylon.config.full_jid;
  this.to = this.stanza.user;
  this.body = this.stanza.body;
};

Chatter.Chat.prototype.message = function() {
  $.publish("message", [{from: this.stanza.from, body: this.stanza.body}]);
  this.render({nothing: true});
};
