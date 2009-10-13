Babylon.Connection = function(handler);
    this.connected = false;
    this.connection = new Strophe.Connection(this.host);

} ();

Babylon.Connection.prototype.connect = function(jid, password, host) {
    this.jid = jid;
    this.password = password;
    this.host = host;
    this.connection.connect(this.jid, this.password, this.host)
};

Babylon.Connection.prototype.onConnect = function(status) {
    switch(status) {
        Strophe.Status.CONNECTING:
            this.connecting();

        Strophe.Status.CONNFAIL:
            this.connectionFailed();

        Strophe.Status.DISCONNECTING:
            this.disconnecting();

        Strophe.Status.DISCONNECTED:
            this.disconnectCompleted();

        Strophe.Status.CONNECTED:
            this.connectionCompleted();
    }
};

Babylon.Connection.prototype.connectionCompleted = function() {
    this.connection.addHandler(stanzaRecieved);
    this.connection.send($pres().tree());
    this.connected = true;
};

Babylon.Connection.prototype.disconnect = function() { this.connection.disconnect(); };
Babylon.Connection.prototype.stanzaRecieved = function() { }
Babylon.Connection.prototype.connecting = function() {};
Babylon.Connection.prototype.disconnecting = function() {};
Babylon.Connection.prototype.disconnectCompleted = function() {};
Babylon.Connection.prototype.connectionFailed = function() {};
