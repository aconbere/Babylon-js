/* I'm noticing that a bulk of the time in this class
 * is spent emulating the interface of the Observer
 * It strikes me that perhaps I should split this up
 */
Babylon.Runner = function(router, observer){
    this.router = router;
    this.observer = observer
};

Babylon.Runner.prototype.run = function(config){
    Babylon.log.debug("Connecting to: " + config["host"] + " with jid: " + config["jid"]);
    
    this.config = config;
    Babylon.config = config

    this.connection = new Babylon.Connection(config["host"], this);
    this.connection.connect(config["jid"], config["password"]);
};

Babylon.Runner.prototype.stop = function() {
    this.connection.disconnect();
};

Babylon.Runner.prototype.call_on_observers = function(status){
    var that = this;

    Babylon.log.debug("Calling observers of " + status);
    this.observer.call_on_observers(status, function(obs, stat){
        that.router.execute_route(obs, stat, {});
    });
};

Babylon.Runner.prototype.raise = function(name, args){
    this.router.raise(name, args);
}

Babylon.Runner.prototype.connected = function() {
    this.connection.connected
};


/* there seems like I should have a standard package for wrapping
 * the observe class in a handler and keeping this clean */
Babylon.Runner.prototype.on_stanza = function(stanza) {
    Babylon.log.debug("Recieved: " + Strophe.serialize(stanza));
    this.router.route(stanza)
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
