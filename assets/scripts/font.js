
var Font=function(options) {

  this.info={
    height:0, // both height & width are the TOTAL width and height of the buffer
    line_height:0, // the height from line to line
    baseline:0, // baseline distance from top of text
    width:0,
  };

  this.glyph_dict={};
  this.glyphs=[];
  this.buffer={};
  if(options) {
    if("height" in options) this.info.height=options.height;
    if("line-height" in options) this.info.line_height=options["line-height"];
    if("baseline" in options) this.info.baseline=options.baseline;
    if("glyphs" in options) this.glyph_dict=options.glyphs;
  }
  this.glyph_cache={};

  this.getGlyph=function(c) {
    if(!(c in this.glyph_cache)) {
      for(var i=0;i<this.glyphs.length;i++) {
        if(this.glyphs[i].name == c)
          this.glyph_cache[c]=i;
      }
    }
    if(!(c in this.glyph_cache))
      return null;
    return this.glyphs[this.glyph_cache[c]]
  };

  this.renderGlyph=function(glyph,cc,style) {
    var g=glyph.glyph;
    for(var i=0;i<g.length;i++) {
      var x=i%(glyph.width+1);
      var y=Math.floor(i/(glyph.width+1));
      if(style == "debug") {
        var cr=Math.floor(Math.random()*255);
        var cg=Math.floor(Math.random()*255);
        var cb=Math.floor(Math.random()*255);
        cc.fillStyle="rgb("+[cr,cg,cb].join(",")+")";
      }
      if(style == "logo") {
        var cr=Math.floor(trange(0,Math.random(),1,90,140));
        var cg=Math.floor(clamp(0,cr*1.3,255));
        var cb=Math.floor(clamp(0,cr*3,255));
        cc.fillStyle="rgb("+[cr,cg,cb].join(",")+")";
      }
      if(g[i] == "#") {
        cc.fillRect(x,y,1,1);
      }
    }
  };

  this.render=function(style) {
    var buffer=document.createElement("canvas");
    buffer.width=this.info.width;
    buffer.height=this.info.height;
    var cc=buffer.getContext("2d")
    cc.save();
    if(style == "black")
      cc.fillStyle=prop.style.ui.bg;
    if(style == "white")
      cc.fillStyle=prop.style.ui.fg;
    for(var i=0;i<this.glyphs.length;i++) {
      cc.save();
      cc.translate(this.glyphs[i].offset,0);
      this.renderGlyph(this.glyphs[i],cc,style);
      cc.restore();
    }
    cc.restore();
    this.buffer[style]=cc;
    //$("body").append(buffer);
  };

  this.generate=function() {
    this.glyph_cache={};
    var glyph_list=[];
    var x=0;
    for(glyph_name in this.glyph_dict) {
      var glyph=this.glyph_dict[glyph_name];
      var width=0;
      for(var i=0;i<glyph.length;i++) {
        width=Math.max(glyph[i].length,width);
      }
      glyph_list.push({
        name:glyph_name,
        glyph:glyph.join("\n"),
        width:width,
        offset:x
      });
      x+=width;
    }
    this.info.width=x;
    this.glyphs=glyph_list;

    if(!RELEASE) this.render("debug");
    this.render("white");
    this.render("black");
    this.render("logo");
  };

  this.generate();

};

function font_init() {
  prop.font={};
  prop.font.url="assets/data/fonts/";

  async("font");
  font_load("ui");
}

function font_load(name) {
  var url=prop.font.url+name+".json";
  load_item_add();
  $.getJSON(url)
    .success(function(data) {
      prop.font[name]=new Font(data);
      async_loaded("font");
      load_item_done();
    })
    .error(function() {
      log(arguments,LOG_FATAL);
      async_loaded("font");
      load_item_done();
    });
}

function font_update() {
  
}
