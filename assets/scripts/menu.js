
var Menu=function(options) {
  this.items=[];
  this.open=false;

  this.isOpen=function() {
    return this.open;
  };
};

function menu_init() {
  prop.menu={};

  prop.menu.start=new Menu();
  prop.menu.start.open=true;

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
