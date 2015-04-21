Inverter.register('map.events', {
  'dblclick .map': function (event) {
    console.log("bit:text:create");

    if(event.target.classList.contains('map')) {
      var id = Bits.insert({
        content: '',
        type: 'text',
        color: 'white',
        position_x: event.pageX,
        position_y: event.pageY
      });

      Session.set('bitEditingId', id);
    }
  }
});

Template.map.events(Inverter.get('map.events'));
