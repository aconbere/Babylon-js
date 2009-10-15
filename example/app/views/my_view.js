var views = {
    message: function(bind) {return $build("message", {'type': "chat", 'to': bind.to, 'from': bind.from}).c('body', bind.message)},
}
