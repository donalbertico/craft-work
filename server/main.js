import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  var ip;

  Meteor.onConnection(function(conn) {
    ip = conn.clientAddress;
  });

  process.env.MAIL_URL = 'smtp://atates@udlanet.ec:Cumbia1995@smtp.gmail.com:587';
  // Slingshot.GoogleCloud.directiveDefault.GoogleSecretKey = Assets.getText('google-cloud-service-key.pem');
  // Slingshot.GoogleCloud.directiveDefault.GoogleAccessId = 'gs-craft@analog-ship-166416.iam.gserviceaccount.com'

  reCAPTCHA.config({
    privatekey: '6LeVnB0UAAAAAPagjUcxOiitw6yPL56j5ncRuODX'
  });
  AWS.config.update({
     accessKeyId: 'AKIAIIIQICGVLDFOGNLQ',
     secretAccessKey: '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',
     region: 'us-east-2',
     s3_signature_version : 'v4'
  });


  // Slingshot.createDirective("userPicUpolad", Slingshot.GoogleCloud, {
  //   bucket: "craft-work",
  //   acl: "public-read",
  //   allowedFileTypes: ["image/png", "image/jpeg"],
  //   maxSize: 10 * 1024 * 1024,
  //   authorize: function () {
  //     if (!this.userId) {
  //       var message = "Please login before posting files";
  //       throw new Meteor.Error("Login Required", message);
  //     }
  //     return true;
  //   },
  //   key : function(){
  //     return 'profile-'+this.userId;
  //   }
  // });

  Slingshot.createDirective("userPicUpolad", Slingshot.S3Storage, {
    bucket: "craft-work",
    acl: "public-read",
    region : "us-east-2",
    AWSAccessKeyId : 'AKIAIIIQICGVLDFOGNLQ',
    AWSSecretAccessKey : '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',
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
      var verifyCaptchaResponse = reCAPTCHA.verifyCaptcha(ip, captchaData);
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
    console.log(deleteObject);
    var s3 = new AWS.S3();
    var deleteObject = Meteor.wrapAsync(
     s3.deleteObject({Bucket: 'craft-work', Key : 'profile-bjbTcChGmoPd3ziCx'}, function(error, data) {
        if(error) {
           console.log(error);
           Meteor.call('updateUser');
        } else {
           console.log(data);
           return false;
        }
     })
    );
  },

  updateUser : ()=>{
    conosole.log('yayay');
    Meteor.users.update({_id: Meteor.userId},{ $set : {
      'profile.photo' : 'https://craft-work.s3-us-east-2.amazonaws.com/nouser.png'
    }},function(err){
      if(err)return Materialize.toast(err.reason, 4000); // Output error if registration fails
      Materialize.toast('foto actualizada');
    });
  }
 });
