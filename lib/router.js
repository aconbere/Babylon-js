/* The Route class simply stores the relationship between the query,
 * the controller and the action, and provides a method to access
 * that relationship.
 */
Babylon.Route = function(query, controller, action) {
    this.query = query;
    this.controller = controller;
    this.action = action;
};

Babylon.Route.prototype.accepts = function(stanza) {
    return stanza.find(this.query).length > 0;
};

/* The Event class is used to push data to actions when not arriving from
 * external sources.
 */

Babylon.Event = function(name, controller, action){
    this.name = name;
    this.controller = controller;
    this.action = action;
};



/* The Router class builds routes, and executes them. Taking the provided * stanza to the controller and calling the action on it.
 */
Babylon.Router = function() {
    this.events = {};
    this.queries = [];
    this.routes = [];
};

/* Both query and event follow a kind of tricky pattern. In that this is a 
 * function that returns an object, that provides the .to function.
 * And that to function, captures within it, the reference to query, and
 * our original router object. Thus allowing us to create routes. */
Babylon.Router.prototype.query = function(path) {
    var that = this;

    that.to = function(controller, action) {
        var undef;
        if(controller == undef) {
          throw "Controller must be defined";
        };
        var route = new Babylon.Route(path, controller, action);
        that.routes.push(route);
        return that;
    };
    return that;
};

/* See .query for an explanation of what's happening */
Babylon.Router.prototype.event = function(name) {
    var that = this;
    this.events[name] = [];

    that.to = function(controller, action) {
        var undef;
        if(controller == undef) {
          throw "Controller must be defined";
        };
        var event = new Babylon.Event(name, controller, action);
        that.events[name].push(event);
        return that;
    };
    return that;
};

/* This is simple a closure around the func object such that
 * we can passin our little DSL
 */ 
Babylon.Router.prototype.draw = function(func) {
  func(this);
};

/* Takes a stanza, does a JQuery match against it to found a controller / action
 * pair, then intializes the controller and calls the action.
 */
Babylon.Router.prototype.route = function(stanza) {
  // the stanzas need to be wrapped so that JQuery can access their inner elements
  var wrapped_stanza;
  if ($.browser.msie){
    //IE errors unless the new XML DocumentFragment has a parent document
    wrapped_stanza = $("<div></div>", Strophe._makeGenerator());
  } else {
    wrapped_stanza = $("<div></div>");
  }

  //IE errors unless we use the typeof check
  if(typeof(stanza.getAttribute) == 'function' || stanza.jquery){
    wrapped_stanza.append(Strophe.serialize(stanza));
  } else {
    wrapped_stanza.append(stanza);
  }

  // finds all routes that match the stanza
  var routes = this.routes.filter(function(r, i, a) { return r.accepts(wrapped_stanza); });

  if(routes.length >= 1){
    // we only choose the first match since fallthrough would become unweildy
    var route = routes[0];
    Babylon.log.debug("routing from query: " + route.query + " to: " + route.controller.prototype.name + ", " + route.action);
    this.execute_route(route.controller, route.action, stanza);
  } else {
    return false;
  }
};

/* This is the event analog of "route" maybe one day these two interfaces
 * will be united
 */
Babylon.Router.prototype.raise = function(name, args) {
  var events = this.events[name];
  if(events && events.length > 0) {
    var ev_len = events.length;
    for (var i = 0; i < ev_len; i++) {
      var e = events[i];
      console.log(e);
      Babylon.log.debug("routing from event: " + name + " to : " + e.controller.prototype.name + ", " + e.action);
      this.execute_route(e.controller, e.action, args);
    }
  }
};

/* A Helper function for working with the controller */
Babylon.Router.prototype.execute_route = function(controller, action, stanza) {
  var s = Babylon.Stanza.wrap(controller.prototype.name, action, stanza);
  var c  = new controller(s);
  c.perform(action);
  Babylon.Runner.connection.send(c.evaluate());
  return false;
};
