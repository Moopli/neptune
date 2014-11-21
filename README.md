# Project Neptune

Early 2014, a [soundtrack](http://evanpattison.bandcamp.com/album/neptune) appeared on [reddit](http://www.reddit.com/r/MakeMyGame/comments/1uij0a/well_theres_always_this/) for a game that doesn't exist. This is a fork of an attempt to make Neptune something more than a soundtrack. All we're really starting with is an idea from Evan, the composer: "Neptune must traverse several treacherous environments and defeat the evil Dr. Musician to save the citizens of The City and his kidnapped love.", and a bunch of working code from zlsa. Everything else here so far will be my thoughts:

## Plot

Plot won't be important until we've nailed down most of our game mechanics

I really don't like the standard "save your girl from evil bad man" videogame premise, so I'm very interested in subverting this, or even using a different plot hook altogether (though that may get away from the original vision). 

Spitballing:
* From the song titles, we see that the love-scene song is named Bruno. So we can subvert "saving your girl" by having the person Neptune is rescuing be male (let's name him Bruno, for consistency with song). This isn't enough though.
* From the album list we can also see that the love theme is about midway through the game, and has another level select afterwards -- We can have Neptune meet Bruno midway through the game. Suddenly, the game isn't about rescuing Bruno anymore.
* Building on that, and considering that Dr. Musician is planning something nefarious in the City (musical mood-adjustment mind-control? This has so many possibilities for final-boss mechanics...); Bruno could be a headstrong/idealist type who ran off to save the citizens of the City, with Neptune coming behind to save Bruno, meeting halfway, and continuing onwards together. There, we've given our two protagonists some starting characterization, now we need to characterize Dr. Musician.
 

## Code

Much of this will be waiting on me having gone through the existing code in detail, but for starters:
* We need some extension to animation 
* We need physics
 * I'm thinking verlet pbd for its stability and speed
 * For collision, a quadtree for static geometry,
   * with a simple list for moving colliders at first.
    * Boss levels, and anything else with loads of flying bullets, will need something more, a spatial hash maybe. 
* Map generation will need some improvements so we can create smooth floor pieces, _including sloped_; as well as instantiating basic mobs. 
* Mobs takes us to figuring out an AI framework
 * some sort of trigger or FSM behaviour-switching system, probably;
 * but I'm partial to systems designed for collaboration of AI entities. 
 * We'd certainly need good enough AI for Bruno to hold his own, though.

## Art
* Something Megaman-like? Pixel retro is not necessary imo, and isn't any easier than other styles to do right, but that's the idea we're starting with, and there are a lot of free sprites available online. 
 * In case it isn't already clear though, I'm open to another art style
* I'd like a scrolling-parallax system for backgrounds in open areas -- very 3D, extremely pretty.
* A particle system (can be super-simple) will also come in handy

## Game Mechanics
* This is one of the biggest strengths of Megaman, and probably what Evan wants to see when he suggests Megaman as inspiration. Tight, easy to control, etc, just see sequelitis. 
* Interesting weapons and abilities
 * With upgrades! Like Cave Story maybe?
* Also considering Cave Story, we could have a branching level system
 * Though this makes level selection harder, adds a lot of game complexity, and shouldn't be tackled until the game is more mature.
