Screw.Unit(function() {
  describe("Babylon.Runner", function() {
    
    var runner;
    var router;
    var observer;
    var host;
    var jid;
    var config;
    var resource;
    var config_clone;

    before(function(){
      router = new Babylon.Router();
      observer = new Babylon.Observer();
      runner = new Babylon.Runner(router, observer);
      
      host = "hth.com";
      jid = "student@hth.com";
      resource = "some_resource";
      config = { "host": host, "resource": resource };
      config_clone = jQuery.extend({}, config);
    });

    describe("init", function() {
      
      it("should set the observer and router", function() {
        expect(runner.router).to(equal, router);
        expect(runner.observer).to(equal, observer);
      }); // end it
    }); // end describe
    
    describe("set_config", function() {
    
      it("should intialize the connection", function() {
        runner.set_config(config_clone);
        expect(Babylon.Runner.connection).to_not(be_null);
        expect(Babylon.Runner.connection).to_not(be_undefined);
        expect(Babylon.Runner.connection.host).to(equal, host);
      }); // end it
    }); // end describe

    describe("connect", function() {

      before(function(){
        var mock = new Mock(Babylon.Connection.prototype);
        Babylon.Connection.prototype.stubs("register_cookie_callback");
        runner.set_config(config_clone);
      });

      after(function(){
        if(Babylon.Connection.prototype.jsmocha){
          Babylon.Connection.prototype.jsmocha.teardown();
        }
      });
      
      it("should set the config", function() {
        runner.connect(jid, "password");
        expect(Babylon.config.host).to(equal, host);
        expect(Babylon.config.jid).to(equal, jid);
        expect(Babylon.config.resource).to(equal, resource);
        expect(Babylon.config.full_jid).to(equal, jid + "/" + resource);
      }); // end it

      it("should call connect on the connection", function() {
        Babylon.Connection.prototype.expects("connect").passing(jid + '/' + resource, "password");
        runner.connect(jid, "password");
        expect(Babylon.Connection.prototype).to(verify_to, true);
      }); // end it
      
      it("should not call connect when it can attach to an existing session", function() {
        var r_mock = new Mock(Babylon.Runner.prototype);
        Babylon.Runner.prototype.expects("should_reattach").returns(true);
        Babylon.Connection.prototype.expects("connect").never();
        runner.connect(jid, "password", true);
        expect(Babylon.Connection.prototype).to(verify_to, true);
        expect(Babylon.Runner.prototype).to(verify_to, true);
      }); // end it
      
      it("should connect when it can attach to an existing session but the reattach_check flag not passed", function() {
        var r_mock = new Mock(Babylon.Runner.prototype);
        Babylon.Connection.prototype.expects("connect");
        runner.connect(jid, "password");
        expect(Babylon.Connection.prototype).to(verify_to, true);
      }); // end it
    }); // end describe
    
    describe("run with reattach", function() {
      
      it("should call reattach when a cookie exists and attach option passed", function(){
        var mock = new Mock(Babylon.Connection.prototype);
        Babylon.Connection.prototype.expects("read_cookie").returns({jid: "jid", sid: "sid", rid: "rid"});
        Babylon.Connection.prototype.expects("reattach");
        runner.set_config({"host": "hth.com", "jid": "student@hth.com", "attach": true});
        runner.run();
        expect(Babylon.Connection.prototype).to(verify_to, true);
      }); // end it
      
      it("should not call reattach when a cookie exists but attach option not passed", function(){
        var mock = new Mock(Babylon.Connection.prototype);
        Babylon.Connection.prototype.expects("read_cookie").returns({jid: "jid", sid: "sid", rid: "rid"});
        Babylon.Connection.prototype.expects("reattach").never();
        runner.set_config({"host": "hth.com", "jid": "student@hth.com"});
        runner.run();
        expect(Babylon.Connection.prototype).to(verify_to, true);
      }); // end it
      
      it("should not call reattach when a cookie does not exists and attach option passed", function(){
        var mock = new Mock(Babylon.Connection.prototype);
        Babylon.Connection.prototype.expects("read_cookie").returns("");
        Babylon.Connection.prototype.expects("reattach").never();
        runner.set_config({"host": "hth.com", "jid": "student@hth.com"});
        runner.run();
        expect(Babylon.Connection.prototype).to(verify_to, true);
      }); // end it
      
      it("should call the strophe attach method passing the data from the cookie", function(){
        var mock = new Mock(Babylon.Connection.prototype);
        var mock = new Mock(Strophe.Connection.prototype);
        
        Babylon.Connection.prototype.stubs("register_cookie_callback");
        Babylon.Connection.prototype.expects("read_cookie").twice().returns({jid: "123", sid: "456", rid: "789"});
        Strophe.Connection.prototype.expects("attach").passing(function(args){
          return args[0] == "123" && args[1] == "456" && args[2] == "789" ? true : false;
        });
        
        runner.set_config({ "host": "hth.com", "jid": "student@hth.com", "attach": true });
        runner.run();
        
        expect(Babylon.Connection.prototype).to(verify_to, true);
        expect(Strophe.Connection.prototype).to(verify_to, true);
      }); // end it
    }); // end describe
    
    
    describe("set_credentials", function() {
    
      before(function(){
        runner.set_config(config_clone);
      });
    
      it("should set the jid and full_jid but not the password", function() {
        runner.set_credentials(jid);
        expect(Babylon.config.password).to(be_undefined);
        expect(Babylon.config.jid).to(equal, jid);
        expect(Babylon.config.full_jid).to(equal, jid + '/' + resource);
      }); // end it
      
      it("should set the jid and full_jid and password", function() {
        runner.set_credentials(jid, "password");
        expect(Babylon.config.jid).to(equal, jid);
        expect(Babylon.config.full_jid).to(equal, jid + '/' + resource);
        expect(Babylon.config.password).to(equal, "password");
      }); // end it
    }); // end describe
  }); // end describe
});
