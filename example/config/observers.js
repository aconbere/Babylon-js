Chatter.Init.Observers = function() {
  Chatter.Observer = new Babylon.Observer();

  Chatter.Observer.add_connection_observer("on_connected", Chatter.Roster);

  Chatter.Observer.add_connection_observer("on_connecting", Chatter.Status);
  Chatter.Observer.add_connection_observer("on_connection_failed", Chatter.Status);
  Chatter.Observer.add_connection_observer("on_authenticating", Chatter.Status);
  Chatter.Observer.add_connection_observer("on_authentication_failed", Chatter.Status);
  Chatter.Observer.add_connection_observer("on_connected", Chatter.Status);
  Chatter.Observer.add_connection_observer("on_disconnecting", Chatter.Status);
  Chatter.Observer.add_connection_observer("on_disconnected", Chatter.Status);

};
