Babylon.Controller = function(stanza) {
    this.stanza = stanza;
};

Babylon.Controller.prototype.render = function(options) {
    if(this.view || !options.force) return null;

    if(options.view){
        this.view = options.view(this, options.locals);
    } else if(options.action){
        this[options.action]()  
    } else if(options.nothing){
        this.view = new Babylon.View();
    }
};

Babylon.Controller.prototype.evaluate = function(locals) {
    this.view.evaluate(this, locals);
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
