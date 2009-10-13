HTH.StanzaRouter.draw(function(){
    this.query('message[type="chat"]').to(HTH, "chat_message");
    this.query('iq[type="set"]').to(HTH, "iq_set");
    this.query('iq[type="get"]').to(HTH, "iq_get");
});
