/* This class is used as the foundation for all controller classes */
Babylon.Controller = function(){};
Babylon.prototype.name = "default";

Babylon.Controller.prototype.perform = function(action_name, options) {
    this.action_name = action_name;
    this[this.action_name]();
    return this.render(options);
};

/* this is a rather complicated function that does a simple task.
 * It assigns this.view to an appropriate function. */
Babylon.Controller.prototype.render = function(options) {
    options = options || {};

    if(options["nothing"]) {
        // this hops nothing out of the short cuircuit and makes
        // for more... sensible behavior.
        this.view = function(l) { return "" };
    }

    // This prevents repeat calling of this functions
    if(this.view && !options["force"]){
      return false;
    } else if(options["view"]) {
        this.view = options["view"];
        return this.view;
    } else if(options["action"]) {
        return this.perform(options["action"]);
    } else {
        var view =  Babylon.Views.get(this.name, this.action_name);
        return this.render({"view": view});
    }
};

/* The bind variable that's passed to a view is the this from a controller */
Babylon.Controller.prototype.evaluate = function() {
    if(this.view) {
        return this.view(this);
    } else {
        return "";
    }
};

Babylon.Controller.prototype.render_and_evaluate = function(options) {
  this.render(options);
  return this.evaluate();
};

Babylon.Controller.prototype.render_evaluate_and_send = function(options) {
  options["force"] = true;
  response = this.render_and_evaluate(options);
  Babylon.log.debug("Sending from render_evaluate_and_send");
  Babylon.Runner.connection.send(response);
};
