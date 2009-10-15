Babylon.Views.message = function(bind) {
    return $msg({'type': "chat", 'to': bind.to, 'from': bind.from}).c('body').t(bind.message);
};

Babylon.Views.presence = function(bind) {
    return $msg({'type': "chat", 'to': bind.to, 'from': bind.from}).c('body').t(bind.message);
};

Babylon.Views.iq = function(bind) {
    return $msg({'type': "chat", 'to': bind.to, 'from': bind.from}).c('body').t(bind.message);
};
