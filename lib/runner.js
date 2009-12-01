Babylon.Runner = function(router, observer, config){
  this.router = router;
  this.observer = observer;
  this._should_reattach = false;
  this._defaults = { host: "http://localhost/http-bind/",
                  resource: "babylon" }

  Babylon.config = config || this._defaults;
  Babylon.config.host = config.host || this._defaults.host;
  Babylon.config.resource = config.resource || this._defaults.resource;

  var status_handler = new Babylon.StatusHandler(this.router, this.observer);
  Babylon.Runner.connection = new Babylon.Connection(Babylon.config.host, status_handler);
};

Babylon.Runner.prototype.run = function(jid, password){
  if(this.should_reattach()){
    // reattach    
    Babylon.log.debug("Reattaching");
  } else {
    this.set_credentials(jid, password);
    Babylon.log.debug("Connecting to: " + Babylon.config.host + " with jid: " + Babylon.config.full_jid);
    Babylon.Runner.connection.connect(Babylon.config.full_jid, Babylon.config.password);
  }
};

Babylon.Runner.prototype.set_credentials = function(jid, password) {
  Babylon.config.jid = Babylon.get_bare_jid(jid);
  Babylon.config.full_jid = jid + '/' + Babylon.config.resource;
  Babylon.config.password = password || Babylon.config.password;
};

Babylon.Runner.prototype.should_reattach = function() {
  if(this._should_reattach != undefined && !this._should_reattach) {
    return false;
  } else {
    var cookie = Babylon.Runner.connection.read_cookie();
    if(Babylon.config.attach && cookie && cookie !== "") {
      this.set_credentials(cookie.jid);
      return true;
    } else {
      return false;
    }
  }
};

Babylon.Runner.prototype.stop = function() {
  Babylon.Runner.connection.disconnect();
};

Babylon.Runner.prototype.raise = function(name, args){
  this.router.raise(name, args);
};

Babylon.Runner.prototype.connected = function() {
  return Babylon.Runner.connection.connected;
};

