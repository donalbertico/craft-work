Template.profile.helpers({
  posts : function(){
    return posts.find({user : Router.current().params.id , publish : true});
  }
});
