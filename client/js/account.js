Template.account.helpers({
  section : function(){
    var hash = Router.current().params.hash;
    if(hash)return hash
    return 'userInfo';
  }
});
