Meteor.subscribe('rooms');
Meteor.subscribe('messages');
Meteor.subscribe('posts');
ShareIt.configure({
  sites: {                // nested object for extra configurations
      'facebook': {
          'appId': 206191793225691	// use sharer.php when it's null, otherwise use share dialog
      },
  },
  classes: "btn-flat", // string (default: 'large btn')
                        // The classes that will be placed on the sharing buttons, bootstrap by default.
  iconOnly: true,      // boolean (default: false)
                        // Don't put text on the sharing buttons
  applyColors: false,     // boolean (default: true)
                        // apply classes to inherit each social networks background color
  faSize: '',            // font awesome size
  faClass: ''		  // font awesome classes like square
});
window.fbAsyncInit = function() {
  FB.init({
    appId      : '206191793225691',
    status     : true,
    xfbml      : true,
    version    : 'v2.5'
  });
};
