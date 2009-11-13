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

    Babylon.Runner.connection = new Babylon.Connection(config["host"], this);
    Babylon.Runner.connection.connect(config["jid"], config["password"]);
};

Babylon.Runner.prototype.stop = function() {
    Babylon.Runner.connection.disconnect();
};

Babylon.Runner.prototype.call_on_observers = function(status, error){
    var that = this;

    Babylon.log.debug("Calling observers of " + status);
    this.observer.call_on_observers(status, function(_observer, _status){
        that.router.execute_route(_observer, _status, {status: status, error: error});
    });
};

Babylon.Runner.prototype.raise = function(name, args){
    this.router.raise(name, args);
}

Babylon.Runner.prototype.connected = function() {
    Babylon.Runner.connection.connected
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
    this.call_on_observers("connecting");
};

Babylon.Runner.prototype.on_connection_failed = function(err) {
    Babylon.log.debug("Connection Failed");
    this.call_on_observers("connection_failed");
};

Babylon.Runner.prototype.on_connected = function(connection) {
    Babylon.log.debug("Connected to: " + connection.service);
    this.call_on_observers("connected");
};

Babylon.Runner.prototype.on_disconnecting = function() {
    Babylon.log.debug("Disconnecting");
    this.call_on_observers("disconnecting");
};

Babylon.Runner.prototype.on_disconnected = function() {
    Babylon.log.debug("Disconnected");
    this.call_on_observers("disconnected");
};

Babylon.Runner.prototype.on_authenticating = function() {
    Babylon.log.debug("Authenticating");
    this.call_on_observers("authenticating");
};

Babylon.Runner.prototype.on_authentication_failed = function(err) {
    Babylon.log.debug("Authentication Failed");
    this.call_on_observers("authentication_failed");
};
