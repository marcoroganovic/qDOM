(function(global) {

  function dom(sel) {
    if(!(sel instanceof this)) {
      return new dom(sel);
    }

    var elements = document.querySelectorAll(sel);
    Array.prototype.push.call(this, elements);
  }

})(this);
