Babylon.Controller = function(){};
Babylon.prototype.name = "default";

Babylon.Controller.prototype.perform = function(action_name, options) {
    Babylon.log.debug("perform: " + action_name);
    this.action_name = action_name;
    this[this.action_name]();
    Babylon.log.debug("performed: " + this[this.action_name]);
    return this.render(options);
};

Babylon.Controller.prototype.render = function(options) {
    options = options || {};
    if(this.view && !options.force){ return null; }
    if(options["view"]){
        this.view = options["view"];
        return this.view;
    } else if(options["action"]){
        return this.perform(options.action);
    } else if(options["nothing"]){
        return this.render({"view": function(l) { return "" }});
    } else {
        var view =  Babylon.Views[this.name][this.action_name];
        if(!view) {
            throw "No view set for this render action";
        } else {
            return this.render({"view": view});
        }
    }
};

Babylon.Controller.prototype.evaluate = function() {
    if(this.view) {
        var that = this;
        return this.view(that);
    } else {
        return "";
    }
};
