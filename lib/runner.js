/* I'm noticing that a bulk of the time in this class
 * is spent emulating the interface of the Observer
 * It strikes me that perhaps I should split this up
 */
Babylon.Runner = function(router, observer){
    this.router = router;
    this.observer = observer;
};


Babylon.Runner.prototype.set_config = function(config){
  Babylon.config = config;
  this.prepare();
};

Babylon.Runner.prototype.run = function(){
  if(this.should_reattach()){
    Babylon.Runner.connection.reattach();
  }
};

Babylon.Runner.prototype.connect = function(jid, password){
  Babylon.log.debug("Connecting to: " + Babylon.config.host + " with jid: " + Babylon.config.jid);

  Babylon.config.jid = jid;
  Babylon.config.password = password;

  Babylon.Runner.connection.connect(Babylon.config.jid, Babylon.config.password);
};

Babylon.Runner.prototype.prepare = function(){
  var status_handler = new Babylon.StatusHandler(this.router, this.observer);
  Babylon.Runner.connection = new Babylon.Connection(Babylon.config.host, status_handler);
};

Babylon.Runner.prototype.should_reattach = function(){
  var cookie = Babylon.Runner.connection.read_cookie();
  if(Babylon.config.attach && cookie && cookie !== ""){
    Babylon.config.jid = cookie.jid;
    return true;
  }else{
    return false;
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
