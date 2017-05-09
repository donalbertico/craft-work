Template.login.events({
    'submit form.loginForm': function(e){
       e.preventDefault();
       const form = e.target;
       Meteor.loginWithPassword(form.email.value, form.password.value, function(error){
            if(error)return Materialize.toast(error.reason, 4000);
            Router.go('/account');
            $('#loginModal').modal('close');
       });
    },
    'click i.mdi' : function(e){
      loginFacebook();
    },
    'click a.forgot' : function(e){
      var collapsible = $('.collapsibleDiv');
      collapsible.toggle();
      if(collapsible.hasClass('bounceOutUp')){
        collapsible.removeClass('bounceOutUp');
        collapsible.addClass('bounceInDown');
      }else{
        collapsible.removeClass('bounceOutUp');
        collapsible.addClass('bounceInDown');
      }
    },
    'submit form.forgotPass' : function(e){
      e.preventDefault();
      console.log('send');
      Accounts.forgotPassword({email : e.target.email.value}, function(err){
        if(err)return Materialize.toast(err.reason, 4000);
        Materialize.toast('Revisa tu bandeja', 4000);
      });
    }
});

loginFacebook = function(){
  Meteor.loginWithFacebook({requestPermissions: ['public_profile', 'email']}, function(err){
      if (err)return Materialize.toast(err.reason, 4000);
      Router.go('/account');
      $('#loginModal').modal('close');
  });
}
