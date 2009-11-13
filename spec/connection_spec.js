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
                expect(test_handler.statuses["connecting"]).to(equal, {status: "connecting"}); 
            });

            it("should trigger connected callback", function(){
                expect(test_handler.statuses["connected"]).to(equal, {status: "connected"}); 
            });

            it("should trigger authenticating callback", function(){
                expect(test_handler.statuses["authenticating"]).to(equal, {status: "authenticating"}); 
            });

            describe("when connection fails", function(){
                it("should trigger connection_failed callback", function(){
                    connection.connection.connection_failed();
                    expect(test_handler.statuses["connection_failed"]).to(equal, {status: "connection_failed", error: "TCP Error"}); 
                });
            });

            describe("when authentication fails", function(){
                it("should trigger authentication_failed callback", function(){
                    connection.connection.authentication_failed();
                    expect(test_handler.statuses["authentication_failed"]).to(equal, {status: "authentication_failed", error: "Bad password"}); 
                });
            });

            describe("when connection is established", function(){
                it("should send an initial presence", function(){
                    expect(connection.connection.stanza.nodeName).to(equal, "presence");
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
               expect(test_handler.statuses["disconnecting"]).to(equal, {status: "disconnecting"}); 
            });

            it("should trigger the disconnected callback", function(){
               expect(test_handler.statuses["disconnected"]).to(equal, {status: "disconnected"}); 
            });
        });
    });
});
