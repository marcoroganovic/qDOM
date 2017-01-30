(function(global) {

  // it returns an object with DOM elements (if any) and length property
  function dom(sel, ctx) {
    if(!(this instanceof dom)) {
      return new dom(sel);
    }

    var nodes = isNode(sel) ? [sel] : 
                Array.isArray(sel) ? sel :
                (ctx || document).querySelectorAll(sel);

    nodes.forEach(function(node, i, arr) {
      if(isNode(node)) {
        this[i] = node;
      }
    }.bind(this));

    this.length = nodes.length;
  }


  function isString(arg) {
    return typeof arg === "string";
  }

  function isNumber(arg) {
    return typeof arg === "number";
  }

  function isObject(arg) {
    return typeof arg === "object";
  }

  function isFunction(arg) {
    return typeof arg === "function";
  }

  function isNode(arg) {
    return arg && arg.nodeType && (arg.nodeType === 1 || arg.nodeType === 11);
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


  function dimension(els, prop, val) {
    if(val) {
      eachElement(els, function(el) {
        el.style[prop] = isNumber(val) ? val + "px" : val;
      });
      return els;
    } else {
      return firstElement(els)["style"][prop];
    }
  }  
  
  
  var fnMethods = {
    find: dom,
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
    },

    extend: extend,
    isNode: isNode
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

    first: function() {
      return dom(this[0]);
    },

    last: function() {
      return dom(this[this.length - 1]);
    },

    parent: function() {
      return firstElement(this)["parentElement"];
    },

    children: function() {
      var els = Array.from(this[0].childNodes);
      els = els.filter(function(el) {
        return isNode(el) ? dom(el) : false;
      });
      return els;
    },

    on: function(type, del, callback) {
      if(arguments.length >= 3 && isString(del)) {
        eachElement(this, function(el) {
          el.addEventListener(type, function(e) {
            var el = e.target;
            if(el.nodeName.toLowerCase() === del.toLowerCase()) {
              callback.call(el, e);
            }
          });
        });
      } else {
        callback = del;
        eachElement(this, function(el) {
          el.addEventListener(type, function(e) {
            callback.call(this, e);
          });
        });
      }
    },

    find: function(sel) {
      var els = [];
      eachElement(this, function(el) {
        var nodes = dom(sel, this);
        eachElement(nodes, function(el) {
          els.push(el);
        });
      });
      return dom(els);
    },


    width: function(amount) {
      return amount ? dimension(this, "width", amount) 
                    : dimension(this, "width");
    },

    height: function(amount) {
      return amount ? dimension(this, "height", amount) 
                    : dimension(this, "height");
    },

    show: function() {
      eachElement(this, function(el) {
        var val = window.getComputedStyle(el).getPropertyValue("display");
        el.style.display = val !== "none" ? val : "block";
      });
      return this;
    },

    hide: function() {
      eachElement(this, function(el) {
        el.style.display = "none";
      });
      return this;
    }

  };

  extend(dom, fnMethods);
  extend(dom.prototype, protoMethods);

  global.dom = dom;

})(this);
