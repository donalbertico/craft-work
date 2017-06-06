Template.post.helpers({
	owner : function(){
		var post = this.post;
		if(!post)return;
		var user = Meteor.users.findOne({_id:post.user});
		return user;
	}
});
