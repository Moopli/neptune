
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

  this.sides.left={
    dirt:[],
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

  if(options) {
    if("type" in options) this.type=options.type;
    if("pos" in options) this.pos=options.pos;
    if("map" in options) this.map=options.map;
  }

  this.pickStyle=function() {
    this.style={};
    var rotate="no";
    var frames={};

    if(this.type == "dirt") {
      rotate="all";
      frames.center=4;
      frames.top=4;
      frames.top_left_outside=4;
      frames.top_right_outside=4;
      frames.top_left_inside=4;
      frames.top_right_inside=4;
    } else if(this.type == "rock") {
      rotate="180";
      frames.center=4;
      frames.top=4;
      frames.top_left_outside=4;
      frames.top_left_inside=4;
      frames.top_right_inside=4;
    }

    this.style.center={};
    this.style.center.frame=floor(rand()*frames.center);

    this.style.top={};
    this.style.top.frame=floor(rand()*frames.top);

    this.style.top_left_outside={};
    this.style.top_left_outside.frame=floor(rand()*frames.top_left_outside);

    this.style.top_right_outside={};
    this.style.top_right_outside.frame=floor(rand()*frames.top_right_outside);

    this.style.top_left_inside={};
    this.style.top_left_inside.frame=floor(rand()*frames.top_left_inside);

    this.style.top_right_inside={};
    this.style.top_right_inside.frame=floor(rand()*frames.top_right_inside);

    this.style.center.angle=0;
    if(rotate == "all")
      this.style.center.angle=floor(rand()*4)/4*Math.PI*2;
    else if(rotate == "180")
      this.style.center.angle=floor(rand()*2)/2*Math.PI*2;
  };

  this.drawCenter=function(cc,sprite) {
    sprite.drawFrame(cc,0,0,this.style.center.frame,"center");
  };

  this.drawTop=function(cc,sprite) {
    var bs=prop.map.block.size;
    sprite.drawFrame(cc,0,-floor(bs*0.5),this.style.top.frame,"top");
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

  this.render=function(cc,center) {
    this.pickStyle();

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
    
    if(center) {
      cc.save()
      cc.translate(bs/2,bs/2);
      cc.rotate(this.style.center_angle);
      cc.translate(-bs/2,-bs/2);
      this.drawCenter(cc,sprite);
      cc.restore();
    } else {

      var temp_block=this.map.getBlock(x,y+1); // above
      var top_type=(temp_block?temp_block.type:"air");

      temp_block=this.map.getBlock(x-1,y); // left
      var left_type=(temp_block?temp_block.type:"air");

      temp_block=this.map.getBlock(x+1,y); // right
      var right_type=(temp_block?temp_block.type:"air");

      temp_block=this.map.getBlock(x-1,y+1); // top left
      var top_left_type=(temp_block?temp_block.type:"air");

      temp_block=this.map.getBlock(x+1,y+1); // top right
      var top_right_type=(temp_block?temp_block.type:"air");

      var top=contains(this.sides.top[this.type],top_type);
      var left=contains(this.sides.left[this.type],left_type);

      var top_left_outside=(contains(this.sides.top_left_outside[this.type],top_type) &&
                            contains(this.sides.top_left_outside[this.type],left_type));
      var top_right_outside=(contains(this.sides.top_right_outside[this.type],top_type) &&
                             contains(this.sides.top_right_outside[this.type],right_type));
      var top_left_inside=(contains(this.sides.top_left_inside[this.type],top_type) &&
                           !contains(this.sides.top_left_inside[this.type],top_left_type));
      var top_right_inside=(contains(this.sides.top_right_inside[this.type],top_type) &&
                            !contains(this.sides.top_right_inside[this.type],top_right_type));

      if(top)
        this.drawTop(cc,sprite);
      if(top_left_outside)
        this.drawTopLeftOutside(cc,sprite);
      if(top_right_outside)
        this.drawTopRightOutside(cc,sprite);
      if(top_left_inside)
        this.drawTopLeftInside(cc,sprite);
      if(top_right_inside)
        this.drawTopRightInside(cc,sprite);
    }

    cc.restore();

  };
  
};

var Map=function(data) {
  this.data=data;
  this.blocks={};

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
    var x=0;
    var y=0;
    if("offset" in info) {
      if("y" in info.offset) {
        y+=info.offset.y;
      }
      if("x" in info.offset) {
        x+=info.offset.x;
      }
    }
    y+=1; // allow for one newline
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

  this.parseBlockId=function(id) {
    return [id.split(":")[0],id.split(":")[1]];
  };

  this.addBlock=function(x,y,c) {
    var type=null;
    if(c == "*") {
      type="rock";
    } else if(c == "#") {
      type="dirt";
    }
    if(type == null) // air
      return;
    this.blocks[this.getBlockId(x,y)]=new Block({
      type:type,
      map:this,
      pos:[x,y]
    });
    this.bounds[0]=Math.min(this.bounds[0],x-1);
    this.bounds[1]=Math.min(this.bounds[1],y-1);

    this.bounds[2]=Math.max(this.bounds[2],x+1);
    this.bounds[3]=Math.max(this.bounds[3],y+1);
  };

  this.renderBlockCenter=function(block) {
    block.render(this.canvas,true);
  };

  this.renderBlock=function(block) {
    block.render(this.canvas,false);
  };

  this.render=function() {
    var bs=prop.map.block.size;
    $("body").append("<canvas id='map-prerender'></canvas>");
    this.canvas=$("#map-prerender").get(0).getContext("2d");
    this.canvas.canvas.width=(this.bounds[2]-this.bounds[0])*bs;
    this.canvas.canvas.height=(this.bounds[3]-this.bounds[1])*bs;
    canvas_clear(this.canvas);
    this.canvas.translate(bs,bs);
    $("#map-prerender").css("display","none")
    for(var i in this.blocks) {
      var block=this.blocks[i];
      this.renderBlockCenter(block);
    }
    for(var i in this.blocks) {
      var block=this.blocks[i];
      this.renderBlock(block);
    }
  };
  
  this.use=function() {
    this.parse();
    this.render();
    canvas_dirty("map");
  };

};

function map_init() {
  prop.map={};
  prop.map.url="assets/data/maps/";

  prop.map.maps={};
  prop.map.block={};
  prop.map.block.size=14;

  prop.map.map=null; // current map

  map_get("debug");

}

function map_current() {
  return prop.map.map;
}

function map_load(name) {
  prop.map.map=prop.map.maps[name];
  prop.map.map.use();
}

function map_get(name) {
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
