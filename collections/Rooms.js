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
  users : {type: [String]},
	recivedA : {type : String},
	recivedB : {type : String}
});

Meteor.methods({
  verifyRoom : function(transmiter,reciver){
    var query = {$and : [ {users : transmiter},{users:reciver}]};
    var room = rooms.findOne({$and : [ {users : transmiter},{users:reciver}]});
    if(room)return room._id;
    var newRoom = rooms.insert({users : [transmiter,reciver]});
    return newRoom;
  },
	markAsSeen : function(transmiter,reciver){
		var room = rooms.findOne({$and : [{users : transmiter},{users:reciver}]});
		// var room = rooms.findOne({users : {in : [reciver,transmiter]}});
		if(room && room.recivedA == reciver)return rooms.update({_id : room._id},{$set : {recivedA : ''}});
		if(room && room.recivedB == reciver)return rooms.update({_id : room._id},{$set : {recivedB : ''}});
	}
});
