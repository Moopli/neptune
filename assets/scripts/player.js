
var Player=Fiber.extend(function() {
  return {
    init:function(options) {
      this.pos=[0,0]; // measured from the center bottom
      this.speed=[0,0]; // blocks per second
      this.max_speed=[8,16];
      this.jump_force=2;
      this.accel=[0.2,0]; // time it takes to get to max_speed (ignored)
      this.direction=[0,0]; // [0] is -1 (left) to 1 (right), [1] is 0 (no jump) to 1 (jump)
      this.dead=false;
      this.die_time=null;

      this.size=[1,1]; // full width and full height

      this.on_ground=false;

      this.location=[0,0,0,0]; // closest obstacle location from EDGE of player
    },
    updateDirection:function() {
      this.speed[0]+=(this.direction[0]*this.max_speed[0]);
      if(this.on_ground)
        this.speed[1]+=(this.direction[1]*this.jump_force);
      this.speed[1]+=(this.direction[1]*this.max_speed[0]);
      this.speed[0]=clamp(-this.max_speed[0],this.speed[0],this.max_speed[0]);
      this.speed[1]=clamp(-this.max_speed[1],this.speed[1],this.max_speed[1]);
    },
    updateObstacles:function(mode) {
      var map=map_current();
      var gap=1;
      var left_position=this.pos[0]-this.size[0]/2+pbig;
      var right_position=this.pos[0]+this.size[0]/2-pbig;
      var top_position=this.pos[1]+this.size[1]-pbig;
      var bottom_position=this.pos[1]+pbig;

      var left_block_location=Math.max(
        map.getLeftPhysicsBlock(left_position,bottom_position),
        map.getLeftPhysicsBlock(left_position,top_position));
      var right_block_location=Math.min(
        map.getRightPhysicsBlock(right_position,bottom_position),
        map.getRightPhysicsBlock(right_position,top_position));
      var top_block_location=Math.min(
        map.getTopPhysicsBlock(left_position,top_position),
        map.getTopPhysicsBlock(right_position,top_position));
      var bottom_block_location=Math.max(
        map.getBottomPhysicsBlock(left_position,bottom_position),
        map.getBottomPhysicsBlock(right_position,bottom_position));

      this.location[0]=left_block_location+this.size[0]/2;
      this.location[1]=top_block_location-this.size[1];
      this.location[2]=right_block_location-this.size[0]/2;
      this.location[3]=bottom_block_location;
      prop.temp=this.pos[0]-this.location[0];
    },
    updateHorizontalCollision:function() {
      if(this.location[0]+ptiny > this.pos[0]) {
        this.pos[0]=this.location[0];
        if(this.speed[0] < ptiny) this.speed[0]=0;
      } else if(this.location[2]-ptiny < this.pos[0]) {
        this.pos[0]=this.location[2];
        if(this.speed[0] > -ptiny) this.speed[0]=0;
      }
    },
    updateVerticalCollision:function() {
      if(this.location[1]-ptiny < this.pos[1]) {
        this.pos[1]=this.location[1];
        if(this.speed[1] > -ptiny) this.speed[1]=0;
      } else if(this.location[3]+ptiny > this.pos[1]) {
        this.on_ground=true;
        this.pos[1]=this.location[3];
        if(this.speed[1] < ptiny) this.speed[1]=0;
      }
    },
    updateCollision:function() {
      this.on_ground=false;

      this.updateObstacles();
//      this.updateHorizontalCollision();

      this.updateObstacles();
      this.updateVerticalCollision();

      this.updateObstacles();
//      this.updateHorizontalCollision();
      
    },
    updateGravity:function() {
      return;
      if(this.on_ground) return;
      var map=map_current();
      this.speed[1]+=map.info.gravity*game_delta();
    },
    updatePhysics:function() {
      this.updateGravity();
      this.updateCollision();
    },
    updateFriction:function() {
      this.speed[0]-=this.speed[0]*(18*physics_delta());
//      this.speed[1]-=this.speed[1]*(18*physics_delta());
    },
    updatePosition:function() {
      this.pos[0]+=this.speed[0]*physics_delta();
      this.pos[1]+=this.speed[1]*physics_delta();
    },
    update:function() {
      this.updateFriction();
      this.updateDirection();
      this.updatePhysics();
      this.updatePosition();
    }
  };
});

var HumanPlayer=Player.extend(function(base) {
  return {
    init:function(options) {
      base.init.call(this,options);
      this.health=100;
    }
  };
});

function player_init() {
  prop.player={};

  prop.player.human=new HumanPlayer();

}

function player_reset() {
  prop.player.human=new HumanPlayer();
}

function player_warp(x,y) {
  prop.player.human.pos=[x-0.5,y+0.001];
}

function player_update() {
  if(game_running()) {
    var i=0;
    while(i++<prop.game.substeps) {
      prop.player.human.update();
    }
    canvas_dirty("map");
  }
}

var physics_delta=game_physics_delta;
