
function game_init() {
  prop.game={};
  prop.game.mode="start"; // start, game
  prop.game.paused=true;
}

function game_start() {
  prop.game.paused=false;
  prop.game.mode="game";
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
