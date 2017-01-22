(function(global) {
 
  // small templating
  function parseHTML(template, data) {
    var partOne = "{{\\s*?";
    var partTwo = "\\s*?}}";
    var re;

    for(var prop of data) {
      re = new RegExp(partOne +  prop + partTwo, "g");
      template = template.replace(re, data[prop]);
    }

    return template;
  }

  // event delegation
  function delegate(obj) {
    obj.el.addEventListener(obj.type, function(e) {
      e.preventDefault();
      var nodeName = e.target.nodeName.toLowerCase();

      if(nodeName === obj.to.toLowerCase()) {
        obj.callback.call(e.target, e);
      }
    });
  }

  // delegate({
    // el: $list,
    // event: "click",
    // to: "li",
    // callback: function(e) {
    //   console.log(this);
    // }
  // });

  var utils = {
    parseHTML: parseHTML,
    delegate: delegate
  }

  global.dom =  utils

})(this);
