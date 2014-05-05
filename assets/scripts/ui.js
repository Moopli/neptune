
function ui_init() {
  prop.ui={};
  prop.ui.pan=[0,0];
}

function ui_viewport() { // returns [left,top,width,height] in blocks
  var bs=prop.map.block.size*prop.canvas.scale;
  var width=Math.ceil(prop.canvas.size.width/bs)+2;
  var height=Math.ceil(prop.canvas.size.height/bs)+4;
  var left=Math.floor(-prop.ui.pan[0]);
  var top=Math.floor(prop.ui.pan[1]-height)+2;
  return [left,top,left+width,top+height];
}

function ui_update() {
  if(game_running()) {
//    prop.ui.pan[0]=(Math.sin(game_time()*0.2)*20)+20;
//    var map=map_current();
    prop.ui.pan[0]=prop.player.human.pos[0]+4;
    prop.ui.pan[1]=prop.player.human.pos[1]-4;
    canvas_dirty("backdrop");
    canvas_dirty("map");
    canvas_dirty("players");
  }
}
