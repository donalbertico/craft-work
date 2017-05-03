import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  var ip;

  Meteor.onConnection(function(conn) {
    ip = conn.clientAddress;
  });

  process.env.MAIL_URL = 'smtp://atates@udlanet.ec:Cumbia1995@smtp.gmail.com:587';
  Slingshot.GoogleCloud.directiveDefault.GoogleSecretKey = Assets.getText('google-cloud-service-key.pem');
  Slingshot.GoogleCloud.directiveDefault.GoogleAccessId = '00b4903a9738d50444e878c677f8f6020888e5739550fdb397d6989a401d0fd4'

  reCAPTCHA.config({
    privatekey: '6LeVnB0UAAAAAPagjUcxOiitw6yPL56j5ncRuODX'
  });
  Slingshot.fileRestrictions("myFileUploads", {
    allowedFileTypes: ["image/png", "image/jpeg", "image/gif"],
    maxSize: 10 * 1024 * 1024 // 10 MB (use null for unlimited).
  });
  Slingshot.createDirective("myFileUploads", Slingshot.GoogleCloud, {
    bucket: "craft-work",

    acl: "public-read",

    authorize: function () {
      //Deny uploads if user is not logged in.
      if (!this.userId) {
        var message = "Please login before posting files";
        throw new Meteor.Error("Login Required", message);
      }

      return true;
    },

    key : function(){
      return ''
    }
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
    }
	});
});
