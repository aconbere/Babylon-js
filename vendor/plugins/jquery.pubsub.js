/*  
  jQuery pub/sub plugin by Peter Higgins (dante@dojotoolkit.org)

  Loosely based on Dojo publish/subscribe API, limited in scope. Rewritten blindly.

  Original is (c) Dojo Foundation 2004-2009. Released under either AFL or new BSD, see:
  http://dojofoundation.org/license for more information.
*/  

;(function(d){
  var cache = {};

  d.publish = function(topic, args){
    // example:
    //    Publish stuff on '/some/topic'. Anything subscribed will be called
    //    with a function signature like: function(a,b,c){ ... }
    //
    //  |    $.publish("/some/topic", ["a","b","c"]);
    if(cache[topic]) {
      d.each(cache[topic], function(){
        this.apply(d, args || []);
      });
    }
  };

  d.subscribe = function(topic, callback){
    // returns: Array
    //    A handle which can be used to unsubscribe this particular subscription.
    //  
    // example:
    //  |  $.subscribe("/some/topic", function(a, b, c){ /* handle data */ });
    if(!cache[topic]){
      cache[topic] = [];
    }
    cache[topic].push(callback);
    return [topic, callback];
  };

  d.unsubscribe = function(handle){
    // summary:
    //    Disconnect a subscribed function for a topic.
    // handle: Array
    //    The return value from a $.subscribe call.
    // example:
    //  |  var handle = $.subscribe("/something", function(){});
    //  |  $.unsubscribe(handle);
    
    var t = handle[0];
    d.each(cache[t], function(idx){
      if(this == handle[1]){
        cache[t].splice(idx, 1);
      }
    });
  };
})(jQuery);
