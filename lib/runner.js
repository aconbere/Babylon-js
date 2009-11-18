/* I'm noticing that a bulk of the time in this class
 * is spent emulating the interface of the Observer
 * It strikes me that perhaps I should split this up
 */
Babylon.Runner = function(router, observer){
    this.router = router;
    this.observer = observer;
};

Babylon.Runner.prototype.run = function(config){
    Babylon.log.debug("Connecting to: " + config["host"] + " with jid: " + config["jid"]);
    Babylon.config = config;
    var status_handler = new Babylon.StatusHandler(this.router, this.observer);
    Babylon.Runner.connection = new Babylon.Connection(config["host"], status_handler);
    var cookie = Babylon.Runner.connection.read_cookie();

    if(Babylon.config["attach"] && cookie && cookie != ""){
      Babylon.Runner.connection.reattach();
    } else {
      Babylon.Runner.connection.connect(config["jid"], config["password"]);
    }
};

Babylon.Runner.prototype.stop = function() {
    Babylon.Runner.connection.disconnect();
};

Babylon.Runner.prototype.raise = function(name, args){
    this.router.raise(name, args);
}

Babylon.Runner.prototype.connected = function() {
    return Babylon.Runner.connection.connected;
};
