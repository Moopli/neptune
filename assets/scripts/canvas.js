
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
  canvas_add("map");
  canvas_add("menu");
  canvas_add("level");
  if(RELEASE == false)
    canvas_add("debug");
}

// sets scale, resizes to force redraw of all layers

function canvas_set_scale(scale) {
  prop.canvas.scale=scale;
  canvas_resize();
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
  canvas_remove(name);
  $("#canvases").append("<canvas id='"+name+"-canvas'></canvas>");
  prop.canvas.contexts[name]=$("#"+name+"-canvas").get(0).getContext("2d");
  canvas_dirty(name);
  return prop.canvas.contexts[name];
}

// adds a canvas and hides it

function canvas_add_offscreen(name) {
  var cc=canvas_add(name);
  $(prop.canvas.contexts[name].canvas).css("display","none");
  return cc;
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
  cc.clearRect(0,0,cc.canvas.width,cc.canvas.height);
  cc.webkitImageSmoothingEnabled=false;
  cc.mozImageSmoothingEnabled=false;
  cc.imageSmoothingEnabled=false;
}

// DRAW

// background (sky)

function canvas_draw_background(cc) {
  cc.fillStyle=prop.style.sky;
  cc.fillRect(0,0,prop.canvas.size.width,prop.canvas.size.height);
}

// map

