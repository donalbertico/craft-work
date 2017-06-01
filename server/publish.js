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

Meteor.publish('userProfPosts',(id) => {
	return posts.find({user : id, publish : true});
});

Meteor.publish('userPosts',function(){
	return posts.find({user : this.userId});
});

Meteor.publish('post',(id)=>{
	return posts.find({_id : id});
});

Meteor.publish('postSearch',(criteria)=>{
  if(!criteria)return [];
  return posts.find({$text : {$search : criteria} , publish : true});
});

Meteor.publish('lastPosts',()=>{
  return posts.find({publish : true}, {sort: {$natural : -1}, limit: 3 });
});
