Babylon.Runner = function(){
    this.observers = [];
    this.router = new Babylon.Router();
    
}();

Babylon.Runner.run = function(config){
    this.config = config;
    this.connection = new Babylon.Connection(this);
    this.connection.connect(config["jid"], config["password"], config["host"]);
    
}

Babylon.Runner.prototype.add_connection_observer = function(observer){
    this.observers.push(observer);
};

Babylon.Runner.prototype.on_connected = function(connection) {
    this.router.connected(connection);
    for o in this.observers {
        o.on_connected();
    }
};

Babylon.Runner.prototype.on_disconnected = function() {
    for o in this.observers {
        o.on_disconnect();
    }
};

Babylon.Runner.prototype.on_stanza = function(stanza) {
    this.router.route(stanza);
};