function canvas_draw_map(cc) {
  if(game_mode() != "game")
    return;
  var map=map_current();
  var bs=prop.map.block.size;
  cc.drawImage(map.canvas.canvas,(map.bounds[0]-1)*bs,(map.bounds[1]-1)*bs);
//  cc.drawImage(map.canvas.canvas,-bs*2,-bs*2);
  return;
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
  if(game_mode() != "start" && game_paused())
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
  var align=floor(width);

  var top=30;
  var pad=10;
  var compact=false;
  align+=pad*2;
  if(prop.canvas.size.width > 600) {
    align=floor(prop.canvas.size.width/2-font.info.height*10);
  } else if(prop.canvas.size.width < 400) {
    compact=true;
    align=font.info.height;
  }
  var temp="right baseline";
  var temp2=-pad;
  var items=menu.items;
  var line_height=floor(font.info.line_height+6);
  if(compact) {
    temp="left baseline";
    temp2=pad;
  }
  var temp3=top;
  if(line_height*items.length+top+pad*2 > prop.canvas.size.height) {
    top-=floor(line_height*menu.selected);
    if(compact) {
      temp3=top;
    }
  }
  text_draw(cc,menu.title,align+temp2,temp3,{
    font:font,
    style:"logo",
    size:1,
    align:temp
  });
  temp=0;
  if(compact)
    temp=line_height;
  top+=temp;
  for(var i=0;i<items.length;i++) {
    var item=items[i];
    cc.save();
    cc.globalAlpha=crange(0,Math.abs(menu.selected-i),5,0.5,0.3);
    if(menu.selected == i) {
      cc.globalAlpha=1;
    }
    if(item.type() == "disabled") {
      cc.globalAlpha=clamp(0.3,cc.globalAlpha*0.4,1);
    }
    if(menu.selected == i) {
      cc.globalAlpha=clamp(0,cc.globalAlpha*1.5,1);
    }
    cc.globalAlpha=clamp(0.3,cc.globalAlpha,1);
    if(item.gap)
      top+=floor(line_height/2);
    if(item.icon) {
      text_draw_icon(cc,item.icon,floor(align+pad/2),top,{
        font:font,
        style:"white",
        size:1,
        align:"right baseline"
      });
    }
    text_draw_button(cc,item.text,align+pad,top,{
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
    top+=line_height;
    cc.restore();
  }
  canvas_clean("menu");
}

// level

function canvas_draw_level(cc) {

  if(game_mode() == "start" || (game_mode() == "game" && game_time() > prop.style.load.fade)) {
    canvas_clean("level");
    return;
  } else {
    canvas_dirty("level");
  }

  cc.globalAlpha=step(clamp(0,crange(0,game_time(),prop.style.load.fade,1,-0.2),1),0);

  var font=prop.font.ui;

  cc.fillStyle=prop.style.ui.bg;
  cc.fillRect(0,0,prop.canvas.size.width,prop.canvas.size.height);

  var center=floor(prop.canvas.size.width/2);

  var map=prop.game.map;

  text_draw(cc,"Loading map...",center,prop.canvas.size.height-30,{
    font:font,
    style:"logo",
    size:2,
    align:"center baseline"
  });

  text_draw(cc,map.info.name+" by "+map.info.author,center,prop.canvas.size.height-70,{
    font:font,
    style:"white",
    size:1,
    align:"center baseline"
  });

  cc.globalAlpha*=0.5;

  text_draw(cc,map.info.description,center,prop.canvas.size.height-90,{
    font:font,
    style:"white",
    size:1,
    align:"center baseline"
  });

  cc.restore();

}

// debug overlay

function canvas_draw_debug(cc) {
  var pad=3;
  var style="white";
  // fps
  text_draw(cc,floor(prop.time.fps).toString()+" fps",
            prop.canvas.size.width-pad,prop.canvas.size.height-pad,{
    font:prop.font.ui,
    style:style,
    size:1,
    align:"right baseline"
  });
  // frame spacing
  text_draw(cc,floor(prop.time.frame.delta*1000).toString()+"ms",
            pad,prop.canvas.size.height-pad,{
    font:prop.font.ui,
    style:style,
    size:1,
    align:"left baseline"
  });
  if(game_mode() == "game" && !game_paused())
    style="black";
  // version
  text_draw(cc,prop.version_string,prop.canvas.size.width-pad,pad,{
    font:prop.font.ui,
    style:style,
    size:1,
    align:"right top"
  });
  // temp
  text_draw(cc,prop.temp+"",pad,pad,{
    font:prop.font.ui,
    style:style,
    size:1,
    align:"left top"
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

// map

function canvas_update_map() {
  var cc=canvas_get("map");
  cc.save();
  canvas_clear(cc);
  cc.scale(prop.canvas.scale,prop.canvas.scale);
  cc.translate(round(prop.canvas.size.width/2),round(prop.canvas.size.height/2));
  var bs=prop.map.block.size;
  cc.save();
  cc.translate(-prop.ui.pan[0]*bs,
               prop.ui.pan[1]*bs);
  canvas_draw_map(cc);
  cc.restore();
  var player=prop.player.human;
  cc.fillRect(round(-player.size[0]/2*bs),round(-player.size[1]*bs),
              round(player.size[0]*bs),round(player.size[1]*bs));
  cc.restore();
  canvas_clean("map");
}

// menu

function canvas_update_menu() {
  var cc=canvas_get("menu");
  cc.save();
  canvas_clear(cc);
  cc.scale(prop.canvas.scale,prop.canvas.scale);
  canvas_draw_menu(cc);
  cc.restore();
}

// level

function canvas_update_level() {
  var cc=canvas_get("level");
  cc.save();
  canvas_clear(cc);
  cc.scale(prop.canvas.scale,prop.canvas.scale);
  canvas_draw_level(cc);
  cc.restore();
}

// debug

function canvas_update_debug() {
  if(RELEASE)
    return;
  var cc=canvas_get("debug");
  cc.save();
  canvas_clear(cc);
  cc.scale(prop.canvas.scale,prop.canvas.scale);
  canvas_draw_debug(cc);
  canvas_clean("debug");
  cc.restore();
}

// root, called by modules

function canvas_update() {
//  canvas_set_scale(trange(-1,Math.sin(time()*4),1,1,3));
  if(prop.canvas.dirty["background"])
    canvas_update_background();
  if(prop.canvas.dirty["map"])
    canvas_update_map();
  if(prop.canvas.dirty["menu"])
    canvas_update_menu();
  if(prop.canvas.dirty["level"])
    canvas_update_level();
  if(RELEASE == false) {
    if(prop.time.frames % 10 == 0)
      canvas_dirty("debug");
    if(prop.canvas.dirty["debug"])
      canvas_update_debug();
  }
}
