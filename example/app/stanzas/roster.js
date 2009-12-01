Babylon.Stanza.add("roster", "roster", function(stanza) {
  var s = {};
  s.to = stanza.getAttribute("to");
  s.items = $(stanza).find("item").map(function(i, item) {
    item = $(item);
    var roster_item = {};
    roster_item.full_jid = item.attr("jid");
    roster_item.jid = Babylon.get_bare_jid(roster_item.full_jid);
    roster_item.name = item.attr("name");
    roster_item.subscription = item.attr("subscription");
    roster_item.group = item.find("group").text();
    roster_item.status = "online";
    return roster_item
  });
  return s;
});

Babylon.Stanza.add("roster", "presence", function(stanza) {
  var s = {};
  s.to = stanza.getAttribute("to");
  s.from = stanza.getAttribute("from");
  s.status = stanza.getAttribute("status") || "online";
  return s;
});
