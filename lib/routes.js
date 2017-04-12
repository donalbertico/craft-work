Router.configure({
  layoutTemplate: 'mainLayout'
});

Router.route('/',function(){
  this.render('homeLayout');
},{name: 'home'});

Router.route('/register',function(){
  this.render('register');
});

Router.route('/account',function(){
  this.render('account');
});

Router.route('/logout',function(){
  Meteor.logout(function(errr){
    console.log('saliendo',errr);
  });
  Router.go('home');
},{name:'logout'});
