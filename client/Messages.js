const room = function(){
  var transmiter = Meteor.userId();
  var reciver = Router.current().params.id;
  console.log(rooms.findOne({$and : [ {users : transmiter},{users:reciver}]}));
  return rooms.findOne({$and : [ {users : transmiter},{users:reciver}]});
};

Template.messages.helpers({
  messages : function(){
    if(!room())return [];
    console.log(messages.find({room : room()._id}).fetch())
    return messages.find({room : room()._id}).fetch();
  },
  romi : function(){
    if(!room())return [];
    var query = {};
    query[Meteor.userId()] = true;
    query[Router.current().params.id] = true;
    Meteor.call('check',query);
    return rooms.findOne({ users : query});
  }
});

Template.newMessage.events({
  'click .btn-flat' : function(e){
    Meteor.call('createMessage',Router.current().params.id , $("#textarea").val());
  }
})
