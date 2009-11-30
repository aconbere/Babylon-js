/* Connection is a class that happily wraps strophe up */
Babylon.Connection = function(host, handler) {
  this.connected = false;
  this.host = host;
  this.handler = handler;
  this.connection = new Strophe.Connection(this.host);
};

Babylon.Connection.prototype.connect = function(jid, password) {
  var that = this;
  this.jid = jid;
  this.password = password;
  this.connection.connect(this.jid, this.password, function(s,e){that.on_connect(s,e);});
};

// erase the cookie
Babylon.Connection.prototype.erase_cookie = function() {
  $.cookie("babylon", null, { path: '/' });
};

// write jid, sid, rid and expires to cookie
Babylon.Connection.prototype.write_cookie = function() {
  var jid = this.jid;
  var sid = this.connection.sid;
  var rid = this.connection.rid;
  if(jid !== "" && sid !== "" && rid !== ""){
    $.cookie("babylon", [jid, sid, rid].join(","), { path: '/' });
  }
};

// read jid, sid, rid and expires from cookie
Babylon.Connection.prototype.read_cookie = function(expires) {
  var cookie = $.cookie("babylon");
  if(cookie && cookie !== "") {
    s = cookie.split(",");
    return {jid: s[0], sid: s[1], rid: s[2]};
  }
};

// This function reattaches to a previous connection on the server
// can be used for persisting the object accross page loads
Babylon.Connection.prototype.reattach = function() {
  cookie = this.read_cookie();
  
  this.jid = cookie.jid;
  var that = this;
  this.connection.attach(cookie.jid, cookie.sid, cookie.rid, function(s,e){that.on_connect(s,e);});
};

Babylon.Connection.prototype.register_cookie_callback = function() {
  var that = this;
  // write the cookie with the  jid, rid and sid when the page is unloaded so that we can reattach
  window.onbeforeunload = function(){that.write_cookie();};
};

Babylon.Connection.prototype.unregister_cookie_callback = function() {
  window.onbeforeunload = null;
};

Babylon.Connection.prototype.reconnect_or_destroy_session = function() {
  this.erase_cookie();
  if(Babylon.config.reconnect){
    this.connect(Babylon.config.jid, Babylon.config.password);
  }else{
    this.unregister_cookie_callback();
  }
};

Babylon.Connection.prototype.cookie_callback = function() {
  this.write_cookie();
  return true;
};

Babylon.Connection.prototype.disconnect = function() {
  this.erase_cookie();
  this.unregister_cookie_callback();
  Babylon.config.reconnect = false;
  this.connection.disconnect();
  this.connected = false;
};

/* There are 5 connection statuses, this directs controll to functions
 * that handle them.
 *
 * But this in turn is really a wrapper around the handler passed to
 * the Connection object on initialization. If you follow most of these
 * paths, you'll find the same function called on the handler.*/
Babylon.Connection.prototype.on_connect = function(status, err) {
  switch(status) {
    case Strophe.Status.ERROR:
      Babylon.log.debug("status: error, " + err);
      this.erase_cookie();
      this.unregister_cookie_callback();
      this.on_error(err);
      break;

    case Strophe.Status.AUTHENTICATING:
      Babylon.log.debug("status: authenticating");
      this.handler.on_status_change("authenticating");
      break;

    case Strophe.Status.AUTHFAIL:
      Babylon.log.debug("status: authentication_failed, " + err);
      this.handler.on_status_change("authentication_failed", err);
      break;

    case Strophe.Status.DISCONNECTING:
      Babylon.log.debug("status: disconnecting");
      this.handler.on_status_change("disconnecting");
      break;

    case Strophe.Status.DISCONNECTED:
      Babylon.log.debug("status: disconnected");
      this.reconnect_or_destroy_session();
      this.handler.on_status_change("disconnected");
      break;

    case Strophe.Status.CONNECTING:
      Babylon.log.debug("status: connecting");
      this.handler.on_status_change("connecting");
      break;

    case Strophe.Status.CONNFAIL:
      Babylon.log.error("status: connection_failed, " + err);
      this.handler.on_status_change("connection_failed", err);
      break;

    case Strophe.Status.CONNECTED:
      Babylon.log.debug("status: connected");
      this.register_cookie_callback();
      this.register_for_all_messages();
      this.connection.send($pres({from: this.jid}).tree());
      this.handler.on_status_change("connected");
      this.connected = true;
      break;
    
    case Strophe.Status.ATTACHED:
      // Strophe fires the attached event before the first blank message has been sent
      // this causes jabber to ignore messages sent that are triggered by the attached
      // callback as they are sent before the firdt blank message.
      // SOLUTION:
      // wait got 500ms then call the attached event again
      var that = this;
      setTimeout(function(){
        console.log("running timout callback");
        Babylon.log.debug("status: attached");
        that.register_cookie_callback();
        that.register_for_all_messages();
        that.handler.on_status_change("attached");
        that.connected = true;
      }, 500);
      break;
    }
};

Babylon.Connection.prototype.register_for_all_messages = function() {
  var that = this;
  // We want to receive ALL stanzas from strophe, un filtered
  this.connection.addHandler(function(s) { return that.handler.on_stanza(s); }, null, null, null, null,  null);
};

Babylon.Connection.prototype.send = function(stanza) {
  if(stanza !== "") {
    Babylon.log.debug("Sending: " + Strophe.serialize(stanza));
    this.connection.send(stanza);
    return true;
  } 
};

Babylon.Connection.on_status_change = function(status, err) {
  this.handler.on_status_change(status, err);
};
