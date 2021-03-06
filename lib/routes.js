Router.configure({
  layoutTemplate: 'mainLayout'
});

Router.route('/',{
  name: 'home',
  layoutTemplate: 'homePageLayout',
  template : 'homeTemplate',
  action: function () {

    Meteor.subscribe('lastPosts');
    this.render();
  }
});

Router.route('/register',function(){
  this.render('registerView');
});

Router.route('/account/:section',function(){
  var section = this.params.section;
  if(!Meteor.userId())return this.render('forbidden');
  this.layout('account');
  switch (section) {
    case 'info':
      this.render('userInfo',{to : 'section'});
      break;
    case 'newItem':
      if(!Meteor.user())return;
      if(!Meteor.user().emails[0].verified)return this.render('noInfo',{to:'section' , data : {miss : 'craftInfo'}});
      this.render('itemType',{to : 'section'});
      break;
    case 'posts':
      this.wait(Meteor.subscribe('userPosts'));
      this.render('posts',{to : 'section'});
    break;
    case 'craft':
      console.log(Meteor.user());
      if(!Meteor.user().profile.craft.name){
        this.render('craftOption',{to : 'section', currentUser : Meteor.user()});
      }else{
        this.render('craftInfo',{to : 'section', currentUser : Meteor.user()});
      }
    break;
    case 'craftInfo':
      this.render('craftInfo',{to : 'section', currentUser : Meteor.user()});
    break;
    default:
      this.render('userInfo',{to : 'section'});
  }
});

Router.route('/account/newItem/:type',function(){
  var type = this.params.type;
  if(!Meteor.userId())return this.render('forbidden');
  this.layout('account');
  if(!Meteor.user())return;
  if(!Meteor.user().profile.name || !Meteor.user().emails[0].verified)return this.render('noInfo',{to:'section' , data : {miss : 'craft'}});
  switch (type) {
    case 'p':
      this.render('newPostForm',{to : 'section'});
      break;
    case 's':
      this.render('newPostForm',{to : 'section'});
      break;
    default:
      Router.go('/account/newItem');
  }
});

Router.route('/account',function(){
  if(!Meteor.userId())return this.render('forbidden');
  this.layout('account');
  this.render(checkUser('userInfo'),{to : 'section'});
});

Router.route('/user/:id',function(){
  Meteor.subscribe('userProf',this.params.id);
  Meteor.subscribe('userProfPosts',this.params.id);
  this.render('profile');
});

Router.route('/messages/:id',function(){
    if(!Meteor.userId())return this.render('forbidden');
    if(!Meteor.user())return;
    if(!Meteor.user().profile.name || !Meteor.user().emails[0].verified){
      this.layout('account');
      return this.render('noInfo',{to:'section' , data : {miss : 'basicInfo'}});
    }
    this.layout('messagesLayout');
    Meteor.subscribe('userList');
    Meteor.call('markAsSeen',this.params.id,Meteor.userId());
    this.render('messages');
});

Router.route('/messages',function(){
    Meteor.subscribe('userList');
    this.layout('messagesLayout');
    this.render(checkUser('messages'));
});

Router.route('/logout',function(){
  Meteor.logout(function(errr){});
  Router.go('home');
},{name:'logout'});

Router.route('/reset-password/:token',function(){
  this.layout('mainP');
  this.render('homeTemplate',{data : { recoverPassToken : this.params.token}});
});

Router.route('/confirm-mail/:token',function(){
  this.layout('homePageLayout');
  this.render('homeTemplate',{data : { confirmMailToken : this.params.token}});
});

Router.route('/account/product/:id/:section',function(){
  if(!Meteor.userId())return this.render('forbidden');
  this.layout('account');
  if(!Meteor.user().emails[0].verified)return this.render('noInfo',{to:'section' , data : {miss : 'craftInfo'}});
  var section = this.params.section;
  Meteor.subscribe('userPosts');
  var post = posts.findOne({_id : this.params.id});
  if(!post) return this.render('homeLayout');
  switch(section){
    case 'basic':
      this.render('productFirstForm',{to : 'section', data : { post : post} });
    break;
    case 'priceInfo':
      this.render('productSecondForm',{to : 'section', data : { post : post} });
    break;
    case 'photos':
      this.render('productThirdForm',{to : 'section', data : { post : post} });
    break;
  }
});

Router.route('/account/service/:id/:section',function(){
  if(!Meteor.userId())return this.render('forbidden');
  this.layout('account');
  if(!Meteor.user().emails[0].verified)return this.render('noInfo',{to:'section' , data : {miss : 'craftInfo'}});
  var section = this.params.section;
  Meteor.subscribe('userPosts');
  var post = posts.findOne({_id : this.params.id});
  if(!post) return this.render('homeLayout');
  switch(section){
    case 'basic':
      this.render('serviceFirstForm',{to : 'section', data : { post : post} });
    break;
    case 'priceInfo':
      this.render('serviceSecondForm',{to : 'section', data : { post : post} });
    break;
    case 'extraInfo':
      this.render('productThirdForm',{to : 'section', data : { post : post} });
    break;
  }
});

Router.route('/post/:id',{
  waitOn : function(){
    return Meteor.subscribe('post',this.params.id);
  },
  data : function(){
    var post = posts.findOne();
    return {post : post};
  },
  action : function(){
    this.render('post');
  },
  onAfterAction : function(){
    var post = posts.findOne();
    if(!post) return;
    SEO.set({
     title: post.name,
     meta: {
       'description': post.description,
       'fb:app_id' : 206191793225691
     },
     og: {
       'title': post.name,
       'description': post.description,
       'image': post.photos[0],
       'type': 'website',
     }
   });
  }
});

Router.route('/search',function(){
  this.layout('searchLayout');
  this.render('search',{data : {params : this.params}});
},{name: 'search'});

Router.route('/about',function(){
  this.render('about');
},{name : 'about'});

Router.route('/terms',function(){
  this.render('terms');
},{name : 'terms'})

Router.route('/faq',function(){
  this.render('faq');
},{name : 'faq'})

var checkUser = (route) => {
  if(!Meteor.userId()) return 'forbidden';
  return route;
}
