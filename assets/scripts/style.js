
function style_init() {
  prop.style={};

  prop.style.ui={};
  canvas_add_offscreen("noise");
  var cc=prop.canvas.contexts["noise"];
  style_draw_background(cc);
  prop.style.ui.bg="#222";
  prop.style.ui.fg="#fff";

}

function style_draw_background(cc) {
  var s=4;
  for(var x=0;x<prop.canvas.size.width/s;x++) {
    for(var y=0;y<prop.canvas.size.height/s;y++) {
      var value=Math.floor(crange(0,Math.random(),1,24,32));
      cc.fillStyle="rgb("+[value,value,value].join(",")+")"
      cc.fillRect(x*s,y*s,s,s);
    }
  }
}

