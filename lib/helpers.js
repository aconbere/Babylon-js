Babylon.get_bare_jid = function(jid) {
  return jid.split("/")[0];
};

Babylon.escape = function(jid) {
  return jid.split("@").join("_");
};
