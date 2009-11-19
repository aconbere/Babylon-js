Screw.Unit(function() {
  describe("Babylon.Runner", function() {
    var runner = {};
    var router = {};
    var observer = {};

    before(function(){
      router = new Babylon.Router();
      observer = new Babylon.Observer();
      runner = new Babylon.Runner(router, observer);
    });

    describe("init", function() {
      it("should set the observer and router", function() {
        expect(runner.router).to_not(equal, null);
        expect(runner.router).to_not(equal, undefined);

        expect(runner.observer).to_not(equal, null);
        expect(runner.observer).to_not(equal, undefined);
      });
    });

    describe("run", function() {
      var host = "";
      var jid = "";
      var config = {};

      before(function(){
        host = "hth.com";
        jid = "student@hth.com";
        config = {"host": host, "jid": jid};
        runner.run(config);
      });
      
      it("should set the config", function() {
        expect(Babylon.config).to(equal, config);
      });

      it("should intialize the connection", function() {
        expect(Babylon.Runner.connection).to_not(equal, null);
        expect(Babylon.Runner.connection).to_not(equal, undefined);
        expect(Babylon.Runner.connection.host).to(equal, host);
      });

      it("should call connect on the connection", function() {
        expect(Babylon.Runner.connection.jid).to(equal, jid);
      });
    });
    
    describe("run with cookie", function() {
      
      it("should call reattach when a cookie exists", function(){
        var mock = new Mock(Babylon.Connection.prototype);
        Babylon.Connection.prototype.expects("read_cookie").returns({jid: "jid", sid: "sid", rid: "rid"});
        Babylon.Connection.prototype.expects("reattach");
        runner.run({"host": "hth.com", "jid": "student@hth.com", "attach": true});
        expect(Babylon.Connection.prototype).to(verify_to, true);
      });
    });
  });
});
