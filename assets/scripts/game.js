
var Game=function() {
  this.mode="start"; // start, game
  this.paused=true;
  this.level=1;
};

function game_init() {
  prop.game=new Game();
}

function game_start() {
  prop.game.paused=false;
  prop.game.mode="game";
  map_load("debug");
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
