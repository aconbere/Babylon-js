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
}

/* The Router class builds routes, and executes them. Taking the provided * stanza to the controller and calling the action on it.
 */
Babylon.Router = function() {
    this.events = {};
    this.queries = [];
    this.routes = []
};

Babylon.Router.prototype.connected = function(connection) {
    this.connection = connection;
};

Babylon.Router.prototype.query = function(path) {
    var that = this;
    this.queries.push(path);

    that.to = function(controller, action) {
        var query = that.queries.pop();
        var route = new Babylon.Route(query, controller, action);
        that.routes.push(route);
        return that;
    }
    return that;
};

Babylon.Router.prototype.event = function(name) {
    var that = this
    this.events[name] = []

    that.to = function(controller, action) {
        var event = that.events[name];
        var event = new Babylon.Event(name, controller, action);
        that.events[name].push(event);
        return that;
    }
    return that;
}

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
    var wrapped_stanza = $("<div></div>")

    if(stanza.getAttribute){
        wrapped_stanza.append(Strophe.serialize(stanza));
    } else {
        wrapped_stanza.append(stanza)
    }
    // finds all routes that match the stanza
    var routes = this.routes.filter(function(r, i, a) { return r.accepts(wrapped_stanza) })

    if(routes.length >= 1){
        // we only choose the first match since fallthrough would become unweildy
        var route = routes[0];
        Babylon.log.debug("routing from query: " + route.query + " to action: " + route.action);
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
        for (var i = 0; i < events.length; i++) {
            var e = events[i];
            Babylon.log.debug("routing from event: " + name + " to action: " + e.action);
            this.execute_route(e.controller, e.action, args);
        }
    }
};

/* A Helper function for working with the controller */
Babylon.Router.prototype.execute_route = function(controller, action, stanza) {
    var c  = new controller(Babylon.Stanza.wrap(controller, action, stanza));
    c.perform(action);
    var v = c.evaluate()

    if(v != "") {
        this.connection.send(v);
        return true;
    } 
    return false;
};

