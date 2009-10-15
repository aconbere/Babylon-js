Babylon.Route = function(query, controller, action) {
    this.query = query;
    this.controller = controller;
    this.action = action;
};

Babylon.Route.prototype.accepts = function(stanza) {
    $(this.query, stanza);
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
    var query = this.queries.pop;
    var route = new Babylon.Route(query, controller, action);
    this.routes.push(route);
    return this;
};

Babylon.Router.prototype.draw = function(func) {
    func(this);
};

Babylon.Router.prototype.route = function(stanza) {
    var routes = this.routes.filter(function(r, i, a) { r.accepts(stanza) })
    alert(stanza);
    if(routes.length >= 1){
        alert("we have routes");
        var route = routes[0];
        this.execute_route(route.controller, route.action, stanza);
    } else {
        return false;
    }
};

Babylon.Router.prototype.execute_route = function(controller, action, stanza) {
    // left out wrapping stanzas
    controller[action](stanza)
};
