Chatter.RosterWidget = function(point) {
  this.point = $(point);
  this.subscribe();
};

Chatter.RosterWidget.prototype.subscribe = function() {
  var that = this;

  $.subscribe("roster_item", function(item) {
    that.add_roster_item(item);
  });

  $.subscribe("presence", function(presence) {
    that.add_or_update(presence);
  });
};

Chatter.RosterWidget.prototype.item_text = function(item) {
  return item.jid + ' <em>' + item.status + '</em>';
};

Chatter.RosterWidget.prototype.add_roster_item = function(item) {
  item.jid = Babylon.get_bare_jid(item.jid);
  var i = this.get_item(item.jid);

  if(i == null) {
    var roster_item = $('<li class="' + Babylon.escape(item.jid) + '">' + this.item_text(item) + '</li>');

    roster_item.dblclick(function(){
      var chat_window = new Chatter.ChatWidget("#chat", item.jid);
    }).click(function() {
      // highlight and show options
      // .. remove
      // .. chat
    });

    this.point.append(roster_item);
  }
};

Chatter.RosterWidget.prototype.add_or_update = function(item) {
  item.jid = Babylon.get_bare_jid(item.jid);
  var i = this.get_item(item.jid);

  if(i != null) {
    i.text(this.item_text(item));
  } else {
    this.add_roster_item(item);
  }
};

Chatter.RosterWidget.prototype.get_item = function(jid) {
  jid = Babylon.escape(jid);
  var l = this.point.find("li." + jid);

  if(l.length > 0) {
    return l[0];
  } else {
    return null;
  }
};

