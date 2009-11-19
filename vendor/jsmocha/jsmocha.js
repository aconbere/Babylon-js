var jsMocha = {};

jsMocha.Cardinality = new function() {
    function Cardinality(required, maximum) {
        this.required = required;
        this.maximum = maximum;

        this.verify = function(invocation_count) {
      		return invocation_count >= this.required && invocation_count <= this.maximum ? true : false;
      	};

      	this.allowed_any_number_of_times = function() {
          return this.required === 0 && this.maximum == Infinity ? true : false;
        };

      	this.inspect = function() {
          if(this.allowed_any_number_of_times()){
            return "allowed any number of times";
          }
          else{
            if(this.required === 0 && this.maximum === 0){
              return "expected never";
            }
            else if(this.required == this.maximum){
              return "expected exactly " + this.times(this.required);
            }
            else if(this.maximum == Infinity){
              return "expected at least " + this.times(this.required);
            }
            else if(this.required === 0){
              return "expected at most " + this.times(this.maximum);
            }
          }
        };

        this.times = function(number) {
          switch(number){
            case 0:
              return "no times";
            case 1:
              return "once";
            case 2:
              return "twice";
            default:
              return number + " times";
          }
        };
    }
    this.exactly = function(number) {
        return new Cardinality(number, number);
    };
    this.at_least = function(number) {
        return new Cardinality(number, Infinity);
    };
    this.at_most = function(number) {
        return new Cardinality(0, number);
    };
};
jsMocha.Expectation = function(mock, method_name) {
	this.mock = mock;
	this.mock_name = this.get_name(mock);
	this.method_name = method_name;
	this.actual_parameters = null;
	this.replace_method(mock, method_name);
  this.cardinality = jsMocha.Cardinality.exactly(1);
	this.invocation_count = 0;
	this.local_report = [];
	this.return_values = null;
	this.valid = true;
}

