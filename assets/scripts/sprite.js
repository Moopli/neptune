
var Sprite=function(options) {
  this.use=""; // block, player
  this.name=""; // neptune, enemy, dirt, etc.
  this.type="single"; // single, animation, derivatives (how to interpret x-repeat <frames>)

  if(options) {
    if("use" in options) this.use=options.use;
    if("name" in options) this.name=options.name;
    if("type" in options) this.type=options.type;
  }

  this.prefix=prop.sprite.url+this.use+"/";

  this.images=null;

  this.drawFrame=function(cc,x,y,frame,image) { // image: center, left, left-top-inset, etc.
    image=this.images[image];
    if(!image)
      return;
    var offset=frame*image.frame_width;
    var size={
      width:image.frame_width,
      height:image.height
    };
    var source_image=image.data;
    cc.drawImage(source_image,offset,0,size.width,size.height,
                 x,y,size.width,size.height);
  };

  this.getImages=function() {
    for(var i in this.images) {
      async("image");
      new Content({
        url:this.prefix+this.images[i].url,
        type:"image",
        that:this,
        payload:i,
        callback:function(status,data,payload) {
          var pp=this.images[payload];
          this.images[payload]={
            data:data,
            width:data.naturalWidth,
            height:data.naturalHeight,
            frame_width:Math.floor(data.naturalWidth/pp.frames),
          };
          async_loaded("image");
        }
      });
    }
  };

  this.get=function() {
    var that=this;
    var url=this.prefix+this.name+".json";
    new Content({
      url:url,
      type:"json",
      that:this,
      callback:function(status,data) {
        if(status == "ok") {
          this.images=data.images;
          this.frames=data.frames;
          this.type=data.type;
          this.getImages();
        } else {
          log(arguments,LOG_FATAL);
        }
        async_loaded("sprite");
      }
    });
  };

};

function sprite_init() {
  prop.sprite={};
  prop.sprite.url="assets/sprites/";
  prop.sprite.sprites={};

  sprite_download("block","dirt");
  sprite_download("block","rock");

}

function sprite_get(use,name) {
  return prop.sprite.sprites[use][name];
}

function sprite_download(use,name) {
  var sprite=new Sprite({use:use,name:name});
  if(!(use in prop.sprite.sprites))
    prop.sprite.sprites[use]={};
  prop.sprite.sprites[use][name]=sprite;
  async("sprite");
  sprite.get();
}
