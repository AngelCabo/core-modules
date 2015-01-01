Template.clipper.rendered = function () {
  // on rendered
};

Template.clipper.events({

  "click button.cancel": function () {
    Messenger.send({event: "closeOverlay"});
  },

  "click button.submit": function () {
    //Messenger.send({event: "closeOverlay"});
    console.log('bit:created');
    Messenger.send({event: "closeOverlay"});
  }

  //"click .submit": function () {
  //  var url = Session.get("url");
  //  var admin = window.url("?admin");
  //  var reason = window.url("?reason");
  //  if (reason)
  //    reason = decodeURIComponent(reason);
  //
  //  $.blockUI();
  //  Meteor.call("reward", reward(), admin, reason, function (error, success) {
  //    $.unblockUI();
  //    Messenger.send({event: "closeOverlay"});
  //    if (error) {
  //      TL.error(EJSON.stringify(error), Modules.Reward);
  //      return;
  //    }
  //
  //    if (success)
  //      Messenger.send({event: "bountyRewarded"});
  //  });
  //},

  //"click .shouldPay": function (event) {
  //  var checkBox = $(event.srcElement);
  //  var row = checkBox.parents(".contributorRow");
  //
  //  var myReward = reward();
  //  var receiver = rowReceiver(myReward, row);
  //
  //  //if there is no reward set it to the minimum
  //  if (receiver._reward.eq(0))
  //    receiver.setReward(new Big(rewardMinimum()));
  //  //otherwise set the reward at the minimum
  //  else
  //    receiver.setReward(new Big(0));
  //
  //  //update the session
  //  updateReward(myReward);
  //}
});