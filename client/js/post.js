Template.post.onRendered(function(){
});

Template.post.helpers({
	owner : function(){
		var post = this.post;
		Meteor.subscribe('userProf',post.user);
		if(!post)return;
		var user = Meteor.users.findOne({_id:post.user});
		return user;
	}
});
