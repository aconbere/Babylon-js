Babylon.View = function(path, locals) {
    this.view_template = path;
    this.locals = {};
}();

Babylon.View.prototype.evaluate = function (bind, locals) {
    // merge bind and locals with locals taking precedence
    JQuery.extend(bind, locals);
    this.view_template || return null;
    this.view_tempalte(bind); 
};
