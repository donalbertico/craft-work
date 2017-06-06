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
              photo : 'https://s3.us-east-2.amazonaws.com/craft-work/nouser.png'
            }
         },function(error){
              if(error)return Materialize.toast(error.reason, 4000); // Output error if registration fails
              Router.go('/account'); // Redirect user if registration succeeds
          });
       });
    },
    'click a.facebook' : function(e){
      loginFacebook();
    },
    'click a.registerButton' : function(e){
      $('#formButton').click();
    }
});
