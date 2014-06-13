
var MenuItem=function(options) {
  this.text=""; // printed name
  this.icon=null;
  this.action=null; // function for call, Menu for submenu, string for property
  this.prop_type=null;
  this.prop_true_text="true";
  this.prop_false_text="false";
  this.close=true;
  this.gap=false;
  
  if(options) {
    if("text" in options) this.text=options.text;
    if("icon" in options) this.icon=options.icon;
    if("action" in options) this.action=options.action;
    if("gap" in options) this.gap=options.gap;
    if("close" in options) this.close=options.close;
    if("prop_type" in options) this.prop_type=options.prop_type;
    if("style" in options) {
      var s=options.style.split("/");
      this.prop_true_text=s[0];
      this.prop_false_text=s[1];
    }
  }

  this.type=function() {
    if(typeof this.action == typeof function(){}) {
      return "function";
    } else if(typeof this.action == typeof "") {
      return "prop";
    } else if(this.action == null) {
      return "disabled";
    } else {
      return "menu";
    }
  };

  this.select=function() {
    if(this.type() == "function") {
      this.action();
      if(this.close)
        menu_close("*");
    } else if(this.type() == "prop") {
      if(this.prop_type == "toggle")
        prop_set(this.action,!prop_get(this.action));
    } else if(this.type() == "disabled") {
      return null;
    } else {
      return this.action; // submenu
    }
    return null;
  };

};

var Menu=function(options) {
  this.title="";
  this.items=[];
  this.selected=0;
  this.nested=false; // if we're currently in a submenu, nested == true
  this.open=false;
  this.root=false;
  this.save_position=true;
  this.back=true;

  if(options) {
    if("title" in options) this.title=options.title;
    if("open" in options) this.open=options.open;
    if("items" in options) this.items=options.items;
    if("root" in options) this.root=options.root;
    if("save_position" in options) this.save_position=options.save_position;
    if("back" in options) this.back=options.back;
  }

  this.close=function() {
    if(this.nested)
      this.items[this.selected].action.close();
    this.nested=false;
    this.open=false;
    if(!this.save_position)
      this.selected=0;
  };

  if(!this.root && this.back == true) {
    this.items.push(new MenuItem({
      text:"Back",
      icon:"back",
      close:false,
      gap:true,
      action:menu_back
    }));
  }

  this.clampSelected=function() {
    var loop=false;
    if(loop)
      this.selected=mod(this.selected,this.items.length);
    else
      this.selected=clamp(0,this.selected,this.items.length-1);
  };

  this.move=function(direction) {
    if(this.nested) {
      this.items[this.selected].action.move(direction);
    } else {
      this.selected+=direction;
      this.clampSelected();
    }
  };

  this.back=function() {
    if(this.nested == false) { // we're in the end of the submenu chain
      if(!this.save_position)
        this.selected=0;
      return true;
    } else {
      if(this.items[this.selected].action.back() == true) {
        this.nested=false;
      }
    }
    return false;
  };

  this.isOpen=function() {
    return this.open;
  };

  this.select=function() {
    this.clampSelected();
    if(this.items[this.selected].select()) {
      this.nested=true;
    }
  };

  this.getCurrentMenu=function() {
    if(!this.nested)
      return this;
    else
      return this.items[this.selected].action.getCurrentMenu(); // go down the rabbit hole
  };

};

function menu_init() {
  prop.menu={};

  prop.menu.settings=new Menu({
    title:"Settings",
    items:[
      new MenuItem({
        text:"Music",
        style:"on/off",
        prop_type:"toggle",
        action:"prop.music.enabled"
      }),
    ]
  });

  prop.menu.pause=new Menu({
    title:"Paused",
    save_position:false,
    root:true,
    items:[
      new MenuItem({
        text:"Resume",
        icon:"play",
        action:game_unpause
      }),
      new MenuItem({
        text:"Save",
        icon:"saved",
        action:new Menu({
          title:"Save in slot",
          items:[
            new MenuItem({
              text:"Not implemented yet..."
            })
          ]
        })
      }),
      new MenuItem({
        text:"Settings",
        icon:"settings",
        action:prop.menu.settings
      }),
      new MenuItem({
        text:"End game",
        icon:"no",
        action:new Menu({
          title:"Really end game?",
          save_position:false,
          back:false,
          items:[
            new MenuItem({
              text:"No",
              icon:"no",
              close:false,
              action:menu_back
            }),
            new MenuItem({
              text:"Yes",
              icon:"yes",
              action:game_end
            })
          ]
        })
      }),
    ]
  });

  prop.menu.saved_games=new Menu({
    title:"Saved games",
    items:[
      new MenuItem({
        text:"Not implemented yet..."
      })
    ]
  });

  prop.menu.start=new Menu({
    title:"Neptune",
    root:true,
    items:[
      new MenuItem({
        text:"Play",
        icon:"play",
        action:game_start
      }),
      new MenuItem({
        text:"Saved games",
        icon:"saved",
        action:prop.menu.saved_games
      }),
      new MenuItem({
        text:"Settings",
        icon:"settings",
        action:prop.menu.settings
      }),
      new MenuItem({
        text:"Help",
        icon:"help",
        action:new Menu({
          title:"Help",
          items:[
            new MenuItem({
              text:"Don't let Neptune die.",
            }),
            new MenuItem({
              text:"Avoid Minerva's henchmen.",
            }),
            new MenuItem({
              text:"Good luck.",
            }),
          ]
        })
      }),
      new MenuItem({
        text:"Credits",
        icon:"credits",
        action:new Menu({
          title:"Credits",
          items:[
            new MenuItem({
              text:"Music by Evan Pattison",
              icon:"music"
            }),
            new MenuItem({
              text:"Software and art by Jon Ross",
              icon:"software"
            }),
          ]
        })
      }),
    ]
  });

}

function menu_current() { // returns the TOPMOST menu.
  if(game_mode() == "start")
    return prop.menu.start.getCurrentMenu();
  else if(game_paused())
    return prop.menu.pause.getCurrentMenu();
}

function menu_back() {
  var end;
  if(game_mode() == "start")
    end=prop.menu.start.back();
  else if(game_paused())
    end=prop.menu.pause.back();
  if(end)
    menu_close("*");
  canvas_dirty("menu");
}

function menu_close(name) {
  if(!name || name == "*") {
    prop.menu.start.close();
    prop.menu.pause.close();
  }
  if(game_mode() == "start")
    prop.menu.start.open=true;
  else if(game_paused())
    game_unpause();
  canvas_dirty("menu");
}

function menu_move(direction) {
  menu_current().move(direction);
  canvas_dirty("menu");
}

function menu_select() {
  menu_current().select();
  canvas_dirty("menu");
}

function menu_is_open(name) {
  if(!name || name == "*") {
    for(var i in prop.menu) {
      if(menu_is_open(i))
        return true;
    }
  } else {
    if(name == "start") {
      if(game_mode() == "start")
        return true;
      return false;
    }
    if(name == "pause") {
      if(game_paused())
        return true;
      return false;
    }
  }
}
