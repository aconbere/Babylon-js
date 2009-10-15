var message = function(stanza) {
    return { from: stanza.getAttribue("from")
           , to: stanza.getAttribue("to")
           , type: staza.getAttribue("type") };
}
