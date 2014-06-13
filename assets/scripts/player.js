
var Player=Fiber.extend(function() {
  return {
    init:function(options) {
      this.type="player";
      this.pos=[0,0]; // measured from the center bottom
      this.speed=[0,0]; // blocks per second
      this.max_speed=[16,30];
      this.jump_force=22;
      this.accel=[0.2,0]; // time it takes to get to max_speed (ignored)
      this.direction=[0,0]; // [0] is -1 (left) to 1 (right), [1] is 0 (no jump) to 1 (jump)
      this.dead=false;
      this.die_time=null;
      this.friction={
        ground:21,
        air:10
      };

      this.size=[1.01,1.7]; // full width and full height

      this.hit={
        left:false,
        right:false,
        top:false,
        bottom:false
      };

      this.location={ // the OFFSET from player to wall
        left:0,
        right:0,
        top:0,
        bottom:0
      };

    },
    updateDirection:function() {
      this.speed[0]=this.direction[0]*15;
      this.speed[1]=this.direction[1]*15;
//      if(this.hit.bottom && !this.hit.top) {
//        this.speed[1]=(clamp(0,this.direction[1],1)*this.jump_force);
//        if(this.direction[1] > ptiny) this.hit.bottom=false;
//      }
      //      this.speed[1]+=(this.direction[1]*this.max_speed[0]);
      this.speed[0]=clamp(-this.max_speed[0],this.speed[0],this.max_speed[0]);
      this.speed[1]=clamp(-this.max_speed[1],this.speed[1],this.max_speed[1]);
    },
    updateObstacles:function(horizontal) {
      var map=map_current();
      var gap=1;
      var left_position=this.pos[0]-this.size[0]/2+pbig;
      var center_position=this.pos[0];
      var right_position=this.pos[0]+this.size[0]/2-pbig;
      var top_position=this.pos[1]+this.size[1]-pbig;
      var middle_position=this.pos[1]+this.size[1]/2;
      var bottom_position=this.pos[1]+pbig;

      var left_block_location=Math.max(
        map.getLeftPhysicsBlock(center_position,bottom_position),
        map.getLeftPhysicsBlock(center_position,middle_position),
        map.getLeftPhysicsBlock(center_position,top_position));
      var right_block_location=Math.min(
        map.getRightPhysicsBlock(center_position,bottom_position),
        map.getRightPhysicsBlock(center_position,middle_position),
        map.getRightPhysicsBlock(center_position,top_position));
      var top_block_location=Math.min(
        map.getTopPhysicsBlock(left_position,top_position),
        map.getTopPhysicsBlock(center_position,top_position),
        map.getTopPhysicsBlock(right_position,top_position));
      var bottom_block_location=Math.max(
        map.getBottomPhysicsBlock(left_position,bottom_position),
        map.getBottomPhysicsBlock(center_position,bottom_position),
        map.getBottomPhysicsBlock(right_position,bottom_position));
      this.location.left=left_block_location;
      this.location.right=right_block_location;
      this.location.top=top_block_location;
      this.location.bottom=bottom_block_location;
    },
    updateHorizontalCollision:function(margin) {
      if(this.location.left+margin > this.pos[0]-this.size[0]/4) {
        this.hit.left=true;
        this.pos[0]=this.location.left+this.size[0]/4;
        if(this.speed[0] < -margin) this.speed[0]=0;
        else this.pos[0]+=margin*1.01;
      } else if(this.location.right-margin < this.pos[0]+this.size[0]/4) {
        this.hit.right=true;
        this.pos[0]=this.location.right-this.size[0]/4;
        if(this.speed[0] > margin) this.speed[0]=0;
        else this.pos[0]-=margin*1.01;
      }
    },
    updateVerticalCollision:function(margin) {
      if(this.location.top-margin < this.pos[1]+this.size[1]) {
        this.hit.top=true;
        this.pos[1]=this.location.top-this.size[1]-margin;
        if(this.speed[1] > margin) this.speed[1]=0;
        else this.pos[1]-=margin*1.1;
      } else if(this.location.bottom+margin > this.pos[1]) {
        this.hit.bottom=true;
        this.pos[1]=this.location.bottom+margin*1.1;
        if(this.speed[1] < -margin) this.speed[1]=0;
        else this.pos[1]+=margin*1.1;
      }
    },
    updateCollision:function() {
      this.updateObstacles();

      this.updateHorizontalCollision();

      //      this.updateObstacles();
      this.updateVerticalCollision();

    },
    updateGravity:function() {
      //      return;
      if(this.hit.bottom) return;
      var map=map_current();
      this.speed[1]+=map.info.gravity*physics_delta();
    },
    updatePhysics:function() {
//      this.updateGravity();
//      this.updateCollision();
      this.updateFriction();
    },
    updateFriction:function() {
      var friction=this.friction.ground;
      if(!this.hit.bottom)
        friction=this.friction.air;
      this.speed[0]-=this.speed[0]*(friction*physics_delta());
      //      this.speed[1]-=this.speed[1]*(18*physics_delta());
    },
    updatePosition:function() {
      this.pos[0]+=this.speed[0]*physics_delta();
      this.pos[1]+=this.speed[1]*physics_delta();
    },
    updateSubstep:function() {
      this.updatePhysics();
      this.updatePosition();
    },
    update:function() {
      var i=0;
      this.hit.left=false;
      this.hit.right=false;
      this.hit.top=false;
      this.hit.bottom=false;
      this.updateDirection();
      while(i++<prop.game.substeps) {
        this.updateSubstep(false);
      }
    }
  };
});

var HumanPlayer=Player.extend(function(base) {
  return {
    init:function(options) {
      base.init.call(this,options);
      this.type="neptune";
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
  prop.ui.pan=[x-0.5,y];
}

function player_update() {
  if(game_running()) {
    prop.player.human.update();
    canvas_dirty("map");
  }
}
