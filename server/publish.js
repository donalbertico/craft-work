Meteor.publish('userProf', function (id){
  return Meteor.users.find({_id : id});
});

Meteor.publish('rooms',function (){
	return rooms.find();
});

Meteor.publish('messages',function (){
	return messages.find({$or : [{user : this.userId},{reciver : this.userId}]});
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

Meteor.publish('postSearch',(criteria,tags)=>{
  if(!criteria&&!tags){
    this.ready();
    return [];
  };
  var query = {publish : true};
  if(criteria) query['$text'] = {$search : criteria}
  if(tags) query['labels'] = {$in : tags}
  return posts.find(query);
});

Meteor.publish('lastPosts',()=>{
  return posts.find({publish : true}, {sort: {$natural : -1}, limit: 3 });
});

Meteor.publish('userList',()=>{
  return Meteor.users.find();
});
