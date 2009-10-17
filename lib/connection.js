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

Babylon.Connection.prototype.on_connect = function(status, err) {
    switch(status) {
        case Strophe.Status.CONNECTING:
            this.on_connecting();
            break;

        case Strophe.Status.CONNFAIL:
            Babylon.log.error("Connection failed");
            this.on_connection_failed();
            break;

        case Strophe.Status.DISCONNECTING:
            Babylon.log.debug("disconnecting");
            this.on_disconnecting();
            break;

        case Strophe.Status.DISCONNECTED:
            Babylon.log.debug("disconnected");
            this.on_disconnected();
            break;

        case Strophe.Status.CONNECTED:
            var that = this;
            this.connection.addHandler(function(s) { that.on_stanza(s)}, null, null, null, null,  null);
            this.connection.send($pres({from: this.jid}).tree());
            this.handler.on_connected(this.connection);
            this.connected = true;
            break;
    }
};

// Callbacks
Babylon.Connection.prototype.on_stanza = function(stanza) {
    var that = this;
    this.handler.on_stanza(stanza);
    this.connection.addHandler(function(s) { that.on_stanza(s) }, null, null, null, null,  null);
};

Babylon.Connection.prototype.on_disconnected = function() {
    this.handler.on_disconnected();
};
Babylon.Connection.prototype.on_connecting = function() {
    this.handler.on_connecting();
};
Babylon.Connection.prototype.on_disconnecting = function() {
    this.handler.on_disconnecting();
};
Babylon.Connection.prototype.on_disconnected = function(){
    this.handler.on_disconnected();
};
Babylon.Connection.prototype.connection_failed = function() {
    this.handler.on_connection_failed();
};
