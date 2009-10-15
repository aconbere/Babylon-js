HTH.PresenceController = function(stanza) {
    this.stanza = stanza;
}

HTH.PresenceController.prototype = new Babylon.Controller();

HTH.PresenceController.prototype.message = function() {
    alert("message action");
    this.from = this.stanza.to;
    this.to = this.stanza.from;
    this.message = "test";
};

HTH.PresenceController.prototype.presence = function() {
    alert("presence action");
    this.from = this.stanza.to;
    this.to = this.stanza.from;
    this.message = "test";
};

HTH.PresenceController.prototype.iq = function() {
    alert("iq action");
    this.from = this.stanza.to;
    this.to = this.stanza.from;
    this.message = "test";
};

