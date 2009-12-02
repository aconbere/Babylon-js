Chatter.Init.environment = function(){
  Chatter.Init.Routes();
  Chatter.Init.Observers();
  Chatter.Init.Config();

  Chatter.runner = new Babylon.Runner(Chatter.Router, Chatter.Observer, Chatter.config);
  
  var login_widget = new Chatter.LoginWidget("#login");
  var status_widget = new Chatter.StatusWidget("#status", "#error");
  var roster_widget = new Chatter.RosterWidget("#roster");
};
