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
    autoValue : function(){
      return this.userId;
    },
    regEx: SimpleSchema.RegEx.Id
  },
  room:{
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  content : {
    type : String
  }
});

Meteor.methods({
  createMessage : function(reciverId,text){
    var reciver = Meteor.users.findOne(reciverId);
    if(!this.userId || !reciver)throw new Meteor.Error('no_user', 'there is no users');
    var room = Meteor.call('verifyRoom', this.userId, reciverId);
    messages.insert({content : text, room : room});
  },

	check : function(obj){
		console.log(obj);
    console.log(rooms.findOne({ users : obj}));
	}
});
