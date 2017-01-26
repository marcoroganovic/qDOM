(function(global) {

  // it returns an object with DOM elements (if any) and length property
  function dom(sel) {
    if(!(this instanceof dom)) {
      return new dom(sel);
    }

    var nodes = Array.from(document.querySelectorAll(sel));
    nodes.forEach(function(node, i, arr) {
      this[i] = node;
    }.bind(this));

    this.length = nodes.length;
  }

  function extend(target, obj) {
    for(var prop in obj) {
      if(obj.hasOwnProperty(prop)) {
        target[prop] = obj[prop];
      }
    }
  }

  global.dom = dom;

})(this);
