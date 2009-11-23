Screw.Unit(function() {
    describe("Babylon.Connection", function() {
        var test_host = "test_host";
        var jid = "student@hth.com";
        var password = "password";
        var connection = new Object();
        var test_handler = new Object();
        Strophe.Connection = MockConnection;

        before(function(){
          $.cookie('babylon', null);
          test_handler = new MockHandler();
          connection = new Babylon.Connection(test_host, test_handler);
        });
        
        after(function(){
          test_handler.reset();
          $.cookie('babylon', null);
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
              var mock = new Mock(Babylon.Connection.prototype);
              Babylon.Connection.prototype.stubs("register_cookie_callback");
              connection.connect(jid, password);
            });
            
            after(function(){
              Babylon.Connection.prototype.jsmocha.teardown();
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
        
        
        describe("using cookies to reconnect to existing session", function() {
          
          before(function(){
            var mock = new Mock(Babylon.Connection.prototype);
            Babylon.Connection.prototype.stubs("register_cookie_callback");
          });
          
          after(function(){
            if(Babylon.Connection.prototype.jsmocha){
              Babylon.Connection.prototype.jsmocha.teardown();
            }
          });
          
          
          it("should set the callback to write the cookie on page unload", function(){
            // var mock = new Mock(Babylon.Connection.prototype);
            Babylon.Connection.prototype.expects("register_cookie_callback");
            connection.on_connect(Strophe.Status.CONNECTED);
            expect(Babylon.Connection.prototype).to(verify_to, true);
          });
          
          it("should delete the cookie on disconnect", function(){
            // var mock = new Mock(Babylon.Connection.prototype);
            Babylon.Connection.prototype.expects("erase_cookie");
            connection.connect(jid, password, Babylon.Connection.on_connect);
            connection.disconnect();
            expect(Babylon.Connection.prototype).to(verify_to, true);
          });
          
          
          describe("read_cookie", function() {
              before(function() {
                document.cookie = "babylon=a,b,c";
              });

              it("should read in the cookie and split it's contents into jid, sid and rid", function() {
                  var cookie = connection.read_cookie();
                  expect(cookie.jid).to(equal, "a");
                  expect(cookie.sid).to(equal, "b");
                  expect(cookie.rid).to(equal, "c");
              });
          });


          describe("write_cookie", function() {
              before(function() {
                connection.connect(jid, password);
                connection.connection.sid = "sid_1";
                connection.connection.rid = "rid_1";
                connection.write_cookie();
              });

              it("should write the jid, sid and rid to the cookie named \"babylon\"", function() {
                var cookie = connection.read_cookie();
                expect(cookie.jid).to(equal, jid);
                expect(cookie.sid).to(equal, "sid_1"); 
                expect(cookie.rid).to(equal, "rid_1"); 
              });
          });
        });


        describe("reattach", function() {
          // tested in runner to give a more full stack test
        });


        describe("disconnect", function() {
            
            before(function(){
              var mock = new Mock(Babylon.Connection.prototype);
              Babylon.Connection.prototype.stubs("register_cookie_callback");
              connection.connect(jid, password);
              connection.disconnect();
            });

            after(function(){
              if(Babylon.Connection.prototype.jsmocha){
                Babylon.Connection.prototype.jsmocha.teardown();
              }
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
