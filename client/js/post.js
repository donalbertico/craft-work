Template.post.helpers({
	owner : function(){
		var user = Meteor.users.findOne({_id:this.post.user});
		return user;
	},
	checkOnSale : function(section,value){
		return section == value;
	}
});