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
    if(!this.controller) {
        return stanza
    }

    if(!this.controller.action) {
        return stanza
    }

    return this.controller.action(stanza);
}
