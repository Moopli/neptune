
//////////////////////////////////////////////////////////////////////////////////////////

// all modules, prefix with "-" to signify library; <name>_init etc. won't be called
var MODULES=[
  "-util",
  "-animation",
  "get",
  "style",
  "font",
  "text",
//  "asset",
  "input",
  "game",
  "menu",
  "canvas",
  "load"
];

// saved as prop.version and prop.version_string
var VERSION=[0,0,5];

// are you using a main loop? (you must call update() afterward disable/reenable)
var UPDATE=true;

// the framerate is updated this often (seconds)
var FRAME_DELAY=1;
var RELEASE=false;

//////////////////////////////////////////////////////////////////////////////////////////

var async_modules={};
var async_done_callback=null;

var LOG_DEBUG=0;
var LOG_INFO=1;
var LOG_WARNING=2;
var LOG_ERROR=3;
var LOG_FATAL=4;

var log_strings={
  0:"DEBUG",
  1:"INFO ",
  2:"WARN ",
  3:"ERROR",
  4:"FATAL",
};

// PROP

function prop_init() {
  prop={};
  prop.version=VERSION;
  prop.version_string="v"+VERSION.join(".");
  prop.time={};
  prop.time.start=time();
  prop.time.frames=0;
  prop.time.frame={};
  prop.time.frame.start=time();
  prop.time.frame.delay=FRAME_DELAY;
  prop.time.frame.count=0;
  prop.time.frame.last=time();
  prop.time.frame.delta=0;
  prop.time.fps=0;
  prop.log=LOG_DEBUG;
  prop.loaded=false;
  if(RELEASE)
    prop.log=LOG_WARNING;
}

// MISC (DEBUG)

function log(s,level) {
  if(!level)
    level=LOG_INFO;
  if(prop.log <= level) {
    var text="[ "+log_strings[level]+" ]";
    if(level >= LOG_WARNING)
      console.warn(text,s); 
    else
      console.log(text,s); 
  }
}

// ASYNC (AJAX etc.)

function async(name) {
  async_modules[name]=false;
}

function async_loaded(name) {
  async_modules[name]=true;
  async_check();
}

function async_wait(callback) {
  async_done_callback=callback;
  async_check();
}

function async_check() {
  for(var i in async_modules) {
    if(async_modules[i] == false)
      return;
  }
  if(async_done_callback)
    async_done_callback();
}

// UTIL

function time() {
  return new Date().getTime()/1000;
}

function s(n,t,f) {
  if(!t) t="";
  if(!f) f="s";
  if(n == 1) return t;
  return f;
}

// MODULES

function load_module(name) {
  var filename;
  if(name[0] == "-") {
    modules[name].library=true;
    filename="assets/scripts/"+name.substr(1)+".js";
  } else {
    filename="assets/scripts/"+name+".js";
  }
  var el=document.createElement("script");
  el.src=filename;
  document.head.appendChild(el);
  el.onload=function() {
    modules[name].script=true;
    if(modules[name].library)
      log("Loaded library "+name.substr(1));
    else
      log("Loaded module "+name);
    for(var i in modules) {
      var m=modules[i];
      if(!m.script)
        return;
    }
    call_module("*","pre");
    resize();
    call_module("*","init");
    done();
  };
}

function load_modules() {
  // inserts each module's <script> into <head>
  for(var i in modules) {
    load_module(i);
  }
}

function call_module(name,func,args) {
  if(!args) args=[];
  if(name == "*") {
    for(var i=0;i<MODULES.length;i++)
      call_module(MODULES[i],func,args);
    return null;
  }
  if(name+"_"+func in window && name[0] != "-") {
    return window[name+"_"+func].apply(window,args);
  }
  return null;
}

$(document).ready(function() {
  modules={};
  for(var i=0;i<MODULES.length;i++) {
    modules[MODULES[i]]={
      library:false,
      script:false,
    };
  }
  prop_init();
  load_modules();
});

function done() {
  var e=time()-prop.time.start;
  e=e.toPrecision(2);
  log("Finished loading "+MODULES.length+" module"+s(MODULES.length)+" in "+e+"s");
  $(window).resize(resize);
  resize();
  call_module("*","done");
  async_wait(function() {
    prop.loaded=true;
    call_module("*","ready");
    if(UPDATE)
      requestAnimationFrame(update);
  });
}

function resize() {
  call_module("*","resize");
}

function update() {
  call_module("*","update");
  if(UPDATE)
    requestAnimationFrame(update);
  prop.time.frames+=1;
  prop.time.frame.count+=1;
  var elapsed=time()-prop.time.frame.start;
  if(elapsed > prop.time.frame.delay) {
    prop.time.fps=prop.time.frame.count/elapsed;
    prop.time.frame.count=0;
    prop.time.frame.start=time();
  }
  prop.time.frame.delta=Math.min(time()-prop.time.frame.last,0.9);
  prop.time.frame.last=time();
}

function delta() {
  return prop.time.frame.delta;
}
