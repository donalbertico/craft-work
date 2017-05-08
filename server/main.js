import { Meteor } from 'meteor/meteor';


Meteor.startup(() => {
  console.log(Meteor.settings);
  var ip;

  Meteor.onConnection(function(conn) {
    ip = conn.clientAddress;
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
});
