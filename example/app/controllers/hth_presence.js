HTH.PresenceController = function(stanza) {
    this.stanza = stanza;
}
HTH.PresenceController.prototype = new Babylon.Controller();

HTH.PresenceController.prototype.message = function(stazna) {
    this.from = "bot@localhost";
    this.to = "aconbere@localhost";
    this.message = "test";
};

