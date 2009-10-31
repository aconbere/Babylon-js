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
    this.status_to_disconnected = [Strphe.Status.DISCONNECTING, Strophe.Strophe.DISCONNECTED];

    for(var i = 0; i < this.status_to_connected.length; i++) {
        this.on_status_change(this.status_to_connected[i]);
    }
};

MockConnection.prototype.addHandler = function(func){
    this.handlers.push(func);
};

MockConnection.prototype.send = function(s){};

MockHandler = function(){
    this._on_stanza = false;
    this._on_connecting = false;
    this._on_disconnecting = false;
    this._on_disconnected = false;
    this._on_connection_failed = false;
    this._on_connected = false;
};
MockHandler.prototype.on_stanza = function(s){ this._on_stanza = true;}, 
MockHandler.prototype.on_connecting = function(){ this._on_connecting = true };
MockHandler.prototype.on_disconnecting = function(){ this._on_disconnecting = true };
MockHandler.prototype.on_disconnected = function(){ this._on_disconnected = true };
MockHandler.prototype.on_connection_failed = function(){ this._on_connection_failed = true };
MockHandler.prototype.on_connected = function(conn){ this.conn = conn;
                                                     this._on_connected = true; };

// Needs a Mock Strophe Connection
Screw.Unit(function() {
    describe("Babylon.Connection", function() {
        var test_host = "test_host";
        var jid = "student@hth.com";
        var password = "password";
        var connection = new Object();
        var test_handler = new Object();
        Strophe.Connection = MockConnection;

        before(function(){
            test_handler = new MockHandler();
            connection = new Babylon.Connection(test_host, test_handler);
        });

        describe("init", function() {
            it("should set the connected, host, connection, handler", function(){
                expect(connection.connected).to(equal, false);
                expect(connection.host).to(equal, test_host);
                expect(connection.connection).to_not(equal, null);
                expect(connection.handler).to(equal, test_handler);
            });
        });

        describe("connect", function() {
            it("should set the jid and password", function(){
                connection.connect(jid, password);
                expect(connection.jid).to(equal, jid);
                expect(connection.password).to(equal, password);
            }); 

            it("should trigger, connecting and connected callbacks", function(){
            });
        });

        describe("disconnect", function() {
            it("should set connected to false", function(){});
        });
    });
});
