import { Meteor } from 'meteor/meteor';


  reCAPTCHA.config({
    privatekey: Meteor.settings.RECAPTCHA_KEY
  });

  AWS.config.update({
     accessKeyId: Meteor.settings.AWS_ID,
     secretAccessKey: Meteor.settings.AWS_KEY,
     region: Meteor.settings.AWS_REGION,
     s3_signature_version : 'v4'
  });

  ServiceConfiguration.configurations.remove({
      service: "facebook"
  });

  ServiceConfiguration.configurations.insert({
      service: "facebook",
      appId: Meteor.settings.FACEBOOK_ID,
      secret: Meteor.settings.FACEBOOK_SECRET
  });
