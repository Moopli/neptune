
var Player=Fiber.extend(function() {
  return {
    init:function(options) {
      this.pos=[0,0]; // measured from the center bottom
      this.speed=[0,0]; // blocks per second
      this.max_speed=[12,16];
      this.jump_force=14;
      this.accel=[0.2,0]; // time it takes to get to max_speed (ignored)
      this.direction=[0,0]; // [0] is -1 (left) to 1 (right), [1] is 0 (no jump) to 1 (jump)
      this.dead=false;
      this.die_time=null;

      this.size=[1.1,1.5]; // full width and full height

      this.on_ground=false;

      this.hit={
        left:false,
        right:false,
        top:false,
        bottom:false
      };

      this.location={
        left:0,
        right:0,
        top:0,
        bottom:0
      };
    },
    updateDirection:function() {
      var temp=(this.direction[0]*this.max_speed[0]);
      if(this.hit.left) temp=Math.max(0,temp);
      if(this.hit.right) temp=Math.min(0,temp);
      this.speed[0]+=temp;
      if(this.hit.bottom && !this.hit.top)
        this.speed[1]=(clamp(0,this.direction[1],1)*this.jump_force);
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
        map.getLeftPhysicsBlock(left_position,bottom_position),
        map.getLeftPhysicsBlock(left_position,middle_position),
        map.getLeftPhysicsBlock(left_position,top_position));
      var right_block_location=Math.min(
        map.getRightPhysicsBlock(right_position,bottom_position),
        map.getRightPhysicsBlock(right_position,middle_position),
        map.getRightPhysicsBlock(right_position,top_position));
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
      prop.temp=this.hit.bottom;
    },
    updateHorizontalCollision:function(margin) {
      this.hit.left=false;
      this.hit.right=false;
      if(this.location.left+margin > this.pos[0]-this.size[0]/2) {
        this.hit.left=true;
        this.pos[0]=this.location.left+this.size[0]/2+margin;
        if(this.speed[0] < margin) this.speed[0]=0;
        else this.pos[0]+=margin*1.3;
      } else if(this.location.right-margin < this.pos[0]+this.size[0]/2) {
        this.hit.right=true;
        this.pos[0]=this.location.right-this.size[0]/2-margin;
        if(this.speed[0] > -margin) this.speed[0]=0;
        else this.pos[0]-=margin*1.3;
      }
    },
    updateVerticalCollision:function(margin) {
      this.on_ground=false;
      this.hit.top=false;
      this.hit.bottom=false;
      if(this.location.top-margin < this.pos[1]+this.size[1]) {
        this.hit.top=true;
        this.pos[1]=this.location.top-this.size[1]-margin;
        if(this.speed[1] > margin) this.speed[1]=0;
        else this.pos[1]-=margin*1.1;
      } else if(this.location.bottom+margin > this.pos[1]) {
        this.on_ground=true;
        this.hit.bottom=true;
        this.pos[1]=this.location.bottom+margin*1.1;
        if(this.speed[1] < -margin) this.speed[1]=0;
        else this.pos[1]+=margin*1.1;
      }
    },
    updateCollision:function() {

      this.updateObstacles();
      this.updateHorizontalCollision(0.08);

      this.updateObstacles();
      this.updateVerticalCollision(0.04p);

    },
    updateGravity:function() {
//      return;
      if(this.on_ground) return;
      var map=map_current();
      this.speed[1]+=map.info.gravity*physics_delta();
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
      this.updatePhysics();
      this.updateDirection();
      this.updatePosition();
      this.updateFriction();
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
