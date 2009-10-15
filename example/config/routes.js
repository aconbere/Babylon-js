Example.Router = new Babylon.Router();
Example.Router.draw(function(bind){
    bind.query('message').to(Example.PresenceController, "message");
    bind.query('iq').to(Example.PresenceController, "iq");
    bind.query('presence').to(Example.PresenceController, "presence");
});
