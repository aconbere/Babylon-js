/* Fakes Strophes connection api */
var MockConnection = function(host) {
    this.host = host;
    this.handlers = [];
};

MockConnection.prototype.connect = function(jid, password, on_status_change){
    this.jid = jid;
    this.password = password;
    this.on_status_change = on_status_change;

    this.status_to_connected = [Strophe.Status.CONNECTING, Strophe.Status.CONNECTED];

    for(var i = 0; i < this.status_to_connected.length; i++) {
        this.on_status_change(this.status_to_connected[i]);
    }
};

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
    this._on_stanza = false;
    this._on_connecting = false;
    this._on_disconnecting = false;
    this._on_disconnected = false;
    this._on_connection_failed = false;
    this._on_connected = false;
}, 
MockHandler.prototype.on_stanza = function(s){ this._on_stanza = true;}, 
MockHandler.prototype.on_connecting = function(){ this._on_connecting = true;};
MockHandler.prototype.on_disconnecting = function(){ this._on_disconnecting = true; };
MockHandler.prototype.on_disconnected = function(){ this._on_disconnected = true; };
MockHandler.prototype.on_connection_failed = function(){ this._on_connection_failed = true; };
MockHandler.prototype.on_connected = function(conn){ this.conn = conn;
                                                     this._on_connected = true; };

/* This fakes being the "observer" that Babylon.Observer calls into */
MockObserver = function(){
    this.name = "mock_observer";
};

Screw.Unit(function() {
    before(function() {
        Strophe.Connection = MockConnection
    });
});
