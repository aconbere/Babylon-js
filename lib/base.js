Babylon = function() {};

/* This is actually the filter code from mozilla, it's added here to unify
 * the browsers array filters */
if (!Array.prototype.filter){
  Array.prototype.filter = function(fun){
    var len = this.length >>> 0;
    if (typeof fun != "function"){
      throw new TypeError();
    }

    var res = [];
    var thisp = arguments[1];
    for (var i = 0; i < len; i++){
      if (i in this){
        var val = this[i]; // in case fun mutates this
        if (fun.call(thisp, val, i, this)){
          res.push(val);
        }
      }
    }

    return res;
  };
}
