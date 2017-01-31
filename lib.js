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

  function prevOrNext(type) {
    return function() {
      var els = [];
      eachElement(this, function(el) {
        var curr = el[type];
        if(curr) {
          els.push(curr);
        }
      });

      return dom(els);
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

  function manipulateClass(type) {
    return function(className) {
      if(className && isString(className)) {
        eachElement(this, function(el) {
          el.classList[type](className);
        }); 
      }
      return this;
    }
  }

  function isStringSetter(args) {
    return args.length === 2 && isString(args[0]) && isString(args[1]);
  }

  function isObjectSetter(args) {
    return args.length === 1 && isObject(args[0]);
  }

  function isStringGetter(args) {
    return args.length === 1 && isString(args[0]);
  }
  
  
  var staticMethods = {
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
    isNode: isNode,
    fn: dom.prototype
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
      if(isStringSetter(args)) {
        eachElement(this, function(el) {
          el["style"][args[0]] = args[1];
        });
      } else if(isObjectSetter(args)) {
        eachElement(this, function(el) {
          for(var prop in args[0]) {
            el["style"][prop] = args[0][prop];
          }
        });
      } else if(isStringGetter(args)) {
        return firstElement(this)["style"][args[0]]
      }

      return this;
    },

    text: function(content) {
      if(content && isString(content)) {
        eachElement(this, function(el) {
          el.textContent = content;
        });
      } else {
        return firstElement(this)["textContent"];
      }

      return this;
    },

    get: function() {
      var els = [];
      eachElement(this, function(el) {
        els.push(el);
      });
      return els;
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
      return dom(els);
    },

    prev: prevOrNext("previousElementSibling"),

    next: prevOrNext("nextElementSibling"),

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
    },

    attr: function() {
      var args = arguments;
      if(isStringSetter(args)) {
        eachElement(this, function(el) {
          el.setAttribute(args[0], args[1]);
        });
      } else if(isObjectSetter(args)) {
        eachElement(this, function(el) {
          for(var attr in args[0]) {
            if(args[0].hasOwnProperty(attr)) {
              el.setAttribute(attr, args[0][attr]);
            }
          }
        });
      } else if(isStringGetter(args)) {
        return firstElement(this).getAttribute(arguments[0]);
      }

      return this;
    },

    data: function() {
      var args = arguments;
      if(isStringSetter(args)) {
        this.attr("data-" + args[0], args[1]);
      } else if(isObjectSetter(args)) {
        var prefixed = {};
        for(var attr in args[0]) {
          if(args[0].hasOwnProperty(attr)) {
            prefixed["data-" + attr] = args[0][attr];
          }
        }
        this.attr(prefixed);
      } else if(isStringGetter(args)) {
        return firstElement(this).dataset[args[0]];
      }
      
      return this;
    },

    remove: function() {
      eachElement(this, function(el) {
        el.remove();
      });
      return this;
    },

    addClass: manipulateClass("add"),
    
    removeClass: manipulateClass("remove"),
    
    toggleClass: manipulateClass("toggle")
  };

  extend(dom, staticMethods);
  extend(dom.prototype, protoMethods);

  global.dom = dom;

})(this);
