Babylon.Runner = function(router, observer){
    this.observer = observer
    this.router = router;
};

Babylon.Runner.prototype.run = function(config){
    Babylon.log.debug("Connecting to: " + config["host"] + " with jid: " + config["jid"]);
    this.config = config;
    this.connection = new Babylon.Connection(config["host"], this);
    this.connection.connect(config["jid"], config["password"]);
}

Babylon.Runner.prototype.call_on_observers = function(status){
    Babylon.log.debug("Calling observers of " + status);
    for(var i = 0; i <= this.observer.all()[status].length; i++){
        this.router.execute_route(this.observer.all()[status][i], status, {});
    };
}

Babylon.Runner.prototype.on_stanza = function(stanza) {
    var resp = this.router.route(stanza);
    return true;
};
