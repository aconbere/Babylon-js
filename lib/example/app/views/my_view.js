myView = function(bind) {
    return $build("iq", {'type': "set", 'to': bind.to, 'from': bind.from, 'id': bind.id})
             .c('item', {})
};
