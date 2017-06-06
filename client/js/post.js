Template.post.onRendered(function(){
	var post = this.data.post;
	// $('<meta>', { property: 'og:type', content: 'website' }).appendTo('head');
	// $('<meta>', { property: 'og:image', content: post.photos[0] }).appendTo('head');
	// $('<meta>', { property: 'og:url', content: 'https://craft-work-staging.herokuapp.com/post/'+post._id }).appendTo('head');
	// $('<meta>', { property: 'og:title', content: post.name }).appendTo('head');
	// $('<meta>', { property: 'og:description', content: post.description}).appendTo('head');
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
