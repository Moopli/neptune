
function text_init() {
  prop.text={};
}

function text_draw_char(cc,c,x,y,font,style,size) {
  if(!font)
    return 0;
  var glyph=font.getGlyph(c);
  if(!glyph)
    return 0;
  if(cc)
    cc.drawImage(font.buffer[style].canvas,glyph.offset,0,glyph.width,font.info.height,
                 x,y,glyph.width*size,font.info.height*size);
  return glyph.width*size;
}

function text_draw_ll(cc,text,x,y,options) {
  // realign here
  var font=options.font;
  var style=options.style;
  var size=options.size;

  if(!font) font=prop.font.ui;
  if(!style) style="debug";
  if(!size) size=1;

  var offset=0;
  for(var i=0;i<text.length;i++) {
    offset+=text_draw_char(cc,text[i],x+offset,y,font,style,size);
  }
  return offset;
}

function text_width(cc,text,x,y,options) {
  return text_draw_ll(null,text,x,y,options);
}

function text_height(cc,text,x,y,options) {
  var font=options.font;
  var size=options.size;

  if(!font) font=prop.font.ui;
  if(!size) size=1;

  return font.info.height*size;
}

function text_baseline_height(cc,text,x,y,options) { // ignores descenders
  var font=options.font;
  var size=options.size;

  if(!font) font=prop.font.ui;
  if(!size) size=1;

  return font.info.baseline*size;
}

function text_align(cc,text,x,y,options) {
  var size=options.size;
  var align=options.align;

  if(!size) size=1;

  align=align.split(" ");

  var xalign=align[0];
  var yalign=align[1];
  var width=text_width(cc,text,x,y,options);
  var font=options.font;

  var offset=[0,0];
  if(xalign == "center")
    offset[0]-=width/2;
  if(xalign == "right")
    offset[0]-=width;
  if(yalign == "baseline")
    offset[1]-=font.info.baseline*size;
  if(yalign == "bottom")
    offset[1]-=font.info.height*size;

  offset[0]=Math.floor(offset[0]);
  offset[1]=Math.floor(offset[1]);

  return offset;
}

function text_draw(cc,text,x,y,options) {
  var align=options.align;
  var size=options.size;

  if(!align) align="left baseline";
  if(!size) size=1;

  options.align=align;
  var offset=text_align(cc,text,x,y,options);

  return text_draw_ll(cc,text,x+offset[0],y+offset[1],options);
}

function text_draw_button(cc,text,x,y,options) {

  var padding=options.padding;
  var border=options.border;
  var selected=options.selected;

  if(!padding) padding=2;
  if(!border) border=2;
  if(!selected) selected=false;

  var width=text_width(cc,text,x,y,options);
  var height=text_baseline_height(cc,text,x,y,options);
  var offset=text_align(cc,text,x,y,options);
  offset=[
    x+offset[0],
    y+offset[1]
  ];

  offset[0]-=padding+border;
  offset[1]-=padding+border;

  width+=padding*2+border*2;
  height+=padding*2+border*2;

  cc.fillStyle=prop.style.ui.fg;
  cc.fillRect(offset[0],offset[1],width,height);

  if(!selected) {
    cc.fillStyle=prop.style.ui.bg;
    cc.fillRect(offset[0]+border,offset[1]+border,width-border*2,height-border*2);
  }
  
  var style=options.style;
  if(!style) style="debug";

  if(selected) {
    if(style == "white")
      style="black";
    else if(style == "black")
      style="white";
  }
  options.style=style;
  text_draw(cc,text,x,y,options);

  var bounds=[offset[0],offset[1],width,height];
  return bounds;
}
