
function load_pre() {
  prop.load={};
  prop.load.done=false;
  prop.load.items={};
  prop.load.items.total=0;
  prop.load.items.done=0;
  prop.load.items.fraction=0;
}

var load_start=load_pre;

function load_item_add() {
  prop.load.items.total+=1;
}

function load_item_done() {
  prop.load.items.done+=1;
}

function load_init() {
  canvas_add("load");
  requestAnimationFrame(load_frame);
  canvas_resize();
}

function load_ready() {
  $("#load-canvas").fadeOut(1000);
  setTimeout(function() {
    load_remove();
  },1200);
}

function load_remove() {
  canvas_remove("load");
  prop.load.done=true;
}

function load_fraction() {
  if(prop.load.items.total == 0)
    return 0;
  var fraction=prop.load.items.done/prop.load.items.total;
//  fraction*=crange(0,prop.load.items.total,10,0.1,1);
//  fraction=Math.max(fraction,prop.load.items.fraction);
  prop.load.items.fraction=fraction;
  return fraction;
}

function load_frame() {
  if(prop.load.done == false) {
    requestAnimationFrame(load_frame);
    var cc=canvas_get("load");
    cc.imageSmoothingEnabled=false;
    cc.save();
    canvas_clear(cc);
    cc.scale(prop.canvas.scale,prop.canvas.scale);
    // fill whole canvas
    cc.fillStyle=prop.style.ui.bg;
    cc.fillRect(0,0,prop.canvas.size.width,prop.canvas.size.height);
    // calculate loading bar dimensions; borders are 2px
    var border=2;
    var width=Math.floor((prop.canvas.size.width*0.5)/2)*2; // make sure it's even
    var height=Math.max(Math.floor(width*0.01/2)*2,8); // height of inside bar
    var offset=[ // offset of outer border
      Math.floor(prop.canvas.size.width/2-width/2-border*2),
      Math.floor(prop.canvas.size.height/2-height/2-border*2)
    ];
    // draw loading bar outer border
    cc.fillStyle=prop.style.ui.fg;
    cc.fillRect(offset[0],offset[1],width+border*4,height+border*4);
    // draw loading bar trough
    cc.fillStyle=prop.style.ui.bg;
    cc.fillRect(offset[0]+border,offset[1]+border,width+border*2,height+border*2);
    // calculate width
    width*=load_fraction();
    width=Math.floor(width);
    // draw loading bar
    cc.fillStyle=prop.style.ui.fg;
    cc.fillRect(offset[0]+border*2,offset[1]+border*2,width,height);
    cc.restore();
  }
}

