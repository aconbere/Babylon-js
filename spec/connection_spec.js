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
            before(function(){
                test_handler.reset(); 
                connection.connect(jid, password);
            });

            it("should set the jid and password", function(){
                expect(connection.jid).to(equal, jid);
                expect(connection.password).to(equal, password);
            }); 

            it("should trigger connecting callback", function(){
               expect(test_handler._on_connecting).to(equal, true); 
            });

            it("should trigger connected callback", function(){
               expect(test_handler._on_connected).to(equal, true); 
            });

            describe("when connction is established", function(){
                it("should send an initial presence", function(){
                    console.log(test_handler.conn.stanza);
                    expect(test_handler.conn.stanza.tagName).to(equal, "PRESENCE");
                });
                it("should pass the connection object to the handler via on_connected", function(){
                    expect(test_handler.conn.connect).to_not(equal, null);
                    expect(test_handler.conn.connect).to_not(equal, undefined);
                });
                it("should set connected to true", function(){
                    expect(connection.connected).to(equal, true);
                });
            });
        });

        describe("disconnect", function() {
            before(function(){
                test_handler.reset(); 
                connection.connect(jid, password);
                connection.disconnect();
            });

            it("should set connected to false", function(){
                expect(connection.connected).to(equal, false);
            });

            it("should trigger the disconnecting callback", function(){
                expect(test_handler._on_disconnecting).to(equal, true);
            });

            it("should trigger the disconnected callback", function(){
                expect(test_handler._on_disconnected).to(equal, true);
            });
        });
    });
});
