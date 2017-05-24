Router.configure({
  layoutTemplate: 'mainLayout'
});

Router.route('/',{
  name: 'home',
  template : 'homeLayout',
  subscriptions: function() {
    Meteor.subscribe('userList');
  },
  waitOn: function() {
      return Meteor.subscribe('userList');
  },
  data: function () {
    return Meteor.users.find({});
  },
  action: function () {
    // render all templates and regions for this route
    this.render();
  }
});

Router.route('/register',function(){
  this.render('register');
});

Router.route('/account/:section',function(){
  var section = this.params.section;
  this.layout('account');
  switch (section) {
    case 'info':
      this.render(checkUser('userInfo'),{to : 'section'});
      break;
    case 'newItem':
      this.render(checkUser('newItem'),{to : 'section'});
      break;
    default:
      this.render(checkUser('userInfo'),{to : 'section'});
  }
});
Router.route('/account',function(){
  Router.go('/account/userInfo');
});

Router.route('/user/:id',function(){
  Meteor.subscribe('userProf',this.params.id);
  this.render(checkUser('profile'));
});

Router.route('/messages/:id',{
  name: 'messageRoom',
  template : 'homeLayout',
  action: function () {
    // render all templates and regions for this route
    Meteor.call('markAsSeen',this.params.id,Meteor.userId());
    this.render(checkUser('messages'));
  }
});

Router.route('/messages',{
  name: 'messages',
  template : 'homeLayout',
  action: function () {
    // render all templates and regions for this route
    this.render(checkUser('messages'));
  }
});

Router.route('/logout',function(){
  Meteor.logout(function(errr){
    console.log('saliendo',errr);
  });
  Router.go('home');
},{name:'logout'});

Router.route('/reset-password/:token',function(){
  this.render('homeLayout',{data : { recoverPassToken : this.params.token}});
});

Router.route('/test',function(){
  this.render('test');
});

var checkUser = (route) => {
  if(!Meteor.userId()) return 'forbidden';
  return route;
}
