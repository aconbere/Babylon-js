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

    // This prevents repeat calling of this functions
    if(this.view && !options.force){ return false; }

    if(options["view"]){
        this.view = options["view"];
        return this.view;

    } else if(options["action"]){
        return this.perform(options.action);

    } else if(options["nothing"]){
        return this.render({"view": function(l) { return "" }});
    // if no options were given, assume we want to use the name of the actions
    // to look up a view
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
  response = this.render_and_evaluate(options);
  Babylon.Runner.connection.send(response);
};
