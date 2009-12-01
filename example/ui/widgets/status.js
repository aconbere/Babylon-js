Chatter.StatusWidget = function() {
  $.subscribe("connection_status", function(e) {
    $("#status strong").text(e.status);
    if(e.error) {
      $("#error strong").text(e.error);
    }
  });
};
