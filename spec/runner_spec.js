Screw.Unit(function() {
    describe("Babylon.Runner", function() {
        var runner = new Object();
        var router = new Object();
        var observer = new Object();

        before(function(){
            router = new Babylon.Router();
            observer = new Babylon.Observer();
            runner = new Babylon.Runner(router, observer)
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
                config = {"host": host, "jid": jid} 
                runner.run(config)
            });
            it("should set the config", function() {
                expect(runner.config).to(equal, config);
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
    });
});
