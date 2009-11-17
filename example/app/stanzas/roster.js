Babylon.Stanza.add("roster", "roster", function(stanza) {
  var s = {};
  s.to = stanza.getAttribute("to");
  s.items = $(stanza).find("item").each(function(item) {
    var i = {};
    i.jid = item.attr("jid");
    i.name = item.attr("name);
    i.subscription = item.attr("subscription");
    i.group = item.find("group").text();
    return i
  }
  return s;
});
