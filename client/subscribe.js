Meteor.subscribe('rooms');
Meteor.subscribe('messages');

window.fbAsyncInit = function() {
  FB.init({
    appId      : '206191793225691',
    status     : true,
    xfbml      : true
  });
};
