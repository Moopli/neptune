
var Game=function() {
  this.mode="start"; // start, load, game
  this.paused=true;
  this.level=1;
  this.map=null;
};

function game_init() {
  prop.game=new Game();
}

function game_start() {
  var map="debug";
  prop.game.paused=false;
  prop.game.mode="load";
  prop.game.map=map_get(map);
  setTimeout(function() {
    map_use(map);
  },1);
  canvas_dirty("level");
}

function game_loaded() {
  prop.game.mode="game";
  canvas_dirty("level");
  canvas_dirty("map");
}

function game_end() {
  prop.game.paused=true;
  prop.game.mode="start";
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

function game_update() {
}
