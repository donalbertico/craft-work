messages = new Mongo.Collection('messages');

messages.allow({
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

messages.schema = new SimpleSchema({
  user : {
    type : String,
    regEx: SimpleSchema.RegEx.Id
  },
  room:{
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  content : {
    type : String
  },
	createdAt : {
		type : Date
	},
	reciver : {
		type : String,
		regEx: SimpleSchema.RegEx.Id
	}
});

messages.after.insert(function(userId,doc){
	console.log(doc);
	console.log('cachiiiin new message');
	var room =  rooms.findOne({_id : doc.room});
	console.log(room);
	if(room.recivedA == doc.reciver || room.recivedB == doc.reciver)return;
	if(!room.recivedA)return rooms.update({_id : room._id},{$set : {recivedA : doc.reciver}});
	if(!room.recivedB)return rooms.update({_id : room._id},{$set : {recivedB : doc.reciver}});
});

Meteor.methods({
  createMessage : function(reciverId,text){
    var reciver = Meteor.users.findOne(reciverId);
    if(!this.userId || !reciver)throw new Meteor.Error('no_user', 'there is no users');
    var room = Meteor.call('verifyRoom', this.userId, reciverId);
    messages.insert({content : text, room : room, user : this.userId, createdAt : new Date(), reciver : reciverId});
  }
});
