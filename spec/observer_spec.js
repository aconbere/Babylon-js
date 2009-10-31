MockObserver = function(){
    this.name = "mock_observer";
    this.reset();
};

MockObserver.prototype.reset = function(){
    this._test_status = false;
}

MockObserver.prototype.test_status = function(){
    this._test_status = true;
};

Screw.Unit(function() {
    describe("Babylon.Observer", function() {
        var observer = new Object();
        var obs = new Object();
        var status = "test_status";

        before(function(){
            obs = new MockObserver();
            observer = new Babylon.Observer();
            observer.add_connection_observer(status, obs);
        });
        describe("add_connection_observer", function() {
            it("should add an observer to a given status change", function() {
                expect(observer.all()[status].pop().name).to(equal, "mock_observer");
            });
        });

        describe("call_on_observers", function() {
            it("should call func on each observer of a given status", function() {
                observer.call_on_observers(status, function(obs, stat){ obs[stat](); } )
                expect(obs._test_status).to(equal, true);
            });
        });
    });
});
