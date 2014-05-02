
var Font=function(options) {

  this.info={
    height:0,
    width:0,
  };

  this.glyphs={};
  this.buffer={};
  if(options) {
    if("info" in options) this.info=options.info;
    if("glyphs" in options) this.glyphs=options.glyphs;
  }

  var g=[];
  for(glyph in this.glyphs) {
    var g=this.glyphs[glyph];
    var width=0;
    for(var i=0;i<g.length;i++) {
    }
    g.push({
      name:glyph,
      glyph:glyph.join("\n"),
      width:width
    });
  }
  this.glyphs=g;

  this.getGlyph=function(c) {
    for(var i=0;i<this.glyphs.length;i++) {
      if(this.glyphs[i][0] == c)
        return i;
    }
    return null;
  };

  this.renderGlyph=function(g,cc,style) {
    g=g[1];
    for(var i=0;i<g.length;i++) {
      var x=i%this.info.width;
      var y=Math.floor(i/g.width);
      if(g[1][i] != " ") {
//        console.log(x,y);
        cc.fillRect(x,y,10,10);
      }
    }
  };

  this.render=function(style) {
    var buffer=document.createElement("canvas");
    buffer.width=this.info.width*this.glyph_number;
    buffer.height=this.info.height;
    var cc=buffer.getContext("2d")
    cc.save();
    if(style == "black")
      cc.fillStyle="#000";
    if(style == "white")
      cc.fillStyle="#fff";
    for(var i=0;i<this.glyphs.length;i++) {
      this.renderGlyph(this.glyphs[i],cc,style);
      cc.translate(this.info.width,0);
    }
    cc.restore();
    this.buffer[style]=cc;
  };

  this.render("white");
  this.render("black");

};

function font_init() {
  prop.font={};
  prop.font.ui=new Font({
    info:{
      height:10,
      width:8
    },
    glyphs:{
      "A":[
        "  ####  ",
        " ###### ",
        " ##  ## ",
        " ##  ## ",
        " ###### ",
        " ##  ## ",
        " ##  ## ",
        " ##  ## ",
        "        ",
        "        ",
      ]
    }
  });
}
