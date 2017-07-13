var tokenDep = new Tracker.Dependency;
var recoverToken;
Template.homeTemplate.onRendered(function(){
  $('.modal').modal();
  if(this.data && this.data.recoverPassToken){
    $('#recoverPassModal').modal('open');
    recoverToken = this.data.recoverPassToken;
    tokenDep.changed();
  };
  if(this.data && this.data.confirmMailToken){
    Accounts.verifyEmail(this.data.confirmMailToken,function(err){
      if(err)return Materialize.toast('Error al verificar mail',4000);
      $('#comfirmedMailModal').modal('open');
    });
  }
});

Template.homeTemplate.helpers({
  tokenExpired : function(){
    tokenDep.depend();
    if(recoverToken)return ReactiveMethod.call('checkRecoverPassToken', recoverToken);
    return true;
  },
  lastProducts : function(){
    Meteor.subscribe('lastProducts');
    return posts.find({ type : 'p'});
  },
  lastServices : function(){
    Meteor.subscribe('lastServices');
    return posts.find({ type : 's'});
  },
  mine : function(){
    Meteor.subscribe('mine');
    return post.findOne();
  }
});

Template.homeTemplate.events({
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
  },
  'mouseover img.quick' : function(e){
    $(e.target).removeClass('opaque');
  },
  'mouseout img.quick' : function(e){
    $(e.target).addClass('opaque');
  }
});

Template.homePageLayout.onRendered(function(){
  $(window).on('scroll', function(e) {
    if($(this).scrollTop()>100){
      $('nav.main-nav').removeClass('transparent');
      $('nav.main-nav').addClass('colored');
    }else{
      $('nav.main-nav').removeClass('colored');
      $('nav.main-nav').addClass('transparent');
    }
  });
});
