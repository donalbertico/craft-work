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
	},
	'click a.unPublish' : function(e){
		posts.update(e.target.id,{ $set : {publish : false} });
		Materialize.toast('Has dejado de publicar ',4000);
	},
	'click a.publishService': function(e){
		var post = posts.findOne(e.target.id);
		if(!post.paymentType) return Router.go('/account/service/'+e.target.id+'/priceInfo');
		if(!post.photos) return Router.go('/account/service/'+e.target.id+'/extraInfo');
		posts.update(e.target.id,{ $set : {publish : true} });
		Materialize.toast('Ahora esta publicado',4000);
	},
	'click a.publishProduct' : function(e){
		var post = posts.findOne(e.target.id);
		if(!post.price) return Router.go('/account/product/'+e.target.id+'/priceInfo');
		if(!post.photos) return Router.go('/account/product/'+e.target.id+'/photos');
		posts.update(e.target.id,{ $set : {publish : true} });
		Materialize.toast('Ahora esta publicado',4000);
	}
});
