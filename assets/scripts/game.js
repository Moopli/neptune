
var Game=function() {
  this.mode="start"; // start, load, game, end
  this.paused=true;
  this.level=1;
  this.map=null;
  this.time=0;
  this.speedup=1;
  this.substeps=10; // used for physics only
};

function game_init() {
  prop.game=new Game();
}

function game_ready() {

}

function game_clear() {
  prop.game.mode="start";
  prop.game.paused=true;
  prop.game.level=1;
  prop.game.map=null;
  prop.game.time=0;
  prop.game.speedup=1;
}

function game_start() {
  var map="debug";
  prop.game.paused=true;
  prop.game.mode="load";
  prop.game.map=map_get(map);
  setTimeout(function() {
    map_use(map);
  },delta()*5);
  canvas_dirty("level");
}

function game_loaded() {
  setTimeout(function() {
    prop.game.paused=false;
    prop.game.time=0;
    prop.game.mode="game";
    canvas_dirty("level");
    canvas_dirty("map");
    canvas_dirty("players");
    player_reset();
    var map=map_current();
    player_warp(map.start[0],map.start[1]);
  },delta()*5);
}

function game_end() {
  prop.game.paused=true;
  prop.game.mode="end";
  setTimeout(game_clear,prop.style.end.fade*1000);
}

function game_save() {
  
}

function game_pause() {
  prop.game.paused=true;
}

function game_unpause() {
  prop.game.paused=false;
}

function game_mode() {
  return prop.game.mode;
}

function game_paused() {
  return prop.game.paused;
}

function game_time() {
  if(game_mode() != "game")
    return 0;
  return prop.game.time;
}

function game_delta() {
  if(prop.game.speedup == 0 || prop.game.paused)
    return 0;
  return delta()*prop.game.speedup;
}

function game_physics_delta() {
  return game_delta()/prop.game.substeps;
}

function game_running() {
  if(!game_paused() && game_mode() == "game")
    return true;
  return false;
}

function game_update() {
  prop.game.time+=game_delta();
}

var physics_delta=game_physics_delta;
