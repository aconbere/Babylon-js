Babylon.Route = function(query, controller, action) {
    this.query = query;
    this.controller = controller;
    this.action = action;
}();

Babylon.Route.prototype.accepts = function(stanza) {
    ${this.query, stanza);
};

Babylon.Router = function() {
    this.queries = [];
    this.routes = []
} ();

Babylon.Router.connected = function(connection) {
    this.connection = connection;
};

Babylon.Router.query = function(path) {
    this.queries.push(path);
};

Babylon.Router.to = function(controller, action) {
    var query = this.queries.pop;
    var route = new Babylon.Route(query, controller, action);
    this.routes.push(route);
    return this;
};

Babylon.Router.draw = function(func) {
    func();
};

Babylon.Router.route = function(stanza) {
    var route = this.routes.filter(function(r, i, a) { r.accepts(stanza) } || return false;
    this.execute_route(route.controller, route.action, stanza);
};

Babylon.Router.execute_route = function(controller, action, stanza) {
    // left out wrapping stanzas
    controller[action](stanza)
};

