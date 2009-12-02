Chatter.RosterWidget = function(point) {
  this.point = $(point);
  this.subscribe();
};

Chatter.RosterWidget.prototype.subscribe = function() {
  var that = this;
  $.subscribe("roster_item", function(item) {
    that.add_or_update(item);
  });
};

Chatter.RosterWidget.prototype.item_text = function(item) {
  return item.name + ' <em>' + item.status + '</em>';
};

Chatter.RosterWidget.prototype.add_roster_item = function(item) {
  var that = this;
  this.point.append('<li class="' + item.jid + '">' + this.item_text(item) + '</li>');
  this.point.find("li." + item.jid).dblclick(function(){
    // start chat
    var chat_window = new Chatter.ChatWidget(item.jid);
  }).click(function() {
    // highlight and show options
    // .. remove
    // .. chat
  });
};

Chatter.RosterWidget.prototype.add_or_update(item) {
  var i = this.get_item(item.jid);

  if(i != null) {
    i.text(this.item_text(item));
  } else {
    this.add_roster_item(item);
  }
};

Chatter.RosterWidget.prototype.get_item = function(jid) {
  var l = this.point.find("li." + jid);
  if(l.length > 0) {
    return l[0];
  } else {
    return null;
  }
};
