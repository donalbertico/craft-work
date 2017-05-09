
const currentUser = function(){
  return Meteor.user();
}

const userEmail = function(){
  const user = Meteor.user();
  return user && user.emails && user.emails[0];
}

Template.homeLayout.helpers({
  users : function(){
    return Meteor.users.find();
  }
});

Template.profile.helpers({
  user : function(){
    return Meteor.users.findOne({_id : Router.current().params.id});
  },
  email : function(){
    return user().emails[0].address;
  }
});


Template.registerHelper('currentUser',currentUser);
Template.registerHelper('email',userEmail);
