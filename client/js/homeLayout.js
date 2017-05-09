var tokenDep = new Tracker.Dependency;
var recoverToken;
Template.homeLayout.onRendered(function(){
  console.log(this.data);
  $('.modal').modal();
  if(this.data.recoverPassToken){
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
  }
});

Template.homeLayout.events({
  'submit form.recoverPass' : function(e){
    e.preventDefault();
    console.log(e.target);
    console.log(e.target.password.valu);
    Accounts.resetPassword(recoverToken, e.target.password.value,function(err){
      if(err)return Materialize.toast(err.reason, 4000);
      $('#recoverPassModal').modal('close');
      Router.go('/account');
      Materialize.toast('Contraseña cambiada',4000);
    });
  }
});
