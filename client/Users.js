
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
       console.log(captchaData);
       Meteor.call('checkRecaptcha',captchaData,function(err,result){
         grecaptcha.reset();
         console.log(err);
         if(err)return Materialize.toast('Comprueba que no eres robot', 4000);
         Accounts.createUser({
            email : form.email.value,
            password : form.password.value,
            profile : {
              name : form.name.value
            }
         },function(error){
              if(error)return Materialize.toast(error.reason, 4000); // Output error if registration fails
              console.log('redirectinh')
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
      console.log('enviar mail');
      Meteor.call('sendVerificationMail',function(err,response){
        if(err)return Materialize.toast('Error al enviar mail', 4000);
        return Materialize.toast('Revisa tu bandeja de entrada', 4000);
      });
    }
});

Template.account.onRendered(function(){
   Materialize.updateTextFields();
});

Template.registerHelper('currentUser',currentUser);
Template.registerHelper('emailVerfified',emailVerfified);
