import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  reCAPTCHA.config({
    privatekey: process.env.RECAPTCHA_KEY
  });

  AWS.config.update({
     accessKeyId: process.env.AWS_ID,
     secretAccessKey: process.env.AWS_KEY,
     region: process.env.AWS_REGION,
     s3_signature_version : 'v4'
  });

  ServiceConfiguration.configurations.remove({
      service: "facebook"
  });

  ServiceConfiguration.configurations.insert({
      service: "facebook",
      appId: process.env.FACEBOOK_ID,
      secret: process.env.FACEBOOK_SECRET
  });

  posts._ensureIndex({
    'name': 'text',
    'description' : 'text',
    'city' : 'text',
    'labels' : 'text'
  });
});
