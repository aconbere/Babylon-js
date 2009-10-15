HTH.Router = new Babylon.Router();
HTH.Router.draw(function(bind){
    bind.query('message').to(HTH.PresenceController, "message");
    bind.query('iq').to(HTH.PresenceController, "iq");
    bind.query('presence').to(HTH.PresenceController, "presence");
});
