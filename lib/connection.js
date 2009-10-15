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
            this.connecting();
            break;

        case Strophe.Status.CONNFAIL:
            alert("connection failed");
            this.connectionFailed();
            break;

        case Strophe.Status.DISCONNECTING:
            alert("disconnecting");
            this.disconnecting();
            break;

        case Strophe.Status.DISCONNECTED:
            alert("disconnected");
            this.disconnectCompleted();
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

Babylon.Connection.prototype.disconnect = function() { this.connection.disconnect(); };
Babylon.Connection.prototype.on_stanza = function(stanza) {
    var that = this;
    this.handler.on_stanza(stanza);
    this.connection.addHandler(function(s) { that.on_stanza(s) }, null, null, null, null,  null);
};
Babylon.Connection.prototype.connecting = function() {};
Babylon.Connection.prototype.disconnecting = function() {};
Babylon.Connection.prototype.disconnect_completed = function(){ this.handler.on_disconnected(); };
Babylon.Connection.prototype.connection_failed = function() {};
