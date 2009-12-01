Babylon.Views.add("roster", "on_connected", function(bind) {
  return xml("iq", {type: "get", from: bind.from, id: "roster_1"}, function() {
    this.xml("query", {xmlns: "jabber:iq:roster"});
  });
});

Babylon.Views.add("roster", "remove", function(bind) {
  return xml("iq", {type: "get", from: bind.from, id: "roster_1"}, function() {
    this.xml("query", {xmlns: "jabber:iq:roster"}, function() {
      this.xml("item", {jid: this.jid, subscription: "remove"});
    });
  });
});

Babylon.Views.add("roster", "add", function(bind) {
  return xml("iq", {type: "set", from: bind.from, id: "roster_2"}, function() {
    this.xml("query", {xmlns: "jabber:iq:roster"}, function() {
      if(!bind.name){ bind.name = ""; }
      this.xml(item, {jid: bind.jid, name: bind.name}, function() {
        if(bind.group) {
          this.xml("query", {}, function() {
            this.text(bind.group);
          });
        }
      });
    });
  });
});

