Example.PresenceController = function(stanza) { this.stanza = stanza; }
Example.PresenceController.prototype = new Babylon.Controller();
Example.PresenceController.prototype.name = "presence_controller";

Example.PresenceController.prototype.message = function() {
    this.from = "bot@localhost";
    this.to = "aconbere@localhost";
    this.message = "test";
};

Example.PresenceController.prototype.presence = function() {
    this.from = "bot@localhost";
    this.to = "aconbere@localhost";
    this.message = "test";
};

Example.PresenceController.prototype.iq = function() {
    this.from = "bot@localhost";
    this.to = "aconbere@localhost";
    this.message = "test";
};

