Babylon.Controller = function(stanza) {
    this.stanza = stanza;
};

Babylon.Controller.prototype.perform = function(action_name) {
    this.action_name = action_name;
    this[this.action_name]();
    return this.render({});
};

Babylon.Controller.prototype.render = function(options) {
    Babylon.log.debug("entering render");
    if(this.view && !options.force){ return null; }
    Babylon.log.debug("passed check");
    if(options["view"]){
        Babylon.log.debug("view: " + options.view);
        this.view = options.view;
        return this.view;
    } else if(options["action"]){
        return this[options.action]();
    } else if(options["nothing"]){
        Babylon.log.debug("rendering nothing!: " + options.view);
        return this.render({"view": function(l) { return null }});
    } else {
        return this.render({"view": Babylon.Views[this.action_name]});
    }
};

Babylon.Controller.prototype.evaluate = function(locals) {
    if(this.view) {
        var that = this;
        var out = this.view(that);

        if(out) { return out.tree(); }
    }
    return "";
};

Babylon.Controller.prototype.render_and_evaluate = function(options) {
    this.render(options);
    this.evaluate(); 
}

Babylon.Controller.prototype.render_evaluate_and_send = function(options) {
    this.render_and_evaluate(options);
    this.evaluate();
    //send?
}
