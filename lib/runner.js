Babylon.Runner = function(router, observer){
    this.observer = observer
    this.router = router;
};

Babylon.Runner.prototype.run = function(config){
    Babylon.log.debug("Connecting to: " + config["host"] + " with jid: " + config["jid"]);
    this.config = config;
    this.connection = new Babylon.Connection(config["host"], this);
    this.connection.connect(config["jid"], config["password"]);
};

Babylon.Runner.prototype.stop = function() {
    this.connection.disconnect();
};

Babylon.Runner.prototype.call_on_observers = function(status){
    Babylon.log.debug("Calling observers of " + status);
    for(var i = 0; i <= this.observer.all()[status].length; i++){
        this.router.execute_route(this.observer.all()[status][i], status, {});
    };
};

Babylon.Runner.prototype.on_stanza = function(stanza) {
    var resp = this.router.route(stanza);
    return true;
};

Babylon.Runner.prototype.on_connecting = function() {
    Babylon.log.debug("Connecting");
    this.call_on_observers("on_connecting");
};

Babylon.Runner.prototype.on_connected = function(connection) {
    Babylon.log.debug("Connected to: " + connection.service);
    this.router.connected(connection);
    this.call_on_observers("on_connected");
};

Babylon.Runner.prototype.on_disconnecting = function() {
    Babylon.log.debug("Disconnecting");
    this.call_on_observers("on_disconnecting");
};

Babylon.Runner.prototype.on_disconnected = function() {
    Babylon.log.debug("Disconnected");
    this.call_on_observers("on_disconnected");
};
