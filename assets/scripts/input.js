
var UP=0; // if key == UP
var DOWN=1; // if key == DOWN
var MULTIPLE=2; // if key > MULTIPLE

function input_init() {
  prop.input={};

  prop.input.keys={};
  prop.input.keydown={};

  prop.input.keysym={
    shift:16,
    control:17,
    x:88,
    left:37,
    up:38,
    right:39,
    down:40,
    enter:13,
    esc:27
  };
}

function input_ready() {
  $(window).keydown(function(e) {
    prop.input.keys[e.which]=true;
    input_keydown(e.which);
    return true;
  });
  
  $(window).keyup(function(e) {
    prop.input.keys[e.which]=false;
    //    log(e.which,LOG_DEBUG);
    return true;
  });

}

function input_keydown(keycode) {
  if(menu_is_open()) {
    if(keycode == prop.input.keysym.up) {
      menu_move(-1);
    } else if(keycode == prop.input.keysym.down) {
      menu_move(1);
    } else if(keycode == prop.input.keysym.enter) {
      menu_select();
    } else if(keycode == prop.input.keysym.esc) {
      menu_back();
    }
  } else {
    if(keycode == prop.input.keysym.esc) {
      game_pause();
//      menu_open("start");
    }
  }
}

function input_update() {
  if(game_running()) {
    if(prop.input.keys[prop.input.keysym.right]) {
      prop.player.human.direction[0]=1;
    } else if(prop.input.keys[prop.input.keysym.left]) {
      prop.player.human.direction[0]=-1;
    } else {
      prop.player.human.direction[0]=0;
    }
    if(prop.input.keys[prop.input.keysym.up]) {
      prop.player.human.direction[1]=1;
    } else if(prop.input.keys[prop.input.keysym.down]) {
      prop.player.human.direction[1]=-1;
    } else {
      prop.player.human.direction[1]=0;
    }
  }
}
