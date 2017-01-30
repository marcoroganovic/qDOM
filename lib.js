(function(global) {

  // it returns an object with DOM elements (if any) and length property
  function dom(sel, ctx) {
    if(!(this instanceof dom)) {
      return new dom(sel);
    }

    var nodes = Array.from((ctx || document).querySelectorAll(sel));
    nodes.forEach(function(node, i, arr) {
      this[i] = node;
    }.bind(this));

    this.length = nodes.length;
  }


  function isString(arg) {
    return typeof arg === "string";
  }

  function isObject(arg) {
    return typeof arg === "object";
  }

  function isFunction(arg) {
    return typeof arg === "function";
  }

  function extend(target, obj) {
    for(var prop in obj) {
      if(obj.hasOwnProperty(prop)) {
        target[prop] = obj[prop];
      }
    }
  }

  function eachElement(els, fn) {
    if(els.length) {
      for(var i = 0; i < els.length; i++) {
        fn.call(els, els[i]);
      }
    }
  }

  function firstElement(els) {
    if(els[0]) {
      return els[0];
    }
  }

  var fnMethods = {
    each: function(iteratee, fn) {
      if(isObject(iteratee)) {
        for(var prop in iteratee) {
          fn.call(iteratee, prop, iteratee[prop]);
        }
      } else if(Array.isArray(iteratee)) {
        iteratee.forEach(function(item, i) {
          fn(i, item);
        });
      }
    }
  }

  var protoMethods = {

    html: function(content) {
      if(content && isString(content)) {
        eachElement(this, function(el) {
          el.innerHTML = content;
        });
        return this;
      } else {
        return firstElement(this)["innerHTML"];
      }
    },

    css: function() {
      var args = arguments;
      if(args.length && args.length === 1 && isString(args[0])) {
        return firstElement(this)["style"][args[0]];
      } else if(args.length && args.length === 2) {
        eachElement(this, function(el) {
          el["style"][args[0]] = args[1];
        });
        return this;
      } else if(args.length === 1 && isObject(args[0])) {
        for(var attr in args[0]) {
          eachElement(this, function(el) {
            el["style"][attr] = args[0][attr];
          });
        }
        return this;
      }
    },

    text: function(content) {
      if(content && isString(content)) {
        eachElement(this, function(el) {
          el.textContent = content;
        });
        return this;
      } else {
        return firstElement(this)["textContent"];
      }
    },

    parent: function() {
      return firstElement(this)["parentElement"];
    }
  };

  extend(dom, fnMethods);
  extend(dom.prototype, protoMethods);

  global.dom = dom;


})(this);
