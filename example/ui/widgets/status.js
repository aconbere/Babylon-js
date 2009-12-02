Chatter.StatusWidget = function(status_point, error_point) {
  this.status_point = $(status_point);
  this.error_point = $(error_point);
  this.subscribe();
};

Chatter.StatusWidget.prototype.init = function() {
  this.error_point.css({display: "none"});
};

Chatter.StatusWidget.prototype.subscribe = function() {
  var that = this;
  $.subscribe("connection_status", function(e) {
    that.update_status(e.status);
    if(e.error) {
      that.error(e.error);
    }
  });
};

Chatter.StatusWidget.prototype.update_status = function(text) {
  this.status_point.find("strong").text(text);
};

Chatter.StatusWidget.prototype.error = function(text) {
  this.error_point.find("strong").text(error);
};

