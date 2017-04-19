import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  var ip;

  Meteor.onConnection(function(conn) {
    ip = conn.clientAddress;
  });

  process.env.MAIL_URL = 'smtp://atates@udlanet.ec:Cumbia1995@smtp.gmail.com:587';

  reCAPTCHA.config({
    privatekey: '6LeVnB0UAAAAAPagjUcxOiitw6yPL56j5ncRuODX'
  });

  Meteor.methods({
	  sendVerificationMail :  () => {
  		Accounts.sendVerificationEmail(Meteor.userId());
  		return ;
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
