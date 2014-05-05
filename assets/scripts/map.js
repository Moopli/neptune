
// BLOCK

var Block=function(options) {
  this.type="";
  this.pos=[0,0];
  this.style={};
  this.map=null;

  this.sides={};

  this.sides.top={
    dirt:["air"],
    rock:[]
  };

  this.sides.bottom={
    dirt:["air"],
    rock:[]
  };

  this.sides.left={
    dirt:["air"],
    rock:[]
  };

  this.sides.right={
    dirt:["air"],
    rock:[]
  };

  this.sides.top_left_outside={ // only if left AND top are one of these
    dirt:["air"],
    rock:[]
  };

  this.sides.top_right_outside={
    dirt:["air"],
    rock:[]
  };

  this.sides.top_left_inside={ // only if ((left-top is NOT) AND (top is))
    dirt:["air"],
    rock:[]
  };

  this.sides.top_right_inside={
    dirt:["air"],
    rock:[]
  };

  this.sides.bottom_left_outside={
    dirt:["air"],
    rock:[]
  };

  this.sides.bottom_right_outside={
    dirt:["air"],
    rock:[]
  };

  this.sides.bottom_left_inside={
    dirt:["air"],
    rock:[]
  };

  this.sides.bottom_right_inside={
    dirt:["air"],
    rock:[]
  };

  if(options) {
    if("type" in options) this.type=options.type;
    if("pos" in options) this.pos=options.pos;
    if("map" in options) this.map=options.map;
  }

  this.rand=function() {
    return rand();
    var x=this.pos[0];
    var y=this.pos[1];
    return clamp(0,(x%8+y%8)/4,1);
  };

  this.chance=function() {
    return (this.rand() >= 0.5);
  };
  
  this.ghost=function() {
    return false;
  };

  this.pickStyle=function() {
    this.style={};
    var rotate="no";
    var frames={};
    var flip={};

    if(this.type == "dirt") {
      rotate="all";

      frames.center=4;
      frames.top=4;
      frames.bottom=4;
      frames.left=4;
      frames.right=4;

      flip.center="no";
      flip.top="horizontal";
      flip.bottom="horizontal";
      flip.left="vertical";
      flip.right="vertical";

      frames.top_left_outside=4;
      frames.top_right_outside=4;
      frames.top_left_inside=4;
      frames.top_right_inside=4;

      frames.bottom_left_outside=4;
      frames.bottom_right_outside=4;
      frames.bottom_left_inside=4;
      frames.bottom_right_inside=4;
    } else if(this.type == "rock") {
      rotate="all";

      frames.center=4;
      frames.top=4;
      frames.bottom=4;
      frames.left=4;
      frames.right=4;

      flip.center="no";
      flip.top="horizontal";
      flip.bottom="horizontal";
      flip.left="vertical";
      flip.right="vertical";

      frames.top_left_outside=4;
      frames.top_right_outside=4;
      frames.top_left_inside=4;
      frames.top_right_inside=4;

      frames.bottom_left_outside=4;
      frames.bottom_right_outside=4;
      frames.bottom_left_inside=4;
      frames.bottom_right_inside=4;
    }

    this.style.center={};
    this.style.center.frame=floor(this.rand()*frames.center);
    this.style.center.flip=flip.center;

    this.style.top={};
    this.style.top.frame=floor(this.rand()*frames.top);
    this.style.top.flip=flip.top;

    this.style.bottom={};
    this.style.bottom.frame=floor(this.rand()*frames.bottom);
    this.style.bottom.flip=flip.bottom;

    this.style.left={};
    this.style.left.frame=floor(this.rand()*frames.left);
    this.style.left.flip=flip.left;

    this.style.right={};
    this.style.right.frame=floor(this.rand()*frames.right);
    this.style.right.flip=flip.right;

    this.style.top_left_outside={};
    this.style.top_left_outside.frame=floor(this.rand()*frames.top_left_outside);

    this.style.top_right_outside={};
    this.style.top_right_outside.frame=floor(this.rand()*frames.top_right_outside);

    this.style.top_left_inside={};
    this.style.top_left_inside.frame=floor(this.rand()*frames.top_left_inside);

    this.style.top_right_inside={};
    this.style.top_right_inside.frame=floor(this.rand()*frames.top_right_inside);

    this.style.bottom_left_outside={};
    this.style.bottom_left_outside.frame=floor(this.rand()*frames.bottom_left_outside);

    this.style.bottom_right_outside={};
    this.style.bottom_right_outside.frame=floor(this.rand()*frames.bottom_right_outside);

    this.style.bottom_left_inside={};
    this.style.bottom_left_inside.frame=floor(this.rand()*frames.bottom_left_inside);

    this.style.bottom_right_inside={};
    this.style.bottom_right_inside.frame=floor(this.rand()*frames.bottom_right_inside);

    this.style.center.angle=0;
    if(rotate == "all")
      this.style.center.angle=floor(rand()*4);
    else if(rotate == "180")
      this.style.center.angle=floor(rand()*2)*2;
  };

  this.drawCenter=function(cc,sprite) {
    sprite.drawFrame(cc,0,0,this.style.center.frame,"center");
  };

  this.drawTop=function(cc,sprite) {
    var bs=prop.map.block.size;
    sprite.drawFrame(cc,0,-floor(bs*0.5),this.style.top.frame,"top");
  };

  this.drawBottom=function(cc,sprite) {
    var bs=prop.map.block.size;
    sprite.drawFrame(cc,0,floor(bs*0.5),this.style.bottom.frame,"bottom");
  };

  this.drawLeft=function(cc,sprite) {
    var bs=prop.map.block.size;
    sprite.drawFrame(cc,-floor(bs*0.5),0,this.style.top.frame,"left");
  };

  this.drawRight=function(cc,sprite) {
    var bs=prop.map.block.size;
    sprite.drawFrame(cc,floor(bs*0.5),0,this.style.top.frame,"right");
  };

  this.drawTopLeftOutside=function(cc,sprite) {
    var bs=prop.map.block.size;
    sprite.drawFrame(cc,-floor(bs*0.5),-floor(bs*0.5),
                     this.style.top_left_outside.frame,"top-left-outside");
  };

  this.drawTopRightOutside=function(cc,sprite) {
    var bs=prop.map.block.size;
    sprite.drawFrame(cc,floor(bs*0.5),-floor(bs*0.5),
                     this.style.top_left_outside.frame,"top-right-outside");
  };

  this.drawTopLeftInside=function(cc,sprite) {
    var bs=prop.map.block.size;
    sprite.drawFrame(cc,-floor(bs*0.5),-floor(bs*0.5),
                     this.style.top_left_inside.frame,"top-left-inside");
  };

  this.drawTopRightInside=function(cc,sprite) {
    var bs=prop.map.block.size;
    sprite.drawFrame(cc,floor(bs*0.5),-floor(bs*0.5),
                     this.style.top_left_inside.frame,"top-right-inside");
  };

  this.drawBottomLeftOutside=function(cc,sprite) {
    var bs=prop.map.block.size;
    sprite.drawFrame(cc,-floor(bs*0.5),floor(bs*0.5),
                     this.style.bottom_left_outside.frame,"bottom-left-outside");
  };

  this.drawBottomRightOutside=function(cc,sprite) {
    var bs=prop.map.block.size;
    sprite.drawFrame(cc,floor(bs*0.5),floor(bs*0.5),
                     this.style.bottom_right_outside.frame,"bottom-right-outside");
  };

  this.drawBottomLeftInside=function(cc,sprite) {
    var bs=prop.map.block.size;
    sprite.drawFrame(cc,-floor(bs*0.5),floor(bs*0.5),
                     this.style.bottom_left_inside.frame,"bottom-left-inside");
  };

  this.drawBottomRightInside=function(cc,sprite) {
    var bs=prop.map.block.size;
    sprite.drawFrame(cc,floor(bs*0.5),floor(bs*0.5),
                     this.style.bottom_right_inside.frame,"bottom-right-inside");
  };

  this.render=function(cc,mode) {

    var bs=prop.map.block.size;
    var sprite=null;
    if(this.type == "dirt")
      sprite=sprite_get("block","dirt");
    else if(this.type == "rock")
      sprite=sprite_get("block","rock");
    else
      return;

    var x=this.pos[0];
    var y=this.pos[1];
    
    cc.save();
    cc.translate(x*bs,-y*bs);
    
    if(mode == "center") {
      cc.save()
      cc.translate(bs/2,bs/2);
      cc.rotate(this.style.center.angle/4*Math.PI2);
      cc.translate(-bs/2,-bs/2);
      this.drawCenter(cc,sprite);
      cc.restore();
    } else if(mode == "edge" || mode == "corner") {

      var temp_block=this.map.getBlock(x,y+1); // above
      var top_type=(temp_block?temp_block.type:"air");

      temp_block=this.map.getBlock(x,y-1); // above
      var bottom_type=(temp_block?temp_block.type:"air");

      temp_block=this.map.getBlock(x-1,y); // left
      var left_type=(temp_block?temp_block.type:"air");

      temp_block=this.map.getBlock(x+1,y); // right
      var right_type=(temp_block?temp_block.type:"air");

      temp_block=this.map.getBlock(x-1,y+1); // top left
      var top_left_type=(temp_block?temp_block.type:"air");

      temp_block=this.map.getBlock(x+1,y+1); // top right
      var top_right_type=(temp_block?temp_block.type:"air");

      temp_block=this.map.getBlock(x-1,y-1); // bottom left
      var bottom_left_type=(temp_block?temp_block.type:"air");

      temp_block=this.map.getBlock(x+1,y-1); // bottom right
      var bottom_right_type=(temp_block?temp_block.type:"air");

      var c=contains;

      var top=c(this.sides.top[this.type],top_type);
      var bottom=c(this.sides.bottom[this.type],bottom_type);
      var left=c(this.sides.left[this.type],left_type);
      var right=c(this.sides.right[this.type],right_type);

      var top_left_outside=(c(this.sides.top_left_outside[this.type],top_type) &&
                            c(this.sides.top_left_outside[this.type],left_type));
      var top_right_outside=(c(this.sides.top_right_outside[this.type],top_type) &&
                             c(this.sides.top_right_outside[this.type],right_type));
      var top_left_inside=(c(this.sides.top_left_inside[this.type],top_type) &&
                           !c(this.sides.top_left_inside[this.type],top_left_type));
      var top_right_inside=(c(this.sides.top_right_inside[this.type],top_type) &&
                            !c(this.sides.top_right_inside[this.type],top_right_type));

      var bottom_left_outside=(c(this.sides.bottom_left_outside[this.type],bottom_type) &&
                               c(this.sides.bottom_left_outside[this.type],left_type));
      var bottom_right_outside=(c(this.sides.bottom_right_outside[this.type],bottom_type) &&
                                c(this.sides.bottom_right_outside[this.type],right_type));
      var bottom_left_inside=(c(this.sides.bottom_left_inside[this.type],bottom_type) &&
                              !c(this.sides.bottom_left_inside[this.type],bottom_left_type));
      var bottom_right_inside=(c(this.sides.bottom_right_inside[this.type],bottom_type) &&
                               !c(this.sides.bottom_right_inside[this.type],bottom_right_type));

      if(mode == "edge") {
        if(top) {
          cc.save()
          cc.translate(bs/2,bs/2);
          if(this.style.top.flip == "horizontal" && this.chance())
            cc.scale(-1,1);
          else if(this.style.top.flip == "vertical" && this.chance())
            cc.scale(1,-1);
          cc.translate(-bs/2,-bs/2);
          this.drawTop(cc,sprite);
          cc.restore();
        }
        if(bottom) {
          cc.save()
          cc.translate(bs/2,bs/2);
          if(this.style.bottom.flip == "horizontal" && this.chance())
            cc.scale(-1,1);
          else if(this.style.bottom.flip == "vertical" && this.chance())
            cc.scale(1,-1);
          cc.translate(-bs/2,-bs/2);
          this.drawBottom(cc,sprite);
          cc.restore();
        }
        if(left) {
          cc.save()
          cc.translate(bs/2,bs/2);
          if(this.style.left.flip == "horizontal" && this.chance())
            cc.scale(-1,1);
          else if(this.style.left.flip == "vertical" && this.chance())
            cc.scale(1,-1);
          cc.translate(-bs/2,-bs/2);
          this.drawLeft(cc,sprite);
          cc.restore();
        }
        if(right) {
          cc.save()
          cc.translate(bs/2,bs/2);
          if(this.style.right.flip == "horizontal" && this.chance())
            cc.scale(-1,1);
          else if(this.style.right.flip == "vertical" && this.chance())
            cc.scale(1,-1);
          cc.translate(-bs/2,-bs/2);
          this.drawRight(cc,sprite);
          cc.restore();
        }
      }
      if(mode == "corner") {
        if(top_left_outside)
          this.drawTopLeftOutside(cc,sprite);
        if(top_right_outside)
          this.drawTopRightOutside(cc,sprite);
        if(top_left_inside)
          this.drawTopLeftInside(cc,sprite);
        if(top_right_inside)
          this.drawTopRightInside(cc,sprite);
        if(bottom_left_outside)

          this.drawBottomLeftOutside(cc,sprite);
        if(bottom_right_outside)
          this.drawBottomRightOutside(cc,sprite);
        if(bottom_left_inside)
          this.drawBottomLeftInside(cc,sprite);
        if(bottom_right_inside)
          this.drawBottomRightInside(cc,sprite);
      }
    }

    cc.restore();

  };
  
};

