/*

  OQ: 
    * is timeline.kill() the best way to gracefully end heartbeat animation on escape?

    * is enter/exit for this mode intuitive? shouldnt it be three?
      1. enter   2. cancel  3.  complete?
 */

// OQ: Are these global vars?
// TODO: to move these into mode, as object properties?
var timeline, $originBit; // for Greensock heartbeat animation
var line, updatedLine, lineContainer, params, two, mouse, circle; // two.js vars, for parallel line drawing
var emitter; // for sparks animation
var renderer, texture, stage, sprite, rafHandle; // pixi.js vars, for remix slices

Parallels.AppModes['create-parallel'] = {

  enter: function () {
    log.debug("mode:create-parallel:enter");

    Session.set('currentMode', 'create-parallel');

    var originBitId = Session.get('bitHoveringId');
    Session.set('originBitId', originBitId);
    $originBit = Utilities.getBitElement(originBitId);
    var originBitData = Blaze.getData($originBit[0]);
    var originBitCenterX = originBitData.position.x + ($originBit[0].clientWidth / 2)
    var originBitCenterY = originBitData.position.y + ($originBit[0].clientHeight / 2)

    Parallels.KeyCommands.disableAll();
    Parallels.KeyCommands.bindEsc();

    // re-binding Shift, so if person hits it again,
    // we know they are have chosen a destination bit
    // and ready to commit this to the db/UI.
    Mousetrap.bind('shift', function (){
      log.debug("pressed 'Shift' key: looking to close parallel.");
      
      // get latest value of bit person is hovering over as destination bit.
      // this is expected to happen now that the origin has already been chosen
      var destBitId = Session.get('bitHoveringId'); 

      if (destBitId && (destBitId != originBitId)) {
      
        var $destBit = Utilities.getBitElement(destBitId);

        // stop heartbeat animation
        // TODO: after one cycle is done. reset to original size
        timeline.kill();

        $(window).off('mousemove');
        // stop drawing parallel line
        two.unbind('update');

        Session.set('destBitId', destBitId);
        log.debug(
          'closing parallel: source:', 
          originBitId, 
          " -> dest:", 
          destBitId
        );

        $('.create-parallel--line').remove();
        $originBit.removeClass('create-parallel--origin');
        

        /*  Play 4 corner spark animation, with sounds
          
            DOCS: 
            /private/docs/parallel-create-spark-animation-v1.png
        */

        var destBitRect = $destBit[0].getClientRects()[0];
        var corners = [

          { x: destBitRect.top,     y: destBitRect.left,  freq: teoria.note('g2').fq() },
          { x: destBitRect.top,     y: destBitRect.right, freq: teoria.note('d2').fq() },
          { x: destBitRect.bottom,  y: destBitRect.left,  freq: teoria.note('c2').fq() },
          { x: destBitRect.bottom,  y: destBitRect.right, freq: teoria.note('a2').fq() }
        ];

        // TODO: set up Meteor.settings vars for map dimensions instead of hardcoding
        var particles = document.createElement('div');
        $(particles)
          .attr( "id", "create-parallel--particles")
          .height( 5000 )
          .width( 5000)
          .prependTo(".map");

        var setupAndPlayCornerSpark = function(corner){
          log.debug("setupAndPlayCornerSpark: ", corner);

          var emitter = new particleEmitter({
            onStartCallback: function(){
              log.debug("starting particleEmitter for corner: ", corner);
            },
            onStopCallback: function(){
              log.debug("ending particleEmitter for corner: ", corner);
            },
            container: '#create-parallel--particles',
            image: 'images/ui/particle.gif',
            center: [ corner.y, corner.x ], 
            size: 4, 
            velocity: 450, 
            decay: 500, 
            rate: 600
          });

          emitter.start()
          var handle = Meteor.setTimeout(function(){
            emitter.stop();
          },
          100);          
        }

        var tl = new TimelineMax({ paused:true });

        _.each(corners, function(corner, i) {
          var offsetDelay = i * 0.10;
          // log.debug("count:", i, ":", corner, ", delayed: ", offsetDelay);
          tl.call(setupAndPlayCornerSpark, [ corner ], this, offsetDelay );
        });


        tl.play();



        // TODO: call neo4j save


        // query Neo4j for image bits that are connected, by X number of hops

        // slice + dice images in collection
        // use these slices to fast / cycle / shimmer across these pieces as a wave

        // adapted from: 


        if (!renderer){

          var viewportWidth  = verge.viewportW();
          var viewportHeight = verge.viewportH();

          renderer = PIXI.autoDetectRenderer(
            viewportWidth, 
            viewportHeight,
            { 
              view: document.getElementById("create-parallel--remix-splices"),
              transparent: true, 
              backgroundColor : 0x1099bb,
              antialias: true
            }
          );

          log.debug("created pixi renderer: ", renderer);

          stage = new PIXI.Container(); // create the root of the scene graph
          texture = PIXI.Texture.fromImage('/images/1000/mine_williamsburg_lampost_highway_dusk_dawn_sky_meloncholy_5077-cropped.jpg');
          sprite = new PIXI.Sprite(texture);

          // // center the sprite's anchor point
          sprite.anchor.x = 0.5;
          sprite.anchor.y = 0.5;

          // // move to center
          sprite.position.x = viewportWidth / 2;
          sprite.position.y = viewportHeight / 2;

          stage.addChild(sprite);
          renderer.render(stage);

          // https://stackoverflow.com/questions/22742239/accessing-texture-after-initial-loading-in-pixi-js        
          // start animating
          animate();

          function animate() {
              rafHandle = requestAnimationFrame(animate); // recursively calls itself?
              sprite.rotation += 0.1;
              renderer.render(stage);
          }

          // assign to map template so we can access for debugging, outside of this scope
          // TODO: is this assigning a reference, or actually making a full copy of this object?
          Utilities.getMapTemplate().pixiInstance = {
            stage: stage,
            renderer: renderer,
            texture: texture,
            sprite: sprite,
            rafHandle: rafHandle
          };


        }

        else {
          log.debug("pixi renderer already exists: ", renderer);
        };

              
        // TODO: line up renderer to overlap with image.

        // hide DOM image

        // animate 



        // show form so person can define relationship
        // -- bind escape rids form, create-parallel mode
        // -- Later: autocomplete from collection of parallel types

        // play yay sound, connection stamp/re-enforcing/"hardening" animation 
        // not sure what this means yet

        // Session.set('isDrawingParallel', null);
        // Session.set('originBitId', null);

      }

    });


    log.debug("ready for creating parallel. starting at bit: " + originBitId);

    // TODO: abstract out into reusable mode concept.
    // here, it might be : enterMode.createParallel()
    $(".map").addClass('mode--create-parallel'); // visually demonstrate we're in connecting mode

    // TODO: animate
    $originBit.addClass('create-parallel--origin');

    // TODO:
    // try bg overlay over other bits too?

    // ****************** RENDER LINE *************
    // set up an SVG container via two.js container to draw the line stroke
    lineContainer = document.createElement('div');
    $(lineContainer)
      .addClass("create-parallel--line")
      .height( 5000 )
      .width( 5000)
      .prependTo(".map");

    params = { 
      fullscreen: true,
      autostart: true
    };

    two = new Two(params).appendTo(lineContainer);
    mouse = new Two.Vector();

    // OQ: should we use Meteor binding? 
    // https://stackoverflow.com/questions/21486667/meteor-js-how-should-i-bind-events-to-the-window-in-meteor
    $(window).on('mousemove', function(event){
      mouse.x = verge.scrollX() + event.clientX;
      mouse.y = verge.scrollY() + event.clientY
    });    

    circle = two.makeCircle(
      originBitCenterX,  
      originBitCenterY, 
      2 // width
    );

    circle.noStroke().fill = 'blue';

    // By passing the circle.translation into the origin 
    // two.js automatically data binds the line (via Backbone
    // underneath it's hood). Whenever the data properties for 
    // circle updates in .bind below, the line destination data
    // (as an anchor/vector), updates too
    // https://github.com/jonobr1/two.js/issues/133
    var line = new Two.Polygon([
            circle.translation, // origin
            new Two.Vector(originBitCenterX, originBitCenterY)
        ]);

    line.noFill().stroke = 'yellow';
    line.linewidth = 7;
  
    two
      .add(line)
      .bind('update', function(frameCount) {
        circle.translation.set(mouse.x, mouse.y);

        // TODO: the longer the distance, the thinner the linewidth
        
        // TODO: depending on direction on direction parallel is pointing,
        // addClass(left);

        // TODO: stretch sound, bind to flocking

      });
    // ****************** RENDER LINE *************


    // ****************** HEARTBEAT ANIMATION *************
    var timelineStart = function () {
      log.debug('bit:parallel:create. Origin bit' + originBitId + ': selected-loop animation starting ...');
      // TODO: play sound indicating origin start, jeopardy jingle??
    };

    var timelineDone = function( bitOriginId ){
      log.debug('bit:parallel:create. End mode, origin bit' + bitOriginId + ': selected-loop animation ending.');
    };

    timeline = new TimelineMax({
      onStart: timelineStart,
      onComplete: timelineDone,
      onCompleteParams:[ originBitId ],
      repeat: -1
    });

    timeline
      .to($originBit, 0.50, { scale: 1.05, ease:Expo.easeOut } )
      .to($originBit, 0.5, { scale: 1, ease:Expo.easeOut } );
    // ****************** HEARTBEAT ANIMATION *************

  },

  exit: function () {
    log.debug("mode:create-parallel:exit");
    
    if (Session.get('currentMode')) {
      Session.set('currentMode', null);
      Session.set('originBitId', null);
      Session.set('destBitId', null);

      $(".map").removeClass('mode--create-parallel');
      $originBit.removeClass('create-parallel--origin');

      $('.create-parallel--line').remove();
      $('#create-parallel--particles').remove();

      // stop heartbeat animation
      timeline.kill();

      $(window).off('mousemove');
      // stop drawing parallel line
      two.unbind('update');

      // TODO: properly garbage collect these objects
      // reset vars for next create-parallel use
      lineContainer, params, two, mouse, updatedLine, line, circle = null;

      // stop pixi webgl loop
      cancelAnimationFrame(Utilities.getMapTemplate().pixiInstance.rafHandle);
      
      // destroy all pixi.js objects + references
      // TODO: clear whatever is on the stage before destroying all references
      renderer.destroyTexture(texture);
      renderer.destroy();
      texture.destroy();
      renderer, texture, sprite = null;

      // reenable scrolling
      $("body").css( "overflow", "visible"); 
      $("body").css( "position", "static"); 

      // put key commands back to normal
      Parallels.KeyCommands.bindAll();
    }
  }
};
