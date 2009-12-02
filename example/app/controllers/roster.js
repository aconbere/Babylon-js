Chatter.Roster = function(stanza) { this.stanza = stanza; }
Chatter.Roster.prototype = new Babylon.Controller();
Chatter.Roster.prototype.name = "roster";

Chatter.Roster.prototype.on_connected = function() {
  this.from = Babylon.config["full_jid"];
};

Chatter.Roster.prototype.roster = function() {
  var items_len = this.stanza.items.length;
  for(var i = 0; i < items_len; i++) {
    $.publish("roster_item", [this.stanza.items[i]]);
  }
  this.render({nothing: true});
};

Chatter.Roster.prototype.add = function() {
  this.from = this.stanza.from;
  this.jid = this.stanza.jid;
  this.name = this.stanza.name;
  this.group = this.stanza.group;
};

Chatter.Roster.prototype.remove = function() {
  this.from = this.stanza.from;
  this.jid = this.stanza.jid;
};

Chatter.Roster.prototype.presence = function() {
  if(Babylon.get_bare_jid(this.stanza.from) != Babylon.get_bare_jid(Babylon.config.jid)) {
    $.publish("presence", [{"jid": this.stanza.from, "status": this.stanza.status}]);
  }
  this.render({nothing: true});
};
