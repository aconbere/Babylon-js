Chatter.Init.Routes = function() {
  Chatter.Router = new Babylon.Router();
  Chatter.Router.draw(function(bind){
    bind.query('presence').to(Chatter.Roster, "presence");
    bind.query('iq[type="result"] query[xmlns="jabber:iq:roster"]').to(Chatter.Roster, "roster");
  });
};
