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
                    expect(test_handler.conn.stanza.tagName).to(equal, "presence");
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
