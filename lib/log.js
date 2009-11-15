Babylon.log = function(){};

// The logger object is meant to be easily overwritten
Babylon.log = {};
Babylon.log.debug = function(msg) { console.debug("Babylon: " + msg); };
Babylon.log.info = function(msg) { console.info("Babylon: " + msg); };
Babylon.log.warn = function(msg) { console.warn("Babylon: " + msg); };
Babylon.log.error = function(msg) { console.error("Babylon: " + msg); };

