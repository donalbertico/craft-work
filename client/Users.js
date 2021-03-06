
const currentUser = function(){
  return Meteor.user();
};

const userEmail = function(){
  const user = Meteor.user();
  return user && user.emails && user.emails[0];
};

const userProfile = function(){
  return Meteor.users.findOne({_id : Router.current().params.id});
};

const userProfileEmail = function(){
  if(!userProfile())return '';
  return userProfile().emails[0].address;
};

const unSeenRooms = function(){
  var current = Meteor.userId();
  return rooms.find({$or : [{recivedA : current},{recivedB:current}]}).fetch();
};

const userServices = function(){
  return posts.find({type : 's' });
};

const userProducts = function(){
  return posts.find({type : 'p' });
};

const checkOnSale = function(section,value){
    return section == value;
}

Template.registerHelper('unSeenRooms',unSeenRooms);
Template.registerHelper('currentUser',currentUser);
Template.registerHelper('email',userEmail);
Template.registerHelper('userProfile',userProfile);
Template.registerHelper('userProfileEmail',userProfileEmail);
Template.registerHelper('userProducts',userProducts);
Template.registerHelper('userServices',userServices);
Template.registerHelper('checkOnSale',checkOnSale);
