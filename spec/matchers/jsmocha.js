Screw.Matchers["verify_to"] = {
  match: function(expected, object) {
    if(object.jsmocha.verify() == expected){
      object.jsmocha.teardown();
      return true;
    }else{
      return false;
    }
  },
  failure_message: function(expected, object, not) {
    return object.jsmocha.report();
  }
}