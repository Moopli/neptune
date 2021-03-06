
window.AudioContext = window.AudioContext||window.webkitAudioContext;

(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
            window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
				       timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

var tiny=0.001;
var ptiny=0.001;
var pbig=0.01;

var sin_cache={};

function sin(v) {
    return(Math.sin(v));
    if(!v in sin_cache)
        sin_cache[v]=Math.sin(v);
    return(sin_cache[v]);
}

function cos(v) {
    return(sin(v+Math.PI/2));
}

function normalize(v,length) {
    var x=v[0];
    var y=v[1];
    var angle=Math.atan2(x,y);
    if(!length)
        length=1;
    return([
            sin(angle)*length,
            cos(angle)*length
    ]);
}

function floor(n) {
    return Math.floor(n);
}

function ceil(n) {
    return Math.ceil(n);
}

function rand() {
  return Math.random();
}

function randint(l,h) {
    return(Math.floor(Math.random()*(h-l+1))+l);
}

function elements(obj) {
  var n=0;
  for(var i in obj)
    n+=1;
  return n;
}

function s(i) {
    if(i == 1)
	return "";
    else
	return "s";
}

function within(n,c,r) {
    if((n > c+r) || (n < c-r))
        return false;
    return true;
}

function trimNewline(str){
  return str.replace(/^\n+|\n+$/g,"");
}
function trange(il,i,ih,ol,oh) {
    return(ol+(oh-ol)*(i-il)/(ih-il));
    i=(i/(ih-il))-il;
    return (i*(oh-ol))+ol;
}

function clamp(l,i,h) {
    if(h == null) {
        if(l > i)
            return l;
        return i;
    }
    var temp;
    if(l > h) {
        temp=h;
        h=l;
        l=temp;
    }
    if(l > i)
        return l;
    if(h < i)
        return h;
    return i;
}

function crange(il,i,ih,ol,oh) {
    return clamp(ol,trange(il,i,ih,ol,oh),oh);
}

function srange(il,i,ih,ol,oh) {
  i=Math.sin(trange(il,i,ih,-Math.PI/2,Math.PI/2))*0.5+0.5;
  return (i*(oh-ol))+ol;
}

function scrange(il,i,ih,ol,oh) {
  return srange(il,clamp(il,i,ih),ih,ol,oh);
}

function distance(a,b) {
    var x=a[0]-b[0];
    var y=a[1]-b[1];
    return Math.sqrt((x*x)+(y*y));
}

function degrees(radians) {
    return (radians/(Math.PI*2))*360;
}

function radians(degrees) {
    return (degrees/360)*(Math.PI*2);
}

function choose(l) {
    return l[Math.floor(Math.random()*l.length)];
}

function mod(x,y) {
  var z=x+0;
  x=x%y;
  if(x < 0)
    x=(y-x)-2;
  return x;
}

function round(n) {
  return Math.round(n);
}

function contains(list,value) {
  return list.indexOf(value) >= 0;
}

Math.PI2=Math.PI*2;

function step(n,steps) {
  if(steps == 0 || steps == null)
    return n;
  return Math.floor(n*steps)/steps;
}
