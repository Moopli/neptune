
// for load.js

function canvas_pre() {
  prop.canvas={};

  prop.canvas.contexts={};

  // resize canvas to fit window?
  prop.canvas.resize=true;
  prop.canvas.scale=2;
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
  canvas_resize();
}

// resizes, takes into account canvas scale

function canvas_resize() {
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
  cc.fillStyle=prop.style.ui.bg;
  cc.fillRect(0,0,prop.canvas.size.width,prop.canvas.size.height);
}

// menu

function canvas_draw_menu(cc) {
  cc.fillStyle=prop.style.ui.bg;
  cc.fillRect(0,0,prop.canvas.size.width,prop.canvas.size.height);
  var middle=Math.floor(prop.canvas.size.width/2);
  text_draw_button(cc,"NEPTUNE",middle,20,{
    selected:true,
    padding:3,
    font:prop.font.ui,
    style:"white",
    size:2,
    align:"center top"
  });
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
  prop.canvas.dirty["background"]=false;
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
  prop.canvas.dirty["debug"]=false;
  cc.restore();
}

// root, called by modules

function canvas_update() {
//  canvas_set_scale(trange(-1,Math.sin(time()*4),1,1,3));
  if(prop.canvas.dirty["background"])
    canvas_update_background();
  if(prop.canvas.dirty["menu"])
    canvas_update_menu();
  if(!RELEASE) {
    if(prop.time.frames % 10 == 0)
      canvas_dirty("debug");
    if(prop.canvas.dirty["debug"])
      canvas_update_debug();
  }
}
