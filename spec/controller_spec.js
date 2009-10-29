Screw.Unit(function() {
    describe("Babylon.Controller", function() {
        var controller = new Object();
        var action = "";
        var name = "";
        before(function(){
            action = "test-action";
            name = "test-controller";
            controller = function(stanza){this.stanza = stanza; this.name = name} 
            controller.prototype = new Babylon.Controller();
            controller[action] = function(){};
        });

        describe("perform", function() {
            it("should set the action parameter", function() {
                controller.perform(action);
                expect(controller.action).to(equal, action);
            });
        });

        describe("render", function() {
            it("should set this.view to a callable", function(){});
            it("should return null if this.view is already set", function(){});
            it("should call a different action if the action option is supplied", function(){});
            it("should set this.view to a callable that returns null, if the nothing option is supplied", function(){});
        });

        describe("evaluate", function() {
            it("should return \"\" if this.view is unset", function(){});
            it("should return the result of calling this.view", function(){});
        });
    });
});
