HTH.Router = new Babylon.Router();
HTH.Router.draw(function(bind){
    bind.query('message[type="chat"]').to(HTH.PresenceController, "message");
//    this.query('iq[type="set"]').to(HTH.PresenceController, "iq_set");
//    this.query('iq[type="get"]').to(HTH.PresenceController, "iq_get");
});
