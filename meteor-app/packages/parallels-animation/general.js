Parallels.Animation.General = {

  shimmer: function(options){
  /*
      PURPOSE:
        Set up a timeline for revealing a collection of DOM elements,
        in a choreographed sequence, slightly staggered.

        Adapted from: http://codepen.io/GreenSock/pen/ramJGv
      -----------------------------------------------------------

      PARAMS:
        $elements: a collection of DOM elements to shimmer, $(".map .bit")
        paused: true | false
      -----------------------------------------------------------

      RETURNS: reference to Greensock timeline, for chaining or later play
      -----------------------------------------------------------

      TODO: only shimmer + play sounds for what is in the viewport
      -----------------------------------------------------------
    */

    var delayMultiplier = 0.0005;
    var duration = 0.4;
    var timeline = new TimelineMax({
      paused: false || options.paused
    });

    options.$elements.each(function() {

      $element = this;

      // Use the Greensock-applied transform values via "translate3d(132px, 89px, 0px)"
      // Use utility function to get position, as jQuery position wont work,
      // bc elements are currently not visible
      var position = Utilities.getTransformedPosition($element);

      // We need the x/y coordinates to pass to the Timeline obj,
      // which will use the distance between the bits to calc a delay offset
      // this delay offset is what gives it a nice wipe/shimmering effect
      var offset = parseFloat(position.top) + parseFloat(position.left);
      var delay = parseFloat(offset * delayMultiplier).toFixed(2);

      console.log("shimmer:in: ", Utilities.getBitDataId($element), " : delay of ", delay );

      /* TODO:
          calc a sound frequency to use as a parameter for the sound played
          Using the delay param we used above for the animation will tie
          the 2 together nicely
          var newFreq = Math.random() * 1000 + 1060;
          newFreq = newFreq * (delay + 100);  // TODO: lose precision, unecessary?
      */

      // console.log("sound freq for bit: ", newFreq, ". Animation delay: ", delay);
      // bitDragAudioInstance = Parallels.Audio.player.play('elasticStretch');
      // bitDragAudioInstance.set("elasticStretch.source.freq", newFreq);

      timeline.fromTo(
        $element,
        duration,
        {
          // from
          scale: 0.95,
          opacity: 0,
          ease: Expo.easeIn,
          display: 'block'
        },
        {
          // to
          scale: 1,
          opacity: 1,
          ease: Expo.easeIn,
          display: 'block',

          onComplete: function() {
            // TODO: vary this sound (pitch up?) after each iteration
            Parallels.Audio.player.play('fx-ting3');
          }
        },
        delay
      );

    });

    if (!options.paused){
      timeline.play();
    }

    return timeline;
  },

  cornerSparks: function(options){

  /*
    PURPOSE:
      Animate outward sparks, emitted from the center of each point.
      Sparks are choreographed to happen sequentially, with a slight overlap
    -----------------------------------------------------------

    DOCS:
      /private/docs/parallel-create-spark-animation-v1.png

      Sketch of sparks ordering, and accomponieng musical notes
    -----------------------------------------------------------

    OPTIONS/PARAMS:
      $element:   // jQuery object to the element to receive sparks
      prependTo:  // jQuery selector string, of DOM element to prepend the particles container to
    -----------------------------------------------------------

    TODO:
      * convert animations to use RequestAnimationFrame for better perf

      * experiment with using <canvas> instead of DOM, for better perf

      * include End function in here
    -----------------------------------------------------------
  */

    var destBitRect = options.$element[0].getClientRects()[0];
    var corners = [
      { x: parseInt(destBitRect.top),     y: parseInt(destBitRect.left),  freq: teoria.note('g2').fq() },
      { x: parseInt(destBitRect.top),     y: parseInt(destBitRect.right), freq: teoria.note('d2').fq() },
      { x: parseInt(destBitRect.bottom),  y: parseInt(destBitRect.left),  freq: teoria.note('c2').fq() },
      { x: parseInt(destBitRect.bottom),  y: parseInt(destBitRect.right), freq: teoria.note('a2').fq() }
    ];

    // TODO: set up Meteor.settings vars for map dimensions instead of hardcoding
    var particles = document.createElement('div');
    $(particles)
      .attr( "id", "corner-sparks--particles")
      .height( 5000 )
      .width( 5000)
      .prependTo(options.prependTo);

    var setupAndPlayCornerSpark = function(corner){
      // console.log("setupAndPlayCornerSpark: ", corner);

      var spark = new particleEmitter({
        onStartCallback: function(){
          // console.log("starting particleEmitter for corner: ", corner);
        },
        onStopCallback: function(){
          // console.log("ending particleEmitter for corner: ", corner);
        },
        container: '#corner-sparks--particles',
        image: 'images/ui/particle.gif',
        center: [ corner.y, corner.x ],
        size: 2,
        velocity: 450,
        decay: 500,
        rate: 600
      });

      spark.start()
      var handle = Meteor.setTimeout(function(){
        spark.stop();
      },
      100);
    }

    var tl = new TimelineMax({ paused:true });

    _.each(corners, function(corner, i) {
      var offsetDelay = i * 0.10;
      // console.log("count:", i, ":", corner, ", delayed: ", offsetDelay);
      tl.call(setupAndPlayCornerSpark, [ corner ], this, offsetDelay );
    });


    tl.play();

  }

}
