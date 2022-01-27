/* Utilities */
/*** Element selection à la jQuery ***/
var $ = function(q) { return document.querySelector(q); }
var $$ = function(q) { return document.querySelectorAll(q); }

let Memory = function() {
  // This variable holds all saved data in memory
  let data = JSON.parse(localStorage.getItem("grid-data")) || {};
  let lookup = function(key) {
    return data[key];
  };
  let generateExportLink = function() {
    let exportbutton = $("#export");
    var jsonse = JSON.stringify(data);
    
    var blob = new Blob([jsonse], {type: "application/json"});
    var url = URL.createObjectURL(blob);
    exportbutton.href = url;
    exportbutton.download = "grid_backup.json";
  }
  let save = function() {
    localStorage.setItem("grid-data", JSON.stringify(data));
    generateExportLink()
  }
  let store = function(key, value) {
    data[key] = value;
    save();
  };
  let remove = function(key) {
    delete data[key];
    save();
  }
  return function(key, value=null) {
    if (value !== null) {
      if (value === "") {
        remove(key);
      } else {
        store(key, value);
      }
    }
    
    return lookup(key);
  }
}

var _ = Memory();

let importMemory = function(data) {
  localStorage.setItem("grid-data", data);
  _ = Memory();
  grid.load();
}

let importFromFile = function() {
  let file = $("#import-file").files
  if (file.length == 0) {
    alert("No se seleccionó ningún archivo.");
  } else if (confirm("Se borrarán todos los enlaces actuales y se importarán los contenidos del archivo. ¿Continuar?")) {
    file = file[0];
    let reader = new FileReader();
    reader.onload = (e) => {
      const contents = e.target.result;
      importMemory(contents);
    }
    reader.onerror = (e) => alert(e.target.error.name);
    reader.readAsText(file);
  }
}

window.addEventListener("load", function() {
  $("#import-file").onchange = importFromFile;
})

