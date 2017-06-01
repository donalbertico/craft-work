var tokenDep = new Tracker.Dependency;
var recoverToken;
Template.homeLayout.onRendered(function(){
  $('.modal').modal();
  if(this.data && this.data.recoverPassToken){
    $('#recoverPassModal').modal('open');
    recoverToken = this.data.recoverPassToken;
    tokenDep.changed();
  }
});

Template.homeLayout.helpers({
  tokenExpired : function(){
    tokenDep.depend();
    if(recoverToken)return ReactiveMethod.call('checkRecoverPassToken', recoverToken);
    return true;
  },
  lastProducts : function(){
    Meteor.subscribe('lastPosts');
    return posts.find({type : 'p'});
  }
});

Template.homeLayout.events({
  'submit form.recoverPass' : function(e){
    e.preventDefault();
    Accounts.resetPassword(recoverToken, e.target.password.value,function(err){
      if(err)return Materialize.toast(err.reason, 4000);
      $('#recoverPassModal').modal('close');
      Router.go('/account');
      Materialize.toast('Contraseña cambiada',4000);
    });
  },
  'mouseover a.register-button' : function(e){
    $('.register-button').addClass('teal accent-4');
    $('.register-button').removeClass('bordered');
  },
  'mouseout a.register-button' : function(e){
    $('.register-button').removeClass('teal accent-4');
    $('.register-button').addClass('bordered');
  }
});
