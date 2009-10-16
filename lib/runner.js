Babylon.Runner = function(router){
    this.observers = {};
//    this.router = new Babylon.Router();
    this.router = router;
};

Babylon.Runner.prototype.run = function(config){
    Babylon.log.debug("Connecting to: " + config["host"] + " with jid: " + config["jid"]);
    this.config = config;
    this.connection = new Babylon.Connection(config["host"], this);
    this.connection.connect(config["jid"], config["password"]);
}

// Add an observer to a particular status change
// ex.
//      var runner = Babylon.Runner(router);
//      runner.add_connection_observer("on_connected", MyController)
//
// now when the on_connected event occurs, the "on_connected" action on MyController will be called
Babylon.Runner.prototype.add_connection_observer = function(status, observer){
    this.observers[status] || this.observers[status] = []
    if (observer[status]) {
        this.observers[status].push(observer);
    };
};

Babylon.Runner.prototype.call_on_observers = function(status){
    for(var i = 0; i <= this.observers[status].length, i++){
        this.router.execute_route(this.observers[status][i], status, {});
    };
}

Babylon.Runner.prototype.on_disconnected = function() {
    Babylon.log.debug("Connecting");
    this.call_on_observers("on_connecting");
};

Babylon.Runner.prototype.on_connected = function(connection) {
    Babylon.log.debug("Connected to: " + connection.service);
    this.router.connected(connection);
    this.call_on_observers("on_connected");
};

Babylon.Runner.prototype.on_disconnected = function() {
    Babylon.log.debug("Disconnecting");
    this.call_on_observers("on_disconnecting");
};

Babylon.Runner.prototype.on_disconnected = function() {
    Babylon.log.debug("Disconnected");
    this.call_on_observers("on_disconnected");
};


Babylon.Runner.prototype.on_stanza = function(stanza) {
    var resp = this.router.route(stanza);
    return true;
};
