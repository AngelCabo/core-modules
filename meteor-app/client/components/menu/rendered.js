MeteorSettings.setDefaults({
  public: { options: { displayIntroAnimation: true } }
});


Template.menu.rendered = function() {

  console.log('menu rendered.');

  var screenWidth  = document.documentElement.clientWidth;
  var screenHeight = document.documentElement.clientHeight;

  // TODO: refactor all settings into Session obj
  console.log("Meteor.settings.public.options.displayIntroAnimation: ",
              Meteor.settings.public.options.displayIntroAnimation);

  // adapted from: http://codepen.io/GreenSock/pen/ramJGv
  // TODO:
  // 1) pull out into Animation class
  // 2) instead of making this part of the callback, can we have menu emit an event?
  var shimmerDisplayBits = function(){

    var delayMultiplier = 0.0005;
    var duration = 0.4;
    var shimmerTimeline = new TimelineMax();

    var elements = $(".map .bit");

    elements.each(function() {

      // Greensock applied transforms to position bits when OnRendered was called.
      // "translate3d(132px, 89px, 0px)"
      // we need the x/y position to pass to the Timeline obj to give a nice wipe/shimmer effect
      var cssTransform = this.style["transform"];
      var pattern = /[,();]|(px)|(em)|(rem)|(translate)|(matrix)|(3d)/gi;

      // slice + dice the string with a regexp to remove everything except
      // for number values. Split the string into an array.
      var array = _.words(cssTransform.replace(pattern, ''));
      var offset = parseFloat(array[0]) + parseFloat(array[1]);
      var delay = parseFloat(offset * delayMultiplier).toFixed(2);

      console.log("bit:shimmer:in: ", Utilities.getBitDataId(this), " : delay of ", delay );

      shimmerTimeline.fromTo(
        this,
        duration,
        { scale:0.95, ease:Expo.easeIn, opacity: 0,  display:'block' },
        { scale:1, ease:Expo.easeIn, opacity: 1,  display:'block' },
        delay
      );

    });

  };

  var timeline = new TimelineMax({
    onComplete: shimmerDisplayBits
  });

  function start () {
    var tlLoader     = setTimelineLoader();
    var tlGlobal     = new TimelineMax();

    tlGlobal.add(tlLoader);
    tlGlobal.play();
  };


  // adapted code from   : http://codepen.io/vdaguenet/pen/raXBKp
  function setTimelineLoader () {

    if (Meteor.settings.public.options.displayIntroAnimation) {

      var topToBottomLine  = $('.wipe.top-to-bottom .line');
      var maskTop          = $('.wipe.top-to-bottom .mask.top');
      var maskBottom       = $('.wipe.top-to-bottom .mask.bottom');

      var sideToSideLine   = $('.wipe.side-to-side .line');
      var maskLeft         = $('.wipe.load.side-to-side .mask.left');
      var maskRight        = $('.wipe.load.side-to-side .mask.right');

      TweenMax.set($('.wipe.load.side-to-side'), { alpha: 0 });

      timeline.fromTo(topToBottomLine, 0.4, { x: screenWidth }, { x: 0, ease: Circ.easeIn }, 0);
      timeline.fromTo(maskTop, 0.4, { y: 0 }, { y: -screenHeight / 2, ease: Expo.easeOut, delay: 0.1 }, 0.4);
      timeline.fromTo(maskBottom, 0.4, { y: 0 }, { y: screenHeight / 2, ease: Expo.easeOut, delay: 0.1 }, 0.4);
      timeline.set($('.wipe.load.top-to-bottom'), { alpha: 0, display: "none" });

      timeline.set($('.wipe.load.side-to-side'), { alpha: 1, display: "block"});
      timeline.fromTo(sideToSideLine, 0.4, { y: -screenHeight}, {y: 0, ease: Circ.easeIn});
      timeline.fromTo(maskRight, 0.4, { x: 0 }, {x: screenWidth / 2, ease: Expo.easeOut, delay: 0.1 }, 1.2); // 2.5
      timeline.fromTo(maskLeft, 0.4, { x: 0 }, {x: -screenWidth / 2, ease: Expo.easeOut, delay: 0.1 }, 1.2);
      timeline.set($('.wipe.load.side-to-side'), { alpha: 0, display: "none" });

    }

    else {
      $('.wipe.load').hide();
    }

    var menuBar = document.getElementById("menu-bar");
    timeline.to(menuBar, 1, { top:"0px", ease:Elastic.easeOut})

    return timeline;
  }

  start();

};

