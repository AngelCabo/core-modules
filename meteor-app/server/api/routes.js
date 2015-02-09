Router.route('/bits', function(){
  // console.log('################################################');
  // console.log(this.request.method);
  // console.log(this.request.headers);
  // console.log('this.params.postId: ' + this.params.postId);
  //
  // console.log('------------------------------');
  // console.log(this.request.body);
  // console.log('------------------------------');

  this.response.statusCode = 200;
  this.response.setHeader("Content-Type", "application/json");
  this.response.setHeader("Access-Control-Allow-Origin", "*");
  this.response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  if (this.request.method == 'GET') {
    //Statistics.update({_id: "configuration"},{$inc:{
    //  total_count: 1,
    //  list_count: 1
    //}});
    this.response.end(JSON.stringify(
      Bits.find({}, {fields: {'title':1, 'url': 1, 'type': 1}}).fetch()
    ));
  } else if (this.request.method == 'POST') {
    //Statistics.update({_id: "configuration"},{$inc:{
    //  total_count: 1,
    //  insert_count: 1
    //}});
    this.response.end(JSON.stringify(
      Bits.insert(this.request.body)
    ));
  } else if (this.request.method == 'OPTIONS') {
    this.response.setHeader("Access-Control-Allow-Methods", "POST, PUT, GET, DELETE, OPTIONS");
    this.response.end("OPTIONS Response");
  }
}, {where: 'server'});
