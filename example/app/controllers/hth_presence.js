HTH.PresenceController = function(stanza) {
    this.stanza = stanza;
}

HTH.PresenceController.prototype = new Babylon.Controller();

HTH.PresenceController.prototype.message = function() {
    this.from = "bot@localhost";
    this.to = "aconbere@localhost";
    this.message = "test";
};

HTH.PresenceController.prototype.presence = function() {
    this.from = "bot@localhost";
    this.to = "aconbere@localhost";
    this.message = "test";
};

HTH.PresenceController.prototype.iq = function() {
    this.from = "bot@localhost";
    this.to = "aconbere@localhost";
    this.message = "test";
};

