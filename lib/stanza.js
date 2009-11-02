Babylon.Stanza = {};

Babylon.Stanza.add = function(controller, action, func) {
    if(!this.controller) {
        this.controller = {};
    }

    if(!this.controller.action) {
        this.controller.action = func;
    }
}

Babylon.Stanza.wrap = function(controller, action, stanza) {
    Babylon.log.debug("Wrapping stanza: " + controller.name + ", " + action);
    if(!this.controller) {
        return stanza;
    } else if(!this.controller.action) {
        return stanza;
    } else {
        return this.controller.action(stanza);
    }
}
