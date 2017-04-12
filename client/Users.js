
const currentUser = function(){
  console.log(Meteor.user());
  return Meteor.user();
}

Template.register.events({
    'submit form': function(e){
       e.preventDefault();
       const form = e.target;
       if(form.password.value !== form.repeatPass.value)return Materialize.toast('Las contraseñas no concuerdan', 4000)
       Accounts.createUser({
          email : form.email.value,
          password : form.password.value,
          profile : {
            name : form.name.value
          }
       },function(error){
            if(error)return Materialize.toast(error.reason, 4000); // Output error if registration fails
            Router.go('account'); // Redirect user if registration succeeds
        });
    }
});

Template.login.events({
    'submit form': function(e){
       e.preventDefault();
       const form = e.target;
       Meteor.loginWithPassword(form.email.value, form.password.value, function(error){
            if(error)return Materialize.toast(error.reason, 4000);
            Router.go('account'); 
       });
    }
});

Template.registerHelper('currentUser',currentUser);
