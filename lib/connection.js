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
    this.connection.connect(this.jid, this.password, function(s,e){that.on_connect(s,e)})
};

// write jid, sid, rid and expires to cookie
Babylon.Connection.prototype.write_cookie = function(expires) {
    var jid = this.jid;
    var sid = this.connection.sid;
    var rid = this.connection.rid;
    $.cookie("babylon", [jid, sid, rid].join(","));
};

// read jid, sid, rid and expires from cookie
Babylon.Connection.prototype.read_cookie = function(expires) {
  var cookie = $.cookie("babylon");
  if(cookie && cookie != "") {
      s = cookie.split(",");
      return {jid: s[0], sid: s[1], rid: s[2]};
  }
};

// This function reattaches to a previous connection on the server
// can be used for persisting the object accross page loads
Babylon.Connection.prototype.reattach = function() {
    cookie = this.read_cookie();
    var that = this;
    this.connection.attach(cookie.jid, cookie.sid, cookie.rid, that.on_connect);
};

Babylon.Connection.prototype.disconnect = function() {
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
            var that = this;
            // We want to receive ALL stanzas from strophe, un filtered
            this.connection.addHandler(function(s) { return that.handler.on_stanza(s); }, null, null, null, null,  null);
            this.connection.send($pres({from: this.jid}).tree());
            this.handler.on_status_change("connected");
            this.connected = true;
            break;
    }
};

Babylon.Connection.prototype.send = function(stanza) {
    if(stanza != "") {
        Babylon.log.debug("Sending: " + Strophe.serialize(stanza));
        this.connection.send(stanza);
        return true;
    } 
};

Babylon.Connection.on_status_change = function(status, err) {
  this.handler.on_status_change(status, err);
};
