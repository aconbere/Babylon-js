Babylon.Route = function(query, controller, action) {
    this.query = query;
    this.controller = controller;
    this.action = action;
};

Babylon.Route.prototype.accepts = function(stanza) {
    return stanza.find(this.query).length > 0;
};


Babylon.Router = function() {
    this.queries = [];
    this.routes = []
};

Babylon.Router.prototype.connected = function(connection) {
    this.connection = connection;
};

Babylon.Router.prototype.query = function(path) {
    this.queries.push(path);
    return this;
};

Babylon.Router.prototype.to = function(controller, action) {
    var query = this.queries.pop();
    var route = new Babylon.Route(query, controller, action);
    this.routes.push(route);
    return this;
};

Babylon.Router.prototype.draw = function(func) {
    func(this);
};

Babylon.Router.prototype.route = function(stanza) {
    var wrapped_stanza = $("<div></div>").append(stanza);
    alert(wrapped_stanza.html());
    var routes = this.routes.filter(function(r, i, a) { return r.accepts(wrapped_stanza) })

    if(routes.length >= 1){
        var route = routes[0];
        Babylon.log.debug("routing from query: " + route.query + " to action: " + route.action);
        this.execute_route(route.controller, route.action, stanza);
    } else {
        return false;
    }
};

Babylon.Router.prototype.execute_route = function(controller, action, stanza) {
    var c = new controller(stanza);
    c.perform(action);
    var v = c.evaluate()

    if(v != "") {
        this.connection.send(v);
    }
};
