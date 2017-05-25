Meteor.publish('userList', function (){
  return Meteor.users.find({},{fields: {emails: 1, profile: 1,status:1}});
});

Meteor.publish('userProf', function (id){
  return Meteor.users.find({_id : id});
});

Meteor.publish('rooms',function (){
	return rooms.find();
});

Meteor.publish('messages',function (){
	return messages.find();
});

// Meteor.publish('rooms',function (){
// 	return rooms.find({room : {users : Meteor.userId()} });
// });
