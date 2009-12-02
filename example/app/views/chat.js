Babylon.Views.add("chat", "send_message", function(bind) {
  return xml("message", {type: "chat", from: bind.from, to: bind.to}, function() {
    this.xml("body", {}, function() {
      this.text(bind.body);
    });
  });
});
