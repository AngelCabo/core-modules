makeBitDraggable = function makeBitDraggable($bitElement, $dragHandle){

  var timeline = new TimelineMax();
  var targets = $(".bit");
  var overlapThreshold = "0%"; 

  // // Needs to happen after position set, or else positions
  // // via manual transforms get overwritten by Draggable
  // // http://greensock.com/docs/#/HTML5/GSAP/Utils/Draggable
  var draggable = Draggable.create($bitElement, {
    trigger: $dragHandle,
    throwProps:false,
    zIndexBoost:false,
    autoScroll: 1,
    // bounds:,
    // edgeResistance:0.65,
    // type:"x,y", // default?

    onPress: function(event){
    
      // TODO: improve performance
      // use image asset instead of CSS shadow:
      // https://stackoverflow.com/questions/16504281/css3-box-shadow-inset-painful-performance-killer

      timeline
        .to($bitElement, 
          0.10, 
          {
            scale: 1.05,
            boxShadow: "rgba(0, 0, 0, 0.2) 0 16px 32px 0",
            ease: Expo.easeOut
        })
        .to($bitElement.find('.bit__drag-handle'), 0.1, { scale: 1.5, opacity: "0.1", ease: Expo.easeOut }), "-=0.10";
    },

    onRelease: function(event){
      timeline
        .to($bitElement, 0.1, { scale: 1, boxShadow: "0", ease: Expo.easeOut })
        .to($bitElement.find('.bit__drag-handle'), 0.1, { scale: 1, opacity: "1", ease: Expo.easeOut }), "-=0.10";
    },

    onDragStart:function(event){

      // var x = this.endX;
      // var y = this.endY;
      // Parallels.log.debug(event.type, " : dragStart: ", x, " : ", y, " : ", this.getDirection("start"), " : ");
      Parallels.Audio.player.play('fx-cinq-drop');

      // TODO: improve performance
      // use image asset instead of CSS shadow:
      // https://stackoverflow.com/questions/16504281/css3-box-shadow-inset-painful-performance-killer

      // TODO: ensure this happens only when in Draggable and mouse is held down
      // and not on regular taps/clicks of bit
      // timeline
      //   .to($bitElement, 0.20, {
      //     scale: 1.05,
      //     boxShadow: "rgba(0, 0, 0, 0.2) 0 16px 32px 0",
      //     ease: Expo.easeOut
      //   });

        // .to($bitElement.find('.bit__drag-handle'), 0.1, { scale: 1.5, opacity: "0.1", ease: Expo.easeOut })

        $bitElement.addClass('grabbing');
    },

    // TODO: restrict search to only what's visible in viewport, via Verge?
    onDrag: function(e) {
      for(var i = 0; i < targets.length; i++){
        if (this.hitTest(targets[i], overlapThreshold)) {
           $(targets[i]).addClass("bit--near");
         } else {
           $(targets[i]).removeClass("bit--near");
         }
      }
    },


    onDragEnd:function( event ) {

      var x = this.endX;
      var y = this.endY;

      // snap to nearest bit
      // via http://greensock.com/forums/topic/9265-draggable-snapping-to-specific-points-with-sensitivity/

      // TODO: only pick one, if multiple
      // snap to axis depending on if above/below center line, left/r from cross line
      // var snapMade = false;
      for(var i = 0; i < targets.length;i++){
        if(this.hitTest(targets[i], overlapThreshold)){
          var rect = $(targets[i])[0].getClientRects()[0];
          // snapMade = true;
          x = rect.left + rect.width;
          y = rect.top + rect.height;
        }
      }

      console.log('x:y: ', x, ':', y);
      TweenLite.to($bitElement, 0.1, { x: x, y: y, ease: Circ.easeOut });


      var mongoId = this.target.dataset.id;

      timeline.to(
        $bitElement,
        0.1,
        {
          scale: 1,
          boxShadow: "0",
          ease: Expo.easeOut
        }
      );

      Meteor.call('changeState', {
        command: 'updateBitPosition',
        data: {
          canvasId: Session.get('canvasId'),
          _id: mongoId,
          position: { x: x, y: y }
        }
      });

      // a random tone, in the mid-range of the scale
      Parallels.Audio.player.play('tone--aalto-dubtechno-mod-' + _.random(4, 8));

      timeline
        .to($bitElement, 0.1, { scale: 1, boxShadow: "0", ease: Expo.easeOut })
        .to($bitElement.find('.bit__drag-handle'), 0.05, { scale: 1, opacity: "1", ease: Expo.easeOut })

      $('.bit--near').removeClass("bit--near");
      $bitElement.addClass('grabbing');

    }


  });

  return draggable;
};
