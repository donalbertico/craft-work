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
	},
	'click a.share' : function(e){
		FB.ui({
		  method: 'share',
		  href: 'https://craft-work-staging.herokuapp.com/post/'+e.target.id,
		}, function(response){});
	}
});
