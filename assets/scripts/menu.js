
var MenuItem=function(options) {
  this.text=""; // printed name
  this.icon=null;
  this.action=null; // function for call, Menu for submenu
  
  if(options) {
    if("text" in options) this.text=options.text;
    if("icon" in options) this.icon=options.icon;
    if("action" in options) this.action=options.action;
  }

  this.type=function() {
    if(typeof this.action == typeof function(){}) {
      return "function";
    } else {
      return "menu";
    }
  };

  this.select=function() {
    if(this.type() == "function") {
      this.action()
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

  if(options) {
    if("title" in options) this.title=options.title;
    if("open" in options) this.open=options.open;
    if("items" in options) this.items=options.items;
  }

  this.clampSelected=function() {
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

  this.isOpen=function() {
    return this.open;
  };

  this.select=function() {
    this.clampSelected();
    var x=this.items[this.selected].select();
    if(x) {
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

  prop.menu.start=new Menu({
    title:"Neptune",
    open:true,
    items:[
      new MenuItem({
        text:"Play",
        icon:"play",
        action:game_start
      }),
      new MenuItem({
        text:"Saved games",
        icon:"saved",
        action:game_start
      }),
      new MenuItem({
        text:"Settings",
        icon:"settings",
        action:game_start
      }),
      new MenuItem({
        text:"Help",
        icon:"?",
        action:game_start
      }),
      new MenuItem({
        text:"Credits",
        icon:"credits",
        action:game_start
      }),
    ]
  });
  prop.menu.start.open=true;

}

function menu_current() { // returns the TOPMOST menu.
  if(menu_is_open("start"))
    return prop.menu.start.getCurrentMenu();
}

function menu_move(direction) {
  menu_current().move(direction);
  canvas_dirty("menu");
}

function menu_is_open(name) {
  if(!name || name == "*") {
    for(var i in prop.menu) {
      if(prop.menu[i].isOpen())
        return true;
    }
  } else {
    if(prop.menu[name].isOpen())
      return true;
  }
}
