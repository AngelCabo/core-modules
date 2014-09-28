
Template.bit.rendered = function() {

  var element = document.querySelector("[data-id='" + this.data._id + "']");
  element.classList.add(this.data.type);

  // http://greensock.com/docs/#/HTML5/GSAP/Utils/Draggable
  // Draggable.create(Template.instance().firstNode, {
  //   throwProps:true,
  //   zIndexBoost:false,
  //   onDragEnd:function( event ) {
  //     console.log("done dragging.");

  //     var x = event.pageX;
  //     var y = event.pageY;

  //     var mongoId = this.target.dataset.id;
  //     console.log(event.type + ": " + mongoId + " : " + x + " : " + y);
      
  //     Bits.update( mongoId , {
  //       $set: {
  //         "position_x": x,
  //         "position_y": y
  //       }
  //     });

  //     // showNotification("bit " + mongoId + " position saved: x: " + x + " y: " + y);
  //     return true;
  //   }
  // });

  console.log("Template.bit.rendered: " + this.data._id);
  console.log("Template.bit.rendered: " + element.data._id);
  
  /*
      exploring 4 ways to position bits from worst to best
      http://www.html5rocks.com/en/tutorials/speed/high-performance-animations
      ******************************************************

        1) layout positioning (worst) : 
                
                http://www.paulirish.com/2012/why-moving-elements-with-translate-is-better-than-posabs-topleft/
                position: absolute; top: 20px; left: 20px;
           

        2) 2D transforms: (better) :

                transform:  translate(150px,150px); # a single transform function

                ---- or -----
                
                matrix transform combines all the 2D transform functions 
                (translate, rotate, skew, scale), in the form of a 3×3 
                linear transformation matrix
                
                transform: matrix(1, 0, 0, 1, 150, 150); # only 6 values are used
                
                http://www.sitepoint.com/advanced-css3-2d-and-3d-transform-techniques
                http://www.eleqtriq.com/wp-content/static/demos/2010/css3d/matrix2dexplorer.html
                http://www.w3.org/TR/css3-transforms/#mathematical-description
            
        3) 3D transforms (even better):

              https://dev.opera.com/articles/understanding-3d-transforms
              https://desandro.github.io/3dtransforms/docs/introduction.html

                  transform: perspective( 600px );     # activate 3D

                  transform: rotate3d( tx, ty, tz )    # a single function in short form
                  ---- or -----
                  transform: rotateX( angle )          # a single function in long form
                  transform: rotateY( angle )
                  transform: rotateZ( angle )
              
              ----------- or --------------------
                 
                  combine all the 3D transform functions 
                  (translate, rotate, skew, scale), in the form of a 4×4 
                  linear transformation matrix:
            
                  transform: matrix3d(m00, m01, m02, m03,
                                      m10, m11, m12, m13,
                                      m20, m21, m22, m23,
                                      m30, m31, m31, m33)

                  https://dev.opera.com/articles/understanding-the-css-transforms-matrix
                  http://9elements.com/html5demos/matrix3d
                  http://www.eleqtriq.com/wp-content/static/demos/2010/css3d/matrix3dexplorer.html
                  http://www.senocular.com/flash/tutorials/transformmatrix

                  Any transform that has a 3D operation as one of its functions will trigger 
                  hardware compositing (GPU), even when the actual transform is 2D, or not doing 
                  anything at all (such as translate3d(0,0,0)). Note this is just current behaviour, 
                  and could change in the future (which is why we don’t document or encourage it). 
                  jsperf.com/webkitcssmatrix-vs-translate3d 



        4) Tween via Greensock (which uses 2D transforms under the hood).
           unless the Z is set to 0.1 on the element
           in which case Greensock will use Matrix3D
  */

  

  transformString =  "translate3d(" + this.data.position_x + "px, " + this.data.position_y + "px)";
  // element.style.webkitTransform = transformString;
  // element.style.MozTransform = transformString;
  // element.style.msTransform = transformString;
  // element.style.OTransform = transformString;
  element.style.transform = transformString;


  // other techniques
  // matrix = new WebKitCSSMatrix().translate(0,0,0);
  // http://css-tricks.com/controlling-css-animations-transitions-javascript/
  // var translated3D = new WebKitCSSMatrix(window.getComputedStyle(element, null).webkitTransform);
  // TweenLite.to(element, 2, {rotationX:45, scaleX:0.8, z:-300});





  this.find('.animation-hook')._uihooks = {

    insertElement: function(node, next) {
      // TODO: add a staggered fadeIn shimmer via Greensock
      console.log('about to insert bit');
      $(node).insertBefore(next);  
    },

    removeElement: function(node) {
      // TODO: add a staggered fadeOut shimmer via Greensock
      $(node).remove();
    }
  };


};


Template.bit.events({

  'mouseenter .bit': function (event, template){
    event.preventDefault();
    event.stopPropagation();

    if (event.target.classList.contains('bit')) {
      Session.set('bitHovering', template.data._id);
      console.log("bit:hover:in " + Session.get('bitHovering'));

      // TODO: shimmer on hover
      // TODO: scale
      // TweenLite.to(Template.instance().firstNode, 0.3, { left:"+=10px", ease:Elastic.easeOut});
      // var yoyo = myTimeline.yoyo(); //gets current yoyo state
      // myTimeline.yoyo( true ); //sets yoyo to true


    }
  },

  'mouseleave .bit': function (event, template){
    event.preventDefault();
    event.stopPropagation();

    if (event.target.classList.contains('bit')) {
      Session.set('bitHovering', '');
      console.log("bit:hover:out " + Session.get('bitHovering'));
    }
  },

  'dblclick .bit': function (event, template){
    event.preventDefault();
    event.stopPropagation();

    Session.set('bitEditing',this._id);
    console.log("bit:edit: " + Session.get('bitEditing'));

  },

  'keyup .bit': function (event, template){
    event.stopPropagation();
    event.preventDefault();

    // console.log('bit:key up: key code:' + event.which + ': ');

    if(event.which === 13){
      Bits.update( this._id , {
        $set: { "content": template.find('.editbit').value }
      });

      Session.set('bitEditing',null);
    }

    else if (event.which === 27) {
      console.log('escape key');
      Session.set('bitEditing', null);
    }
  }

});



Template.bit.isEditingThisBit = function() {
  return Session.equals('bitEditing', this._id);
};









