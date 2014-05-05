
var BackdropLayer=Fiber.extend(function() {
  return {
    init:function(options) {
      this.pan=[0,0];
      this.distance=0;
      this.style={};
      this.sprite_name=null;
      this.pattern={};
      this.canvas={};

      if(options) {
        if("distance" in options) this.distance=options.distance;
        if("style" in options) this.style=options.style;
        if("image" in options) this.sprite_name=options.image;
      }

      if(this.distance < 0) this.distance=Infinity;

      sprite_load("backdrop",this.sprite_name);
      this.sprite=sprite_get("backdrop",this.sprite_name);
    },
    render:function(part) {
      $("body").append("<canvas id='backdrop-prerender'></canvas>");
      var canvas=$("#backdrop-prerender").get(0).getContext("2d");
      $("#backdrop-prerender").detach();
      var size=this.sprite.size(part);
      canvas.canvas.width=size[0];
      canvas.canvas.height=size[1];
      canvas_clear(canvas);
      this.sprite.drawFrame(canvas,0,0,0,part);
      this.canvas[part]=canvas;
    },
    create:function(cc,part) {
      this.render(part);
      var repeat=this.style[part].repeat;
      if(repeat == "both") repeat="repeat";
      else if(repeat == "x") repeat="repeat-x";
      else if(repeat == "y") repeat="repeat-y";
      this.pattern[part]=cc.createPattern(this.canvas[part].canvas,repeat);
    },
    createPattern:function(cc) {
      this.create(cc,"above");
      this.create(cc,"below");
    },
    update:function(backdrop) {
//      console.log(backdrop);
      this.pan=prop.ui.pan;
    },
    getOffset:function() {
      var dist=Math.max(1,this.distance);
      var pan=[(-prop.ui.pan[0])/dist,prop.ui.pan[1]/dist];
//      prop.temp=pan.join(",");
      return pan;
    },
    drawPart:function(cc,part) {
      var pan=this.getOffset();
      var bs=prop.map.block.size;
      cc.save();
      cc.fillStyle=this.pattern[part];
      cc.translate(pan[0]*bs,pan[1]*bs);
      cc.rect(-pan[0]*bs,-pan[1]*bs,prop.canvas.size.width,prop.canvas.size.height);
      cc.fill();
      cc.restore();
    },
    draw:function(cc) {
      this.drawPart(cc,"below");
    },
  };
});

var Backdrop=Fiber.extend(function() {
  return {
    init:function(options) {
      this.name="";
      this.layers=[];
      if(options) {
        if("name" in options) this.name=options.name;
      }
    },
    createPatterns:function(cc) {
      for(var i=0;i<this.layers.length;i++) {
        var layer=this.layers[i];
        layer.createPattern(cc);
      }
    },
    update:function() {
    },
    draw:function(cc) {
      for(var i=0;i<this.layers.length;i++) {
        var layer=this.layers[i];
        layer.draw(cc);
      }
    },
    get:function() {
      var url=prop.backdrop.url+this.name+".json";
      new Content({
        url:url,
        type:"json",
        that:this,
        callback:function(status,data) {
          if(status == "ok") {
            this.layers=[];
            for(var i=0;i<data.layers.length;i++) {
              var layer=data.layers[i];
              this.layers.push(new BackdropLayer({
                distance:layer.distance,
                style:layer.style,
                image:layer.image
              }));
            }
            this.layers.sort(function(a,b) {
              return a.distance<b.distance;
            });
          } else {
            log(arguments,LOG_FATAL);
          }
          async_loaded("backdrop");
        }
      });
    }
  };
});

function backdrop_init() {
  prop.backdrop={};
  prop.backdrop.url="assets/backdrops/";
  prop.backdrop.backdrops={};
  backdrop_load("hills");
}

function backdrop_ready() {
  backdrop_create_patterns(canvas_get("backdrop"));
}

function backdrop_create_patterns(cc) {
  for(var i in prop.backdrop.backdrops) {
    var backdrop=prop.backdrop.backdrops[i];
    backdrop.createPatterns(cc);
  }
}

function backdrop_load(name) {
  var backdrop=new Backdrop({name:name});
  prop.backdrop.backdrops[name]=backdrop;
  async("backdrop");
  backdrop.get();
}

function backdrop_update() {
  if(!game_running()) return;
  for(var i in prop.backdrop.backdrops) {
    var backdrop=prop.backdrop.backdrops[i];
    backdrop.update();
  }
}
