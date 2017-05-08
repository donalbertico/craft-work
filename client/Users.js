
const currentUser = function(){
  return Meteor.user();
}

const userEmail = function(){
  const user = Meteor.user();
  return user && user.emails && user.emails[0];
}


Template.register.events({
    'submit form': function(e){
       e.preventDefault();
       const form = e.target;
       if(form.password.value !== form.repeatPass.value)return Materialize.toast('Las contraseñas no concuerdan', 4000);
       var captchaData = grecaptcha.getResponse();
       Meteor.call('checkRecaptcha',captchaData,function(err,result){
         grecaptcha.reset();
         if(err)return Materialize.toast('Comprueba que no eres robot', 4000);
         Accounts.createUser({
            email : form.email.value,
            password : form.password.value,
            profile : {
              photo : 'https://craft-work.storage.googleapis.com/nouser.png'
            }
         },function(error){
              if(error)return Materialize.toast(error.reason, 4000); // Output error if registration fails
              Router.go('/account'); // Redirect user if registration succeeds
          });
       });
    }
});

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
