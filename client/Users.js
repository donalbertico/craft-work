
const currentUser = function(){
  return Meteor.user();
}

const emailVerfified = function(){
  const user = Meteor.user();
  return user && user.emails && user.emails[0].verified;
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
              name : form.name.value
            }
         },function(error){
              if(error)return Materialize.toast(error.reason, 4000); // Output error if registration fails
              Router.go('/account'); // Redirect user if registration succeeds
          });
       });
    }
});

Template.login.events({
    'submit form': function(e){
       e.preventDefault();
       const form = e.target;
       Meteor.loginWithPassword(form.email.value, form.password.value, function(error){
            if(error)return Materialize.toast(error.reason, 4000);
            Router.go('/account');
       });
    }
});

Template.account.events({
    'click .verify': function(e){
      Meteor.call('sendVerificationMail',function(err,response){
        if(err)return Materialize.toast('Error al enviar mail', 4000);
        return Materialize.toast('Revisa tu bandeja de entrada', 4000);
      });
    },
    'click a.userInfoButton': function(e){
      $('#userInfoFormButton').click();
    },
    'click a.crafterInfoButton': function(e){
      $('#crafterInfoFormButton').click();
    },
    'submit form#userInfoForm': function(e){
      e.preventDefault();
      var form = e.target;
      Meteor.users.update({_id: Meteor.userId()},{ $set : {
        'profile.name' : form.name.value,
        'profile.lastName' : form.lastName.value
      }},function(err){
        if(err)return Materialize.toast(err.reason, 4000); // Output error if registration fails
        Materialize.toast('Información actualizada');
      });
    },
    'submit form#craftInfoForm': function(e){
      e.preventDefault();
      var form = e.target;
      Meteor.users.update({_id: Meteor.userId()},{ $set : {
        'profile.craft.name' : form.name.value,
        'profile.craft.city' : form.city.value,
        'profile.craft.address' : form.address.value,
      }},function(err){
        if(err)return Materialize.toast(err.reason, 4000); // Output error if registration fails
        Materialize.toast('Información actualizada');
      });
    },
});

Template.account.onRendered(function(){
  //  Materialize.updateTextFields();
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
Template.registerHelper('emailVerfified',emailVerfified);
