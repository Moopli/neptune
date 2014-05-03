
var Content=function(options) {
  this.status="queue";
  this.url="";
  this.callback=null;
  this.type="json";
  this.tries=0;

  if(options) {
    if("url" in options) this.url=options.url;
    if("callback" in options) this.callback=options.callback;
    if("type" in options) this.type=options.type;
  }

  this.getJSON=function() {
    $.getJSON(this.url)
      .done(this.dl_done)
      .fail(this.dl_fail);
  };

  this.dl_done=function(data) {
    var that=get_queue_current(); // we better be in a queue
    that.status="done";
    if(that.callback)
      that.callback("ok",data);
    get_queue_check();
  };

  this.dl_fail=function(d,error) {
    var that=get_queue_current(); // we better be in a queue
    var retry=true;
    log("Failed to get "+that.url+": "+d.status,LOG_WARNING)
    if(that.tries > prop.get.retry.max) {
      if(that.callback)
        that.callback("fail",d);
      that.status="fail";
      get_queue_check();
    } else {
      setTimeout(function() {
        that.get(); // try again
      },prop.get.retry.time);
    }
  };

  this.get=function() {
    this.tries+=1;
    if(this.type == "json")
      this.getJSON();
    this.status="download";
  };

  get_queue_add(this);
};

function get_pre() {
  prop.get={};
  prop.get.queue=[];

  prop.get.retry={};
  prop.get.retry.max=120; // maximum number of retries
  prop.get.retry.time=5000; // retry every five seconds

  prop.get.current=-1;
}

function get_queue_current() {
  if(prop.get.current >= 0 && prop.get.current < prop.get.queue.length)
    return prop.get.queue[prop.get.current];
  return null;
}

function get_queue_check() {
  var current=get_queue_current();
  if(current && (current.status != "done" && current.status != "fail")) {
    return;
  } else {
    prop.get.current+=1;
    current=get_queue_current();
    current && current.get();
  }
}

function get_queue_add(content) {
  prop.get.queue.push(content);
  get_queue_check();
}
