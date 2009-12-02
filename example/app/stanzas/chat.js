Babylon.Stanza.add("chat", "message", function(stanza) {
  var s = {};
  s.from = stanza.getAttribute("from");
  s.to = stanza.getAttribute("to");
  s.body = $(stanza).find("body").text();
  return s;
});
