Babylon.Views = {}; // yeah... just a container... it's cool
Babylon.Views.cs = {};

Babylon.Views.add = function(controller, action, func) {
    if(!this.cs[controller]) {
        this.cs[controller] = {};
    }

    if(!this.cs[controller][action]) {
        this.cs[controller][action] = func;
    }
}

Babylon.Views.get = function(controller, action) {
    if(!this.cs[controller]) {
        throw "No view set for this controller";
    } else if(!this.cs[controller][action]) {
        throw "No view set for this render action";
    } else {
        return this.cs[controller][action];
    }
}

Babylon.Views.clear = function() {
   this.cs = {}; 
};
