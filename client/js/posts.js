Template.posts.helpers({
	noProducts : function(){
		if(posts.find({type : 'p' }).fetch().length != 0) return false;
		return true;
	},
	noServices : function(){
		if(posts.find({type : 's' }).fetch().length != 0) return false;
		return true;
	}
});

Template.posts.events({
	'click a.delete' : function(e){
		Meteor.call('deletePost',e.target.id);
	}
});
