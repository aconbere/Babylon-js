Babylon.Observer = function() {
    this.observers = {};
};

Babylon.Observer.prototype.all = function(){
    return this.observers
}

// Add an observer to a particular status change
// ex.
//      var runner = Babylon.Observer(router);
//      runner.add_connection_observer("on_connected", MyController)
//
// now when the on_connected event occurs, the "on_connected" action on MyController will be called
Babylon.Observer.prototype.add_connection_observer = function(status, observer) {
    alert("adding observer");
    Babylon.log.debug("Adding observer: " + status);
    if(!this.observers[status]){
        this.observers[status] = []
    };

    Babylon.log.debug("Adding observer: " + status);
    if (observer[status]) {
        Babylon.log.debug("Adding observer: " + status);
        this.observers[status].push(observer);
    };
};

Babylon.Observer.prototype.on_connecting = function() {
    Babylon.log.debug("Connecting");
    this.call_on_observers("on_connecting");
};

Babylon.Observer.prototype.on_connected = function(connection) {
    Babylon.log.debug("Connected to: " + connection.service);
    this.router.connected(connection);
    this.call_on_observers("on_connected");
};

Babylon.Observer.prototype.on_disconnecting = function() {
    Babylon.log.debug("Disconnecting");
    this.call_on_observers("on_disconnecting");
};

Babylon.Observer.prototype.on_disconnected = function() {
    Babylon.log.debug("Disconnected");
    this.call_on_observers("on_disconnected");
};