jsMocha.Expectation.prototype = {

	times: function(number) {
		this.cardinality = jsMocha.Cardinality.exactly(number);
		return this;
	},
	once: function() {
		this.cardinality = jsMocha.Cardinality.exactly(1);
		return this;
	},
	twice: function() {
		this.cardinality = jsMocha.Cardinality.exactly(2);
		return this;
	},
	never: function() {
		this.cardinality = jsMocha.Cardinality.exactly(0);
		return this;
	},
	at_least: function(number) {
		this.cardinality = jsMocha.Cardinality.at_least(number);
		return this;
	},
	at_most: function(number) {
		this.cardinality = jsMocha.Cardinality.at_most(number);
		return this;
	},
	passing: function() {
		this.parameters_matcher = new jsMocha.ParametersMatcher(arguments);
		return this;
	},
	returns: function() {
		this.return_values = arguments;
		return this;
	},
	replace_method: function(mock, method_name) {
		this.original_method = mock[method_name];
		var self = this;
		mock[method_name] = function(){
			self.invocation_count += 1;
			if(self.parameters_matcher){
				self.parameters_matcher.match(arguments);
			}
			if(self.return_values){ return self.next_return_value(); }
		};
	},
	next_return_value: function() {
	  var return_vals_length = this.return_values.length;
	  if( return_vals_length == 1 ){
	    return this.return_values[0];
	  }
	  else if( return_vals_length > 1 ){
	    var return_indxed = this.invocation_count-1;
	    if(return_indxed > return_vals_length-1){
	      return this.return_values[return_vals_length-1];
	    }
	    else{
	      return this.return_values[return_indxed];
      }
	  }
	},
	verify: function(){
		this.valid = true;
		this.local_report = [];
		this.add_report("object: "+this.mock_name+'.'+this.method_name);

    if(this.cardinality.verify(this.invocation_count)){
      this.set_valid(true);
			this.add_report('PASS '+this.cardinality.inspect()+' invoked '+this.cardinality.times(this.invocation_count));
		}
		else{
			this.set_valid(false);
			this.add_report('FAIL wrong number of invocations, '+this.cardinality.inspect()+' invoked '+this.cardinality.times(this.invocation_count));
		}

		if(this.parameters_matcher){
			param_report = this.parameters_matcher.report();
			if(param_report === true){
				this.set_valid(true);
			}
			else{
				this.set_valid(false);
				this.add_report('FAIL '+param_report);
			}
		}
		return(this.is_valid());
	},
	set_valid: function(valid) {
		if(this.valid !== false){
			this.valid = valid;
		}
	},
	is_valid: function() {
		return this.valid;
	},
	report: function(){
		return this.local_report.join("\r\n");
	},
	add_report: function(report){
		this.local_report.push(report);
	},
	restore: function(){
		this.mock[this.method_name] = this.original_method;
	},
	get_name: function(mock) {
	   var funcNameRegex = /function (.{1,})\(/;
	   var results = (funcNameRegex).exec((mock).constructor.toString());
	   return (results && results.length > 1) ? results[1] : "";
	}
};
jsMocha.ExpectationList = function() {
	this.expectations = [];
}

jsMocha.ExpectationList.prototype = {

	add: function(expectation){
		this.expectations.push(expectation);
		return expectation;
	},
	verify_all: function(){
		var results = [];
		for(var i = 0; i < this.expectations.length; i++){
			results.push(this.expectations[i].verify());
		}
		return this.all_passed(results);
	},
	all_passed: function(array){
		for(var i=0; i < array.length; i++){
			if(array[i] === false){
				return false;
			}
		}
		return true;
	},
	reports: function(){
		var results = [];
		for(var i = 0; i < this.expectations.length; i++){
			results.push(this.expectations[i].report());
		}
		return "\r\n"+results.join("\r\n");
	},
	restore_all: function(){
		for(var i = 0; i < this.expectations.length; i++){
			this.expectations[i].restore();
		}
	}
};
Mock = function(object) {

	mock = object || {};

	if(this.already_mocked(mock)){
		return mock;
	}

	this.expectations = new jsMocha.ExpectationList();

	if(this.check_for_clashes(mock)){
		throw new Error("Cannot mock object, function names clash!!");
	}
	if( typeof(mock) == 'function' ) {
	  this.add_methods_to_object(mock);
    // throw new Error("Cannot mock something of type: " + typeof(mock));
	}
	else if( typeof(mock) == 'object') {
		this.add_methods_to_object(mock);
	}
	else {
		throw new Error("Cannot mock something of type: " + typeof(mock));
	}
	this.mock = mock;
	return mock;
}

Mock.prototype = {
	reservedNames: ['expects', 'stubs', 'jsmocha'],

	already_mocked: function(object) {
		return object.jsmocha ? true : false;
	},
	check_for_clashes: function(object) {
		for( property in object ){
			if(this.in_array(property, this.reservedNames)){
				return true;
			}
		}
	},
	in_array: function(subject, array){
  	for(var i = 0; i < array.length; i++){
  		if(subject == array[i]){
  			return true;
			}
		}
  	return false;
	},
	add_methods_to_object: function(object, stub) {
		object.jsmocha = this;
	  object.stubs = function(method_name){
			var expectation = new jsMocha.Expectation(this, method_name);
			expectation.at_least(0);
			this.jsmocha.expectations.add(expectation);
			return expectation;
		};
		object.expects = function(method_name){
			var expectation = new jsMocha.Expectation(this, method_name);
			this.jsmocha.expectations.add(expectation);
			return expectation;
		};
	},
	verify: function(){
		var result = this.expectations.verify_all();
		return result;
	},
	report: function(){
		var reports = this.expectations.reports();
		this.teardown(mock);
		return reports;
	},
	teardown: function(){
		this.expectations.restore_all();
		delete this.mock.expects;
		delete this.mock.stubs;
		delete this.mock.jsmocha;
	}
};
jsMocha.ParametersMatcher = function(expected_parameters) {
	this.expected_parameters = expected_parameters;
	this.serialize_stack_limit = 4;
	this.valid = false;
};

jsMocha.ParametersMatcher.prototype = {

	match: function(actual_parameters) {
	  this.actual_parameters = actual_parameters;
		if(this.block_given()){
		  this.valid = this.block(actual_parameters);
		  return this.valid;
		}
		else{
      return this.parameters_match(actual_parameters);
    }
  },
	parameters_match: function(actual_parameters) {
		for(var i = 0; i < this.expected_parameters.length; i++){
			if(actual_parameters[i] != this.expected_parameters[i]){
				this.valid = false;
				return false;
			}
		}
		this.valid = true;
		return true;
	},
	block_given: function() {
	  if(this.expected_parameters.length == 1 && this.is_function(this.expected_parameters[0])){
	    this.block = this.expected_parameters[0];
	    return true;
	  }
	  else{
	    return false;
	  }
	},
	is_function: function(o) {
	  return typeof o == 'function' || Object.prototype.toString.call(o) == '[object Function]' ? true : false;
	},
	report: function() {
		if(this.valid) {
			return true;
		}
		else{
		  var msg = '';
		  if(this.block_given()){
		    msg += "received (";
	    }
	    else{
			  msg += "expected (";
			  msg += this.list_parameters(this.expected_parameters);
			  msg += ") but got (";
		  }
			msg += this.list_parameters(this.actual_parameters);
      msg += ")";
			return msg;
		}
	},
	list_parameters: function(parameters) {
    if(parameters){
         var a = [];
         for(var i=0; i<parameters.length; i++){
           a.push(this.serialize(parameters[i], 0));
         }
         return a.join(', ');
        }
	},
	serialize: function(obj, recursion_level) {
	  if(recursion_level > this.serialize_stack_limit){
	    return 'object too complex to fully display';
    }
	  if(obj === null){return 'null';}
    switch (typeof obj){
      case 'number':
      case 'boolean':
      case 'function':
        return obj;

      case 'string':
        return '"' + obj + '"';

      case 'object':
        var str;
        if (typeof obj.toSource !== 'undefined' && typeof obj.callee === 'undefined'){
          str = obj.toSource();
          return str.substring(1,str.length-1);
        }
        else{
          var a = [];
          if (obj.constructor === Array || typeof obj.callee !== 'undefined'){
            for(var i = 0; i < obj.length-1; i++) { a.push(this.serialize(obj[i], (recursion_level+1))); }
            a.push(this.serialize(obj[i], (recursion_level+1)));
            str = '[' + a.join(', ') + ']';
          }
          else{
            for(var key in obj) {
              if (obj.hasOwnProperty(key)) {
                a.push(key + ':' + this.serialize(obj[key], (recursion_level+1)));
              }
            }
            str = '{' + a.join(', ').replace(/\,$/, '') + '}';
          }
          return str;
        }

      default:
        return 'UNKNOWN';
    }
  }
};
