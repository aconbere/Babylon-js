Babylon.Stanza = {};

Babylon.Stanza.add = function(controller, action, func) {
    if(!this[controller]) {
        this[controller] = {};
    }

    if(!this[controller][action]) {
        this[controller][action] = func;
    }
}

Babylon.Stanza.wrap = function(controller, action, stanza) {
    if(!this[controller]) {
        Babylon.log.debug("no controller");
        return stanza;
    } else if(!this[controller][action]) {
        Babylon.log.debug("no action");
        return stanza;
    } else {
        Babylon.log.debug("calling wrapper with stanza");
        return this[controller][action](stanza);
    }
}
