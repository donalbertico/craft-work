rooms = new Mongo.Collection('rooms');

rooms.allow({
	insert : function(){
		return true;
	},
	update : function(){
		return true;
	},
	remove : function(){
		return true;
	}
});

rooms.schema = new SimpleSchema({
  users : {type: [String]}
});

Meteor.methods({
  verifyRoom : function(transmiter,reciver){
    var query = {$and : [ {users : transmiter},{users:reciver}]};
    var room = rooms.findOne({$and : [ {users : transmiter},{users:reciver}]});
    console.log(room,query)
    if(room)return room._id;
    var newRoom = rooms.insert({users : [transmiter,reciver]});
    return newRoom;
  }
});
