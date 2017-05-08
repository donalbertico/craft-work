Template.login.events({
    'submit form': function(e){
       e.preventDefault();
       const form = e.target;
       Meteor.loginWithPassword(form.email.value, form.password.value, function(error){
            if(error)return Materialize.toast(error.reason, 4000);
            Router.go('/account');
       });
    },
    'click i.mdi' : function(e){
      Meteor.loginWithFacebook({requestPermissions: ['public_profile', 'email']}, function(err){
          if (err)return Materialize.toast(err.reason, 4000);
      });
    }
});
