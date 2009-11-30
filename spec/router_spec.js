Screw.Unit(function() {
  describe("Babylon.Route", function() {
    var route = new Object();

    var controller = "test-controller";
    var action = "test-action";
    var query = 'message[from="tutor@hth.com"]'
    var stanza = $('<div><message type="chat" to="student@hth.com" from="tutor@hth.com"><body>Hi how can I help with algebra?</body></message></div>')

    before(function(){
      route = new Babylon.Route(query, controller, action)
    });

    describe("init", function() {
      it("should have vars query, controller, and action set", function() {
        expect(route.query).to(equal, query);
        expect(route.controller).to(equal, controller);
        expect(route.action).to(equal, action);
      });
    });

    describe("accepts", function() {
      describe("when the query matches the stanza", function() {
        it("should return true", function(){
          expect(route.accepts(stanza)).to(equal, true);
        });
      });

      describe("when the query does not matche the stanza", function() {
        before(function(){
          stanza = $('<div><message type="chat" to="student@hth.com" from="session_bot@htt.com"><body>I am the session bot!</body></message></div>');
        });
        it("should return false", function(){
          expect(route.accepts(stanza)).to(equal, false);
        });
      });
    });
  });
});

Screw.Unit(function() {
  describe("Babylon.Event", function() {
    var event = new Object();

    var event_name = 'message';
    var controller = "test-controller";
    var action = "test-action";

    before(function(){
      event = new Babylon.Event(event_name, controller, action);
    });

    describe("init", function() {
      it("should have vars name, controller and action set", function(){
        expect(event.name).to(equal, event_name);
        expect(event.controller).to(equal, controller);
        expect(event.action).to(equal, action);
      });
    });
  });
});

Screw.Unit(function() {
  describe("Babylon.Router", function() {
    var router = new Object();

    before(function(){
      router = new Babylon.Router();
    });

    describe("query", function() {
      it("should return a closure that provides .to", function() {
        var q = router.query("test-path-2");
        expect(q.to).to_not(equal, null);
        expect(q.to).to_not(equal, undefined);
      });

      describe("to", function() {
        var q = new Object();
        var controller = "controller";
        var action = "action";

        before(function(){
          q = router.query("test-path-3");
        });

        it("should add a Route in routes.", function() {
          q.to(controller, action)
          var r = router.routes.pop()
          expect(r.accepts).to_not(equal, null);
          expect(r.accepts).to_not(equal, undefined);
        });

        it("should return the bounding objects scope", function() {
          expect(q.query).to_not(equal, null);
          expect(q.query).to_not(equal, undefined);
        });
      });
    });

    describe("event", function() {
      var event_name = "test-event";

      it("should add the event \"name\" onto this.events", function() {
        router.event(event_name);
        expect(router.events[event_name]).to_not(equal, undefined)
        expect(router.events[event_name].length).to(equal, 0)
      });

      it("should return a closure that provides .to", function() {
        var e = router.event("test-event-2");
        expect(e.to).to_not(equal, null);
        expect(e.to).to_not(equal, undefined);
      });

      describe("to", function() {
        var e = new Object();
        var controller = "controller";
        var action = "action";
        var event_name = "test-event-3";

        before(function(){
          e = router.event(event_name);
        });

        it("should add an Event in events.", function() {
          e.to(controller, action)
          var r = router.events[event_name].pop()
          expect(r.name).to(equal, event_name);
          expect(r.controller).to(equal, controller);
          expect(r.action).to(equal, action);
        });

        it("should return the bounding objects scope", function() {
          expect(e.event).to_not(equal, null);
          expect(e.event).to_not(equal, undefined);
        });
      });
      
    });

    describe('routing_functions', function() {
      var controller = new Object();
      var action = "test-action";
      var action_e = "test-action-e";
      var controller_name = "test-controller";
      var stanza = $msg({type: "chat", to: "student@hth.com", from: "tutor@hth.com"}).c("body").t("Hi how can I help?").toString();
      var unmatched_stanza = $pres({type: "probe", to: "student@hth.com"}).toString();
      var view_r = $msg({type: "chat"}).c("body").t("text");

      before(function(){
        controller = function(stanza){ this.stanza = stanza, this.name = controller_name };
        controller.prototype = new Babylon.Controller();
        controller.prototype.name = controller_name;
        controller.prototype[action] = function(){};
        controller.prototype[action_e] = function(){};

        Babylon.Views.add(controller_name, action, function(l){ return view_r});
        Babylon.Views.add(controller_name, action_e, function(l){ return "" });

        Babylon.Runner.connection = {send: function(view) { this.view = view; }};
      });
      after(function() {
        Babylon.Views.clear();
      });

      describe('route', function() {
        var query = 'message[from="tutor@hth.com"]'
        
        before(function(){
          router.query(query).to(controller, action);
        });

        describe("when there are matching queries", function() {
          it("should execute the route", function() {
            router.route(stanza);
            expect(Babylon.Runner.connection.view).to(equal, view_r);
          });
        }); 
        describe("where no matching queries", function() {
          it("should return false", function() {
            expect(router.route(unmatched_stanza)).to(equal, false);
          });
        });
      });

      describe('raise', function() {
        var event_name = "test-event";
        before(function(){
          router.event(event_name).to(controller, action);
        });

        it("should execute_route for each listener on \"name\" with \"args\"", function() {
          router.raise(event_name, {});
          expect(Babylon.Runner.connection.view).to(equal, view_r);
        });
      });

      describe('execute_route', function() {
        it("should call the action with the object \"stanza\" and send the view", function() {
          router.execute_route(controller, action, stanza);
          expect(Babylon.Runner.connection.view).to(equal, view_r);
        });

        describe("when the action evaluates to \"\"", function() {
          it("should  return false", function() {
            expect(router.execute_route(controller, action_e, stanza)).to(equal, false);
          });
        });
      });
    });
  });
});
