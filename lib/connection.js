/* Connection is a class that happily wraps strophe up */
Babylon.Connection = function(host, handler) {
    this.connected = false;
    this.host = host;
    this.connection = new Strophe.Connection(this.host);
    this.handler = handler
};

Babylon.Connection.prototype.connect = function(jid, password) {
    var that = this;
    this.jid = jid;
    this.password = password;
    this.connection.connect(this.jid, this.password, function(s,e){that.on_connect(s,e)})
};

Babylon.Connection.prototype.disconnect = function() {
    this.connection.disconnect();
    this.connected = false;
}

/* There are 5 connection statuses, this directs controll to functions
 * that handle them.
 *
 * But this in turn is really a wrapper around the handler passed to
 * the Connection object on initialization. If you follow most of these
 * paths, you'll find the same function called on the handler.*/
Babylon.Connection.prototype.on_connect = function(status, err) {
    switch(status) {
        case Strophe.Status.ERROR:
            this.on_error(err);
            break;

        case Strophe.Status.AUTHENTICATING:
            this.on_authenticating();
            break;

        case Strophe.Status.AUTHFAIL:
            this.on_authentication_failed(err);
            break;

        case Strophe.Status.DISCONNECTING:
            Babylon.log.debug("disconnecting");
            this.on_disconnecting();
            break;

        case Strophe.Status.DISCONNECTED:
            Babylon.log.debug("disconnected");
            this.on_disconnected();
            break;

        case Strophe.Status.CONNECTING:
            this.on_connecting();
            break;

        case Strophe.Status.CONNFAIL:
            Babylon.log.error("Connection failed");
            this.on_connection_failed();
            break;

        case Strophe.Status.CONNECTED:
            var that = this;
            // We want to receive ALL stanzas from strophe, un filtered
            this.connection.addHandler(function(s) { return that.on_stanza(s);}, null, null, null, null,  null);
            this.connection.send($pres({from: this.jid}).tree());
            this.handler.on_connected(this.connection);
            this.connected = true;
            break;
    }
};

Babylon.Connection.prototype.send = function(stanza) {
    if(v != "") {
        Babylon.log.debug("Sending: " + Strophe.serialize(v));
        this.connection.send(v);
        return true;
    } 
};

// Callbacks
Babylon.Connection.prototype.on_stanza = function(stanza) {
    var that = this;
    this.handler.on_stanza(stanza);
    return true;
};

Babylon.Connection.prototype.on_authenticating = function() {
    this.handler.on_authenticating();
};
Babylon.Connection.prototype.on_authentication_failed = function(err) {
    this.handler.on_authentication_failed(err);
};
Babylon.Connection.prototype.on_connecting = function() {
    this.handler.on_connecting();
};
Babylon.Connection.prototype.on_disconnected = function() {
    this.handler.on_disconnected();
};
Babylon.Connection.prototype.on_disconnecting = function() {
    this.handler.on_disconnecting();
};
Babylon.Connection.prototype.connection_failed = function(err) {
    this.handler.on_connection_failed(err);
};
