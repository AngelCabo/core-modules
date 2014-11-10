Template.map.helpers({
  bits: function() {
    return Bits.find();
  }
});


Template.map.rendered = function(){
  
  sound.play('welcome-v1.mp3');

    // Adds file uploading and adds the imageID of the file uploaded
    // to the arrayOfImageIds object.
    var Images = new FS.Collection("bitsImages", {
      stores: [new FS.Store.FileSystem("bitsImages", {path: "/public/assets/images"})]
    });
    
   var arrayOfImageIds = [];

    //var dropzone = new Dropzone("#dropzone", {
    //accept: function(file, done){

    //          Images.insert(file, function(err, fileObj){
    //    	if(err){
    //    	  alert("Error");
    //    	  console.log(err);
    //    	} else {
    //    	  // gets the ID of the image that was uploaded
    //    	  var imageId = fileObj._id;
    //    	  // do something with this image ID, like save it somewhere
    //    	  arrayOfImageIds.push(imageId);
    //    	  //Bit.insert({imageFile: file.name, x_position: 10, y_position: 210})
    //    	  console.log("WOULD BE CREATING NEW BIT YO");
    //    	  //var id = Bits.insert( { 
    //              //  content: '',
    //    	  //  filename: file.name,
    //              //  type: 'image', 
    //              //  color: 'white',
    //              //  position_x: 100, //event.pageX, 
    //              //  position_y: 100}); //event.pageY });
    //            };
    //        });
    //    }
    //});
};

Template.map.events({
  'dblclick .map': function (event, template){
    event.preventDefault();
    event.stopPropagation();

    console.log("bit:text:create");

    if(event.target.classList.contains('map')){
      var id = Bits.insert( { 
                  content: '',
                  type: 'text', 
                  color: 'white',
                  position_x: event.pageX, 
                  position_y: event.pageY });

      Session.set('bitEditingId', id);

    }
  }
  

});
