Template.post.helpers({
	owner : function(){
		var post = this.post;
		if(!post)return;
    Meteor.subscribe('userProf',post.user);
		var user = Meteor.users.findOne({_id:post.user});
		return user;
	},
	isProduct : function(){
		if(this.post.type == 'p')return true;
		return false;
	},
	ownerEmail : function(){
		var post = this.post;
		if(!post)return;
		Meteor.subscribe('userProf',post.user);
		var user = Meteor.users.findOne({_id:post.user});
		console.log(user.emails);
		return user.emails[0].address;
	}
});