/* Date and time */
var dateAndTime = (function() {
  // display time
  let specialDate = function() { // remove for generic version
    var time = new Date();
    return (time.getDate() == 29 && time.getMonth() == 4) ||
    (time.getDay() == 0 && time.getDate() < 8 && time.getMonth() == 4);
  }
  var displayTime = function() {
    var time = new Date();
    var hour = time.getHours() < 10 ? '0'+time.getHours() : time.getHours();
    var mins = time.getMinutes() < 10 ? '0'+time.getMinutes() : time.getMinutes();
    $('.clock').textContent = `${hour}:${mins}`;
  };

  var displayDate = function() {
    // display date
    var time = new Date();
    var days = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
    var months = ["enero", "febrero", "marzo", 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    $('.date').textContent = `${days[time.getDay()]}, ${time.getDate()} de ${months[time.getMonth()]} ${time.getFullYear()}`;
  }

  return function() {
    displayTime();
    displayDate();
    
    var clockint = setInterval(displayTime, 1000);
       
    if (specialDate()) {
      $(".message").textContent = "Felicidades!!! :)";
    }
  }
})();

window.addEventListener("load", dateAndTime);

/* Touch and scroll */
// document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

var grid = {
  itemsize: 5,
  load: function(force) {
    if (_("genhtml") && !force) {
      $("#scrollable").innerHTML = _("genhtml");
    } else {
      $("#scrollable").innerHTML = "";
      var ncols = _("customcols") ? parseInt(_("customcols")) : 40;
      var nrows = _("customrows") ? parseInt(_("customrows")) : 12;
      
      $('#scrollable').style.width = (ncols*(grid.itemsize+1.5))+'rem';
      $('#scrollable').style.height = (nrows*(grid.itemsize+1.5)+1.5)+'rem';

      for (var i=0; i<nrows; i++) {
        for (var j = 0; j<ncols; j++) {
          var e = document.createElement('a');
          e.setAttribute("data-row", i);
          e.setAttribute("data-col", j);
          if (!_("item"+i+'_'+j)) {
            e.className = `empty item row${i} col${j}`;
          } else {
            e.className = `used item row${i} col${j}`;
            var a = _(`item${i}_${j}`);
            for (x in a) {
              e[x] = a[x];
            }
            e.target = "_top";
            if (a.href && (!a.style || !a.style.backgroundImage))
            try {
              // a.style.backgroundImage = 'url('+a.href.split('://')[0] + "://" + a.href.split('://')[1].split('/')[0] + "/favicon.ico)";
              a.style.backgroundImage = `url("https://s2.googleusercontent.com/s2/favicons?domain=${a.href.split('://')[1].split('/')[0]}")`;
            } catch(e) {}
            if (a.style && a.style.backgroundImage)
            e.style.backgroundImage = a.style.backgroundImage;
            
            //if (a.href) e.style.backgroundImage = 'url(http://grabicon.com/'+ a.href.split('://')[1].split('/')[0]+'.png)';
            
            if (!_(`item${i-1}_${j}`)) {
              e.className += " topborder";
            }
            if (!_(`item${i}_${j-1}`)) {
              e.className += " leftborder";
            }
            if (!_(`item${i+1}_${j}`)) {
              e.className += " bottomborder";
            }
            if (!_(`item${i}_${j+1}`)) {
              e.className += " rightborder";
            }

          }
          $('#scrollable').appendChild(e);
        }
      }
      grid.position();
      
      _("genhtml", $("#scrollable").innerHTML)
    }
    grid.setEvents();
    
    window.myScroll = new IScroll('#wrapper', {
      scrollX: true, 
      scrollY: true, 
      scrollbars: true, 
      fadeScrollbars: true, 
      shrinkScrollbars: 'clip', 
      freeScroll: true,//,
      mouseWheel: true
      // click: true
    });
  },
  position: function() {
    var topmargin = 1.5;
    var leftmargin = 0;
    var horspacing = 1.5; // Margin = 0.1, padding = 2*0.7
    var verspacing = 1.5;
    var allitems = $$('.item');
    for (var i in allitems) {
      var e = allitems[i];
      try {
        var row = e.getAttribute("data-row");
        var col = e.getAttribute("data-col");
        e.style.left = (col*grid.itemsize+col*horspacing+leftmargin)+'rem';
        e.style.top = (row*grid.itemsize+row*verspacing+topmargin)+'rem';
      } catch (e) {}
    }
  },
  setEvents: function() {
    let items = $$(".item")
    for (var i in items) {
      try {
        items[i].oncontextmenu = function(event) { 
          event.preventDefault();
          var i = parseInt(this.getAttribute("data-row"));
          var j = parseInt(this.getAttribute("data-col"));
          config.showItemDialog(i, j);
          return false; 
        };
        // var hammertime = Hammer(items[i]).on("hold", function(event) {
        //   event.preventDefault();
        //   var i = parseInt(this.getAttribute("data-row"));
        //   var j = parseInt(this.getAttribute("data-col"));
        //   config.showItemDialog(i, j);
        // });
      } catch(e) {}
    }
  }
};
window.addEventListener("load", grid.load);

var config = {
  showItemDialog: function (i, j) {
    var content = "";
    var lskey = "item"+i+"_"+j;
    if (_(lskey)) {
      var v = _(lskey);
      $("#item-title").value = $("#item-link-name").value = v.textContent;
      $("#item-link-url").value = v.href ? v.href : "";
      
      if (v.className.indexOf("group") > -1)
      $("#item-type-title").checked = "checked";
      else
      $("#item-type-link").checked = "checked";
    } else {
      $("#item-type-empty").checked = "checked";
      $("#item-link-name").value = $("#item-link-url").value = $("#item-title").value = "";
    }
    
    $("#item_settings").onchange = function() {
      console.log("onchange");
      var item = {
        className : "",
        href : "",
        textContent : "",
        style: {}
      };
      
      if ($("#item-type-link").checked) {
        console.log("link");
        item.className = 'used item row'+i+' col'+j;
        item.href = $("#item-link-url").value;
        item.textContent = $("#item-link-name").value;
        
        // if ($("#item-link-favicon").value.length > 0) {
        //   item.style = {};
        //   item.style.backgroundImage = "url(\"" + $("#item-link-favicon").value + "\")";
        // }
        
        item.href = (item.href.indexOf("://") > -1 ? "" : "http://") + item.href;
        _(lskey, item);
      } else if ($("#item-type-title").checked) {
        item.className = 'used item group row'+i+' col'+j;
        delete item.href;
        item.textContent = $("#item-title").value;
        _(lskey, item);
      } else if ($("#item-type-empty").checked) {
        _(`item${i}_${j}`, "");
        config.closeDialogs();
      }
    };
    
    $(".config-back").className += " visible";
    $("#dialog-item").style.top = `${i * 6.5 + 1.5 - 1}rem`;
    $("#dialog-item").style.left = `${j * 6.5 - 1}rem`;
    $("#dialog-item").style.transform = $("#scrollable").style.transform;
    $("#dialog-item").className += " visible";
  },
  closeDialogs: function() {
    $("#dialog-item").className = $("#dialog-item").className.replace("visible", "");
    $(".config-back").className = $(".config-back").className.replace("visible", "");
    grid.load(true);
    $(".search input[type='search']").focus();
    return false;
  }
}

window.addEventListener("load", function() {
  $("#dialog-item").oncontextmenu = function(event) { 
    event.preventDefault();
    return false;
  }
  for (var c in $$(".close-dialog")) {
    try {
      $$(".close-dialog")[c].addEventListener("click", config.closeDialogs);
    } catch(e) {}
  }
});

var initialsetup = {
  "item1_1": {
    "className": "used item row1 col1", 
    "href": "https://www.powerlanguage.co.uk/wordle/",
    "textContent": "Wordle",
    "style": {}
  }
}
if (!_("initialsetup")) {
  localStorage.setItem("grid-data", JSON.stringify(initialsetup));
  _ = Memory();
  _("initialsetup", true);
  grid.load(true);
}