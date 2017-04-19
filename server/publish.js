Meteor.publish('userList', function (){
  return Meteor.users.find({});
});

Meteor.publish('userProf', function (id){
  return Meteor.users.find({_id : id});
});