// MAP

var Map=function(data) {
  this.data=data;
  this.blocks={};
  this.start=[0,0];

  this.info={};

  this.parse=function() {
    this.blocks={};
    var info="";
    var map="";
    var nest=0;
    var json=false;
    for(var i=0;i<this.data.length;i++) {
      var c=this.data[i];
      if(nest == 0 && json) {
        map+=c;
      } else {
        info+=c;
      }
      if(c == "{") {
        json=true;
        nest+=1;
      } else if(c == "}") {
        nest-=1;
      }
    }
    info=JSON.parse(info);
    this.info=info;
    if(!("gravity" in info))
      info.gravity=-25;
    var x=0;
    var y=0;
    y-=1;
    for(var i=0;i<map.length;i++) {
      var c=map[i];
      if(c == "\n") {
        x=0;
        y+=1;
        continue;
      }
      this.addBlock(x,-y,c);
      x+=1;
    }
  };

  this.bounds=[0,0,0,0];

  this.getBlockId=function(x,y) {
    return x+":"+y;
  };

  this.getBlock=function(x,y) {
    var id=this.getBlockId(x,y);
    if(id in this.blocks) {
      return this.blocks[id];
    }
    return null;
  };

  this.getBlockRow=function(y,start,end) {
    if(start == undefined) start=this.bounds[0];
    if(end == undefined) end=this.bounds[2];
    start=floor(start);
    end=ceil(end);
    var blocks=[];
    for(var x=start;x<end;x++) {
      var block=this.getBlock(x,y);
      if(block) blocks.push(block);
    }
    return blocks;
  };

  this.getBlockColumn=function(x,start,end) {
    if(start == undefined) start=this.bounds[1];
    if(end == undefined) end=this.bounds[3];
    start=floor(start);
    end=ceil(end);
    var blocks=[];
    for(var y=start;y<end;y++) {
      var block=this.getBlock(x,y)
      if(block) blocks.push(block);
    }
    return blocks;
  };

  this.getLeftPhysicsBlock=function(x,y,distance) { // ignore ghost
    x=ceil(x);
    y=floor(y);
    if(!distance) distance=5;
    for(var i=x+0;i>x-distance;i--) {
      var block=this.getBlock(i,y);
      if(!block)
        continue;
      if(block.ghost())
        continue;
      return block.pos[0];
    }
    return -Infinity;
  };

  this.getRightPhysicsBlock=function(x,y,distance) {
    x=floor(x);
    y=floor(y);
    if(!distance) distance=5;
    for(var i=x+0;i<x+distance;i++) {
      var block=this.getBlock(i,y);
      if(!block)
        continue;
      if(block.ghost())
        continue;
      return block.pos[0]-1;
    }
    return Infinity;
  };

  this.getTopPhysicsBlock=function(x,y,distance) {
    x=ceil(x);
    y=floor(y);
    if(!distance) distance=5;
    for(var i=y+0;i<y+distance;i++) {
      var block=this.getBlock(x,i);
      if(!block)
        continue;
      if(block.ghost())
        continue;
      return block.pos[1];
    }
    return Infinity;
  };

  this.getBottomPhysicsBlock=function(x,y,distance) {
    x=ceil(x);
    y=ceil(y);
    if(!distance) distance=5;
    for(var i=y+0;i>y-distance;i--) {
      var block=this.getBlock(x,i);
      if(!block)
        continue;
      if(block.ghost())
        continue;
      return block.pos[1]+1;
    }
    return -Infinity;
  };

  this.parseBlockId=function(id) {
    return [id.split(":")[0],id.split(":")[1]];
  };

  this.addBlock=function(x,y,c) {
    var type=null;
    var entity=false;
    if(c == "*") {
      type="rock";
    } else if(c == "#") {
      type="dirt";
    } else if(c == "@") {
      type="start";
    }
    if(type == null) // air
      return;
    if(type == "start") {
      this.start=[x,y];
    } else {
      this.blocks[this.getBlockId(x,y)]=new Block({
        type:type,
        map:this,
        pos:[x,y]
      });
    }
    this.bounds[0]=Math.min(this.bounds[0],x-2);
    this.bounds[1]=Math.min(this.bounds[1],-y-2);

    this.bounds[2]=Math.max(this.bounds[2],x+4);
    this.bounds[3]=Math.max(this.bounds[3],-y+4);
  };

  this.renderBlockCenter=function(block) {
    block.pickStyle();
    block.render(this.canvas,"center");
  };

  this.renderBlockEdges=function(block) {
    block.render(this.canvas,"edge");
  };

  this.renderBlockCorners=function(block) {
    block.render(this.canvas,"corner");
  };

  this.render=function() {
    var bs=prop.map.block.size;
    $("body").append("<canvas id='map-prerender'></canvas>");
    this.canvas=$("#map-prerender").get(0).getContext("2d");
    this.canvas.canvas.width=(this.bounds[2]-this.bounds[0])*bs;
    this.canvas.canvas.height=(this.bounds[3]-this.bounds[1])*bs;
    canvas_clear(this.canvas);
    this.canvas.translate(bs*2,bs*2);
    $("#map-prerender").detach();
    for(var i in this.blocks) {
      var block=this.blocks[i];
      this.renderBlockCenter(block);
    }
    for(var i in this.blocks) {
      var block=this.blocks[i];
      this.renderBlockEdges(block);
    }
    for(var i in this.blocks) {
      var block=this.blocks[i];
      this.renderBlockCorners(block);
    }
  };
  
  this.use=function() {
    this.parse();
    this.render();
    canvas_dirty("load");
    game_loaded();
    canvas_dirty("map");
  };

};

function map_init() {
  prop.map={};
  prop.map.url="assets/maps/";

  prop.map.maps={};
  prop.map.block={};
  prop.map.block.size=14;

  prop.map.map=null; // current map

  map_load("debug");

}

function map_current() {
  return prop.map.map;
}

function map_get(name) {
  prop.map.maps[name].parse();
  return prop.map.maps[name];
}

function map_use(name) {
  prop.map.map=prop.map.maps[name];
  prop.map.map.use();
}

function map_load(name) {
  async("map");

  var url=prop.map.url+name+".map";

  new Content({
    url:url,
    type:"map",
    callback:function(status,data) {
      if(status == "ok") {
        prop.map.maps[name]=new Map(data);
      } else {
        log(arguments,LOG_FATAL);
      }
      async_loaded("map");
    }
  });
}
