Babylon.Runner = function(router){
    this.observers = [];
//    this.router = new Babylon.Router();
    this.router = router;
};

Babylon.Runner.prototype.run = function(config){
    Babylon.log.debug("Connecting to: " + config["host"] + " with jid: " + config["jid"]);
    this.config = config;
    this.connection = new Babylon.Connection(config["host"], this);
    this.connection.connect(config["jid"], config["password"]);
}

Babylon.Runner.prototype.add_connection_observer = function(observer){
    this.observers.push(observer);
};

Babylon.Runner.prototype.on_connected = function(connection) {
    Babylon.log.debug("Connected to: " + connection.service);
    this.router.connected(connection);
    this.call_on_observers("on_connected");
};

Babylon.Runner.prototype.on_disconnected = function() {
    this.call_on_observers("on_disconnected");
};

Babylon.Runner.prototype.call_on_observers = function(method){
    for (var i = 0; i <= this.observers.length; i++) {
        this.observers[i][method]();
    };
}

Babylon.Runner.prototype.on_stanza = function(stanza) {
    var resp = this.router.route(stanza);
    return true;
};
