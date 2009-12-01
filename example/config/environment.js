Chatter.Init.environment = function(){
  Chatter.Init.Routes();
  Chatter.Init.Observers();
  Chatter.Init.Config();

  Chatter.runner = new Babylon.Runner(Chatter.Router, Chatter.Observer, Chatter.config);
  
  Chatter.LoginWidget();
  Chatter.StatusWidget();
  Chatter.RosterWidget();
};
