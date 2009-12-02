Chatter.ChatWidget = function(point, recipient) {
  this.point = $(point);
  this.message = $('<ul id="' + recipient + '"></ul>');
  this.form = $('<form><label for="send"><input type="text" id="send_message"></form>');
  this.point.append(message);
  this.point.append(form);
  this.subscribe();
};

Chatter.ChatWidget.prototype.subscribe = function() {
  var that = this;
  $.subscribe("message", function(message) {
    that.message_received(message);
  });

  this.form.submit(function() {
    var body = that.point.find("#send_message").val();
    var message = {from: Babylon.config.jid, body: body};
    that.build_message(message);
    Chatter.runner.raise("send_message", message);
    return false;
  });
}

Chatter.ChatWidget.prototype.message_received = function(message) {
  this.build_message(message.from, message.body, message.status);
};

Chatter.ChatWidget.prototype.build_message = function(message) {
  var message = $('<li><span class="message-from">' + message.from + '</span><span class="message-body">' + message.body + '</span></li>")
  this.messages.append(message);
};
