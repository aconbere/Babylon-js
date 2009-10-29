Babylon.Controller = function(stanza) {
    this.name = "default"
    this.stanza = stanza;
};

Babylon.Controller.prototype.perform = function(action_name, options) {
    this.action_name = action_name;
    this[this.action_name]();
    return this.render(options);
};

Babylon.Controller.prototype.render = function(options) {
    options = options || {};
    if(this.view && !options.force){ return null; }
    if(options["view"]){
        this.view = options.view;
        return this.view;
    } else if(options["action"]){
        return this[options.action]();
    } else if(options["nothing"]){
        return this.render({"view": function(l) { return "" }});
    } else {
        return this.render({"view": Babylon.Views[this.name][this.action_name]});
    }
};

Babylon.Controller.prototype.evaluate = function(locals) {
    if(this.view) {
        var that = this;
        return this.view(that);
    }
    return "";
};

Babylon.Controller.prototype.render_and_evaluate = function(options) {
    this.render(options);
    return this.evaluate(); 
}
