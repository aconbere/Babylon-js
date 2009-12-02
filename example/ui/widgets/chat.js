Chatter.ChatWidget = function(point, recipient) {
  console.log("new chat window");
  this.recipient = recipient;
  this.point = $(point);

  this.wrapper = $('<div id="' + Babylon.escape(recipient) + '"><h3>Chat with ' + recipient + '</div>');
  this.messages = $('<ul id="' + recipient + '"></ul>');
  this.form = $('<form><label for="send"><input type="text" name="send_message"><input type="submit" value="send"></form>');

  this.wrapper.append(this.messages);
  this.wrapper.append(this.form);
  this.point.append(this.wrapper)
  this.subscribe();
};

Chatter.ChatWidget.prototype.subscribe = function() {
  var that = this;

  $.subscribe("message", function(message) {
    if(Babylon.get_bare_jid(that.recipient) == Babylon.get_bare_jid(message.from)) {
      that.message_received(message);
    };
  });

  this.form.submit(function() {
    var body = that.point.find('input[name="send_message"]').val();
    var message = {user: that.recipient, body: body};
    that.build_message(Babylon.config.jid, message.body);
    Chatter.runner.raise("send_message", message);
    return false;
  });
}

Chatter.ChatWidget.prototype.message_received = function(message) {
  this.build_message(message.from, message.body);
};

Chatter.ChatWidget.prototype.build_message = function(from, body) {
  var message = $('<li><span class="message-from">' + from + '</span> <span class="message-body">' + body + '</span></li>')
  this.messages.append(message);
};
