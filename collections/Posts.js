posts = new Mongo.Collection('posts');

posts.allow({
	insert : function(){
		return true;
	},
	update: function (userId, doc, fields, modifier) {
		console.log(userId,doc)
		if (userId && doc.user == userId) {
		  return true;
		}
	},
	remove : function(){
		return true;
	}
});

posts.schema = new SimpleSchema({
	user : {
		type : String,
		regEx: SimpleSchema.RegEx.Id
	},
	name : {
		type :String
	},
	description : {
		type : String
	},
	sale : {
		type : Object
	},
	photos : {
		type : [String]
	},
	labels : {
		type : [String]
	},
	publish : {
		type : Boolean
	},
	type : {
		type : String
	},
	createdAt : {
		type : Date
	}
});
