import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  console.log('a comenzado tio');
    console.log(Meteor.settings);
  Accounts.onCreateUser(function (options, user) {
      if (!user.services.facebook) {
          user.profile = {
            photo : "https://s3.us-east-2.amazonaws.com/craft-work/nouser.png"
          };
          user.craft = {};
          return user;
      }
      user.profile = {
        name : user.services.facebook.first_name,
        lastName : user.services.facebook.last_name,
        photo : user.services.facebook.picture,

      }
      user.emails = [{address: user.services.facebook.email , verified : true}];
      return user;
  });

  Slingshot.createDirective("userPicUpolad", Slingshot.S3Storage, {
    bucket: Meteor.settings.AWS_BUCKET,
    acl: "public-read",
    region : Meteor.settings.AWS_REGION,
    AWSAccessKeyId : Meteor.settings.AWS_ID,
    AWSSecretAccessKey : Meteor.settings.AWS_KEY,
    allowedFileTypes: ["image/png", "image/jpeg"],
    maxSize: 10 * 1024 * 1024,
    authorize: function () {
      if (!this.userId) {
        var message = "Please login before posting files";
        throw new Meteor.Error("Login Required", message);
      }
      return true;
    },
    key : function(file){
      return 'profile-'+this.userId;
    }
  });
});
