
// for load.js

function canvas_pre() {
  prop.canvas={};

  prop.canvas.contexts={};

  // resize canvas to fit window?
  prop.canvas.resize=true;
  prop.canvas.scale=2;
  if($(window).width() < 400)
    prop.canvas.scale=1;
  prop.canvas.size={ // all canvases are the same size
    height:480,
    width:640
  };
  prop.canvas.dirty={};
}

// for game layers

function canvas_init() {
  canvas_add("background");
  canvas_add("menu");
  if(RELEASE == false)
    canvas_add("debug");
}

// sets scale, resizes to force redraw of all layers

function canvas_set_scale(scale) {
  prop.canvas.scale=scale;
//  canvas_resize();
}

// resizes, takes into account canvas scale

function canvas_resize(recurse) {
  if(prop.canvas.resize) {
    prop.canvas.size.width=$(window).width()/prop.canvas.scale;
    prop.canvas.size.height=$(window).height()/prop.canvas.scale;
  }
  for(var i in prop.canvas.contexts) {
    prop.canvas.contexts[i].canvas.height=prop.canvas.size.height*prop.canvas.scale;
    prop.canvas.contexts[i].canvas.width=prop.canvas.size.width*prop.canvas.scale;
  }
  canvas_dirty("*");
}

// marks <name> canvas as dirty; if <name> is ommitted or "*", marks all as dirty

function canvas_dirty(name) {
  if(name && name != "*") {
    prop.canvas.dirty[name]=true;
  } else {
    for(var i in prop.canvas.dirty)
      prop.canvas.dirty[i]=true;
  }
}

// cleans <name>

function canvas_clean(name) {
  if(name && name != "*") {
    prop.canvas.dirty[name]=false;
  } else {
    for(var i in prop.canvas.dirty)
      prop.canvas.dirty[i]=false;
  }
}

// adds a canvas to the canvas list

function canvas_add(name) {
  $("#canvases").append("<canvas id='"+name+"-canvas'></canvas>");
  prop.canvas.contexts[name]=$("#"+name+"-canvas").get(0).getContext("2d");
  canvas_dirty(name);
}

// adds a canvas and hides it

function canvas_add_offscreen(name) {
  canvas_add(name);
  $(prop.canvas.contexts[name].canvas).css("display","none");
}

// removes a canvas

function canvas_remove(name) {
  $("#"+name+"-canvas").remove();
  delete prop.canvas.contexts[name];
}

// returns a canvas context

function canvas_get(name) {
  return(prop.canvas.contexts[name]);
}

// clears the __VIRTUAL__ canvas (if scale is two, it will clear the upper left corner only.)

function canvas_clear(cc) {
  cc.clearRect(0,0,prop.canvas.size.width,prop.canvas.size.height);
  cc.webkitImageSmoothingEnabled=false;
  cc.mozImageSmoothingEnabled=false;
  cc.imageSmoothingEnabled=false;
}

// DRAW

// background (sky)

function canvas_draw_background(cc) {
  cc.fillStyle=prop.style.ui.fg;
  cc.fillRect(0,0,prop.canvas.size.width,prop.canvas.size.height);
}

// menu


function canvas_draw_menu(cc) {
  var menu;
  var font=prop.font.ui;
  if(menu_is_open())
    menu=menu_current();
  else
    return;
  cc.save();
  if(prop.game.mode != "start" && prop.game.paused)
    cc.globalAlpha=0.7;
  cc.fillStyle=prop.style.ui.bg;
  cc.fillRect(0,0,prop.canvas.size.width,prop.canvas.size.height);
  cc.restore();
  var width=text_width(cc,menu.title,align-pad,top,{
    font:prop.font.ui,
    style:"logo",
    size:1,
    align:"right baseline"
  });
  var align=Math.floor(width);

  var top=30;
  var pad=10;
  var compact=false;
  align+=pad*2;
  if(prop.canvas.size.width > 600) {
    align=Math.floor(prop.canvas.size.width/2-font.info.height*10);
  } else if(prop.canvas.size.width < 400) {
    compact=true;
    align=font.info.height;
  }
  var temp="right baseline";
  var temp2=-pad;
  if(compact) {
    temp="left baseline";
    temp2=pad;
  }
  text_draw(cc,menu.title,align+temp2,top,{
    font:font,
    style:"logo",
    size:1,
    align:temp
  });
  var items=menu.items;
  var line_height=Math.floor(font.info.line_height+6);
  temp=0;
  if(compact)
    temp=line_height;
  for(var i=0;i<items.length;i++) {
    var item=items[i];
    cc.save();
    cc.globalAlpha=crange(0,Math.abs(menu.selected-i),5,0.4,0.075);
    if(menu.selected == i) {
      cc.globalAlpha=1;
    }
    if(item.type() == "disabled") {
      cc.globalAlpha=clamp(0.2,cc.globalAlpha*0.4,1);
    }
    if(item.icon) {
      text_draw_icon(cc,item.icon,Math.floor(align+pad/2),top+(line_height*i)+temp,{
        font:font,
        style:"white",
        size:1,
        align:"right baseline"
      });
    }
    text_draw_button(cc,item.text,align+pad,top+(line_height*i)+temp,{
      selected:menu.selected==i,
      border:2,
      padding:3,
      font:font,
      style:"white",
      size:1,
      align:"left baseline"
    });
    if(item.type() == "function") {
      
    } else {

    }
    cc.restore();
  }
  canvas_clean("menu");
}

// debug overlay

function canvas_draw_debug(cc) {
  var pad=3;
  // version
  text_draw(cc,prop.version_string,prop.canvas.size.width-pad,pad,{
    font:prop.font.ui,
    style:"white",
    size:1,
    align:"right top"
  });
  // fps
  text_draw(cc,Math.floor(prop.time.fps).toString()+" fps",
            prop.canvas.size.width-pad,prop.canvas.size.height-pad,{
    font:prop.font.ui,
    style:"white",
    size:1,
    align:"right baseline"
  });
  // frame spacing
  text_draw(cc,Math.floor(prop.time.frame.delta*1000).toString()+"ms",
            pad,prop.canvas.size.height-pad,{
    font:prop.font.ui,
    style:"white",
    size:1,
    align:"left baseline"
  });
}

// UPDATE (decides whether or not to draw)

// background

function canvas_update_background() {
  var cc=canvas_get("background");
  cc.save();
  cc.scale(prop.canvas.scale,prop.canvas.scale);
//  canvas_clear(cc);
  canvas_draw_background(cc);
  cc.restore();
  canvas_clean("background");
}

// menu

function canvas_update_menu() {
  var cc=canvas_get("menu");
  cc.save();
  cc.scale(prop.canvas.scale,prop.canvas.scale);
  canvas_clear(cc);
  canvas_draw_menu(cc);
  cc.restore();
}

// debug

function canvas_update_debug() {
  if(RELEASE)
    return;
  var cc=canvas_get("debug");
  cc.save();
  cc.scale(prop.canvas.scale,prop.canvas.scale);
  canvas_clear(cc);
  canvas_draw_debug(cc);
  canvas_clean("debug");
  cc.restore();
}

// root, called by modules

function canvas_update() {
//  canvas_set_scale(trange(-1,Math.sin(time()*4),1,1,3));
  if(prop.canvas.dirty["background"])
    canvas_update_background();
  if(prop.canvas.dirty["menu"])
    canvas_update_menu();
  if(RELEASE == false) {
    if(prop.time.frames % 10 == 0)
      canvas_dirty("debug");
    if(prop.canvas.dirty["debug"])
      canvas_update_debug();
  }
}
