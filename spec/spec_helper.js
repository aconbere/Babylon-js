/* Fakes Strophes connection api */
var MockConnection = function(host) {
    this.host = host;
    this.handlers = [];
};

MockConnection.prototype.connect = function(jid, password, on_status_change){
    this.jid = jid;
    this.password = password;
    this.on_status_change = on_status_change;

    this.status_to_connected = [Strophe.Status.CONNECTING, Strophe.Status.CONNECTED, Strophe.Status.AUTHENTICATING];

    for(var i = 0; i < this.status_to_connected.length; i++) {
        this.on_status_change(this.status_to_connected[i]);
    }
};

MockConnection.prototype.authentication_failed = function(){
    this.on_status_change(Strophe.Status.AUTHFAIL, "Bad password");
}

MockConnection.prototype.connection_failed = function(){
    this.on_status_change(Strophe.Status.CONNFAIL, "TCP Error");
}

MockConnection.prototype.disconnect = function(){
    this.status_to_disconnected = [Strophe.Status.DISCONNECTING, Strophe.Status.DISCONNECTED];

    for(var i = 0; i < this.status_to_disconnected.length; i++) {
        this.on_status_change(this.status_to_disconnected[i]);
    }
};

MockConnection.prototype.addHandler = function(func){
    this.handlers.push(func);
};

MockConnection.prototype.send = function(s){ this.stanza = s};

/* This is used so we can assert that the handler has been called */
MockHandler = function(){
    this.reset();
};
MockHandler.prototype.reset = function(s){ 
  this.statuses = {};
}, 
MockHandler.prototype.on_stanza = function(s){ this._on_stanza = true;}, 
MockHandler.prototype.on_status_change = function(stat, err){ this.statuses[stat] = {status: stat, error: err} };

/* This fakes being the "observer" that Babylon.Observer calls into */
MockObserver = function(){ this.name = "mock_observer"; };

Screw.Unit(function() {
    before(function() {
        Strophe.Connection = MockConnection
    });
});
