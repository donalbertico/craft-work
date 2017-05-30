Template.posts.helpers({
	checkOnSale : function(section,value){
		return section == value;
	}
});

Template.posts.events({
	'click a.delete' : function(e){
		Meteor.call('deletePost',e.target.id);
	}
});