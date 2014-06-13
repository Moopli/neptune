
var Music=function(options) {
  this.audio=null;
  this.name="";
  this.volume=new Animation({
    duration:0.5,
    value:0,
    start_value:0,
    end_value:1
  });

  if(options) {
    if("name" in options) this.name=options.name;
  }

  this.play=function() {
    this.volume.duration=0.8;
    if(this.name == "pause")
      this.volume.duration=2;
    this.volume.animate(1);
  };

  this.pause=function() {
    this.volume.duration=1;
    this.volume.animate(0);
  };

  this.update=function() {
    if(!this.audio)
      return;
    this.audio.volume=this.volume.get();
    if(!prop.music.enabled) this.audio.volume=0;
    if(this.audio.volume == 0 && this.audio.paused == false)
      this.audio.pause();
    else if(this.audio.volume > 0 && this.audio.paused)
      this.audio.play();
    this.audio.playbackRate=prop.game.speedup;
  };

  this.get=function() {
    var url=prop.music.url+this.name+".mp3";
    new Content({
      url:url,
      type:"audio",
      that:this,
      callback:function(status,data) {
        if(status == "ok") {
          this.audio=data;
          this.audio.loop=true;
        } else {
          log(arguments,LOG_FATAL);
        }
        async_loaded("music");
      }
    })
  };
};

function music_init() {
  prop.music={};
  prop.music.url="assets/audio/music/";

  prop.music.current=null;
  
  prop.music.enabled=true;
  prop.music.enabled=false;

  prop.music.tracks={};

  var tracks=[
    "city",
    "title",
    "grassland",
    "water",
    "train",
    "fire",
    "love",
    "concert",
    "electric",
    "level1",
    "level2",
    "end",
    "pause"
  ];

  for(var i=0;i<tracks.length;i++) {
    music_load(tracks[i]);
  }
//  music_load("city");
//  music_load("title");
//  music_load("grassland");
//  music_load("water");
//  music_load("train");
//  music_load("fire");
//  music_load("love");
//  music_load("concert");
//  music_load("electric");
//  music_load("level1");
//  music_load("level2");
//  music_load("end");
//  music_load("pause");
}

function music_ready() {
  music_switch("title");
}

function music_pause(track) {
  if(!track || track == "*") {
    for(var i in prop.music.tracks) {
      music_pause(i);
    }
  } else {
    prop.music.tracks[track].pause();
  }
}

function music_pause_all(track) {
  for(var i in prop.music.tracks) {
    if(i == track) continue;
    music_pause(i);
  }
}

function music_switch(track) {
//  log("Switching to "+track);
  music_pause_all(track);
  if(track in prop.music.tracks)
    prop.music.tracks[track].play();
}

function music_load(track) {
  setTimeout(function() {
    var music=new Music({name:track});
    prop.music.tracks[track]=music;
    async("music");
    music.get();
  },200);
}

function music_update() {
  var track="title"; // what _should_ be playing currently
  if(game_running()) {
    track=map_current().info.music;
  } else if(game_mode() == "start") {
    track="title";
  } else if(game_mode() == "load") {
    track=null;
  } else if(game_paused()) {
    track="pause";
  }
  if(track != prop.music.current) {
    music_switch(track);
    prop.music.current=track;
  }
  for(var i in prop.music.tracks) {
    prop.music.tracks[i].update();
  }
}
