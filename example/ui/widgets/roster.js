Chatter.RosterWidget = function(point) {
  $.subscribe("roster_item", function(item) {
    if($(point + "li." + item.jid).length > 0) {
      $("li." + item.jid).text(Chatter.RosterWidget.build_roster_item(item))
    } else {
      $("ul#roster").append('<li class="' + item.class + '">' + Chatter.RosterWidget.build_roster_item(item) + '</li>');
    }
  });
};

Chatter.RosterWidget.build_roster_item = function(item) {
  return item.name + ' <em>' + item.status + '</em>';
};
