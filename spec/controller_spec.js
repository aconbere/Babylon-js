Screw.Unit(function() {
    describe("Babylon.Controller", function() {
        var controller = new Object();
        var action = "";
        var name = "";

        before(function(){
            action = "test-action";
            name = "test-controller";

            controller = new Babylon.Controller();
            controller.name = name;
            controller[action] = function(){};

            Babylon.Views[name] = {}
            Babylon.Views[name][action] = function(){ return "default view"};
        });

        describe("perform", function() {
            before(function() {
                controller = new Babylon.Controller();
                controller.name = name;
                controller[action] = function(){};
            });

            it("should set the action_name parameter", function() {
                controller.perform(action);
                expect(controller.action_name).to(equal, action);
            });

            it("should call the action specified", function() {
                controller[action] = function(){ this.perform_action_set_var = "xyz" };
                controller.perform(action);
                expect(controller.perform_action_set_var).to(equal, "xyz");
            });

            it("shouuld render the view attached to the action", function() {
                expect(controller.perform(action)()).to(equal, "default view");
            });
        });

        describe("render", function() {
            before(function(){
                controller = new Babylon.Controller();
                controller.name = name;
                controller[action] = function(){};
            });
            describe("when render has been called once before", function() {
                before(function() {
                    controller.render({view: true});
                });
                it("should return false", function(){
                    expect(controller.render()).to(equal, false);
                });
            });
            describe("when {nothing: true} is passed in", function() {
                it("should set this.view to a callable that returns \"\"", function(){
                    expect(controller.render({nothing: true})()).to(equal, "");
                });
            });

            describe("when {view: xxx} is passed in", function(){
                it("should set this.view to that function", function() {
                    expect(controller.render({view: function(l){return "test"}})()).to(equal, "test");
                });
            });

            describe("when {action: xxx} is passed in", function(){
                before(function() {
                    controller["alt-action"] = function(){};
                    Babylon.Views[name]["alt-action"] = function(){ return "abcd" };
                });

                it("should pass control to action xxx", function() {
                    expect(controller.render({action: "alt-action"})()).to(equal, "abcd");
                });
            });
        });

        describe("evaluate", function() {
            it("should return \"\" if this.view is unset", function(){
                controller.view = null;
                expect(controller.evaluate()).to(equal, "");
            });

            it("should return the result of calling the view in that scope", function(){
                controller.view = function(bind){ return bind.bound_var };
                controller.bound_var = "tada";
                expect(controller.evaluate()).to(equal, "tada");
            });
        });
    });
});
