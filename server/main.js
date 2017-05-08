import { Meteor } from 'meteor/meteor';

var ip = ()=>{
  Meteor.onConnection((conn)=>{
    return conn.clientAddress;
  });
};

Meteor.startup(() => {
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
    bucket: process.env.AWS_BUCKET,
    acl: "public-read",
    region : process.env.AWS_REGION,
    AWSAccessKeyId : process.env.AWS_ID,
    AWSSecretAccessKey : process.env.AWS_KEY,
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

Meteor.methods({
  sendVerificationMail :  () => {
    if(!Meteor.user().services.email){
      return Accounts.sendVerificationEmail(Meteor.userId());
    }else if(Meteor.user().services.email.verificationTokens.length > 0){
      throw new Meteor.Error('mail_sent', 'Ya hemos enviado un mail');
    }
    return Accounts.sendVerificationEmail(Meteor.userId());
  },
  checkRecaptcha: (captchaData) => {
      var verifyCaptchaResponse = reCAPTCHA.verifyCaptcha(ip(), captchaData);
      if (!verifyCaptchaResponse.success) {
          console.log('reCAPTCHA check failed!', verifyCaptchaResponse);
          throw new Meteor.Error(422, 'reCAPTCHA Failed: ' + verifyCaptchaResponse.error);
      } else{
        console.log('reCAPTCHA verification passed!');
        return true;
      }
  },
  deleteImage : (img) => {
    var object = img.split(".com/")[1];
    var s3 = new AWS.S3();
    var funs = Meteor.wrapAsync(s3.deleteObject,s3);
    try{
      var result = funs({Bucket: 'craft-work', Key : object});
      if(result.DeleteMarker){
        Meteor.users.update({_id: Meteor.userId},{ $set : {
          'profile.photo' : 'https://s3.us-east-2.amazonaws.com/craft-work/nouser.png'
        }},function(err){
          if(err)throw err;// Output error if registration fails
        });
      }
    }catch(err){
      throw err;
    }
  }
 });
