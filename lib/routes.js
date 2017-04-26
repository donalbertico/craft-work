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

Router.route('/account',function(){
  this.render(checkUser('account'));
});

Router.route('/user/:id',function(){
  Meteor.subscribe('userProf',this.params.id);
  this.render(checkUser('profile'));
});

Router.route('/messages/:id',{
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

var checkUser = (route) => {
  if(!Meteor.userId()) return 'forbidden';
  return route;
}
