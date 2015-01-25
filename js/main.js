/*window.addEventListener("load", function () {
  "use strict";
  
  var el = document.querySelector(".grid-main");
  
  var hammer = new Hammer(el, {touchAction: 'pan-x'});
  
  hammer.get("pan").set({ enable: true, direction: Hammer.DIRECTION_ALL });
  
  hammer.on("panleft panright", function (ev) {
    //el.textContent = ev.type;
    console.log(ev.deltaX + " " + ev.deltaY);
    
    el.style.top = el.style.top + ev.deltaY;
    el.style.left = el.style.left + ev.deltaX;
  });
});*/

var setOuterGridDimensions = function (e, w, h) {
  "use strict";
  
  var screenw = Math.max(
    document.documentElement.clientWidth,
    window.innerWidth || 0
  ),
    screenh = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    ); // Thanks StackOverflow
  
  // Geometry!
  e.style.width = (2 * w - screenw) + "px";
  e.style.height = (2 * h - screenh) + "px";
  
  // These should be negative
  e.style.top = "0";
  //e.style.top = Math.min(screenh - h, 0) + "px";
  e.style.left = Math.min(screenw - w, 0) + "px";
};

window.addEventListener("load", function () {
  "use strict";
  
  setOuterGridDimensions(document.querySelector(".grid-main-outer"), 2000, 1500);
  
  
  interact(".grid-main-inner")
    .draggable({
      inertia: true,
      maxPerElement: Infinity,
      restrict: {
        restriction: ".grid-main-outer",
        elementRect: { left: 0, top: 0, right: 1, bottom: 1 },
        endOnly: true
      },
    
      onmove: function (event) {
        // move function based on the example in interactjs.io
        
        var target = event.target,
          x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
          y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
        
        target.style.webkitTransform =
          target.style.transform =
            'translate(' + x + 'px, ' + y + 'px)';
        
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
      }
    });
});
