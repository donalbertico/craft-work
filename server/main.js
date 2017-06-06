import { Meteor } from 'meteor/meteor';

var ip = ()=>{
  Meteor.onConnection((conn)=>{
    return conn.clientAddress;
  });
};

Meteor.startup(() => {
  Accounts.onCreateUser((options, user) => {
      var fbProfile = user.services.facebook;
      if (!fbProfile) {
          user.profile = {
            photo : "https://s3.us-east-2.amazonaws.com/craft-work/nouser.png",
            craft : {
              photo : "https://s3.us-east-2.amazonaws.com/craft-work/clem-onojeghuo-90396.jpg"
            }
          };
          return user;
      }
      user.profile = {
        name : fbProfile.first_name,
        lastName : fbProfile.last_name,
        craft : {
          photo : "https://s3.us-east-2.amazonaws.com/craft-work/clem-onojeghuo-90396.jpg"
        }
      }
      FBGraph.setAccessToken(fbProfile.accessToken);
      var getSync = Meteor.wrapAsync(FBGraph.get,FBGraph);
      try {
        var result = getSync('/'+fbProfile.id+'/picture',{height :'400', width :'400'});
        user.profile.photo = result.location || 'https://s3.us-east-2.amazonaws.com/craft-work/nouser.png';
      } catch (e) {
        user.profile.photo = 'https://s3.us-east-2.amazonaws.com/craft-work/nouser.png';
      }
      user.emails = [{address: fbProfile.email , verified : true}];
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
      return 'profile-'+this.userId+'-'+file.name;
    }
  });

  Slingshot.createDirective("craftPicUpolad", Slingshot.S3Storage, {
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
      return 'carft-'+this.userId+'-'+file.name;
    }
  });

  Slingshot.createDirective("postUpload", Slingshot.S3Storage, {
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
      return randomString()+'-'+file.name;
    }
  });
});

var randomString = ()=>{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 3; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text+'creaft';
}

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
          throw new Meteor.Error(422, 'reCAPTCHA Failed: ' + verifyCaptchaResponse.error);
      } else{
        return true;
      }
  },
  deleteImage : (img) => {
    var object = img.split(".com/")[1];
    var s3 = new AWS.S3();
    var deleteSync = Meteor.wrapAsync(s3.deleteObject,s3);
    try{
      var result = deleteSync({Bucket: 'craft-work', Key : object});
      if(result.DeleteMarker){
        Meteor.users.update({_id: Meteor.userId()},{ $set : {
          'profile.photo' : 'https://s3.us-east-2.amazonaws.com/craft-work/nouser.png'
        }},function(err){
          if(err)throw err;// Output error if registration fails
        });
      }
    }catch(err){
      return err;
    }
  },
  deleteCraftImage : (img) => {
    var object = img.split(".com/")[1];
    var s3 = new AWS.S3();
    var deleteSync= Meteor.wrapAsync(s3.deleteObject,s3);
    try{
      var result = deleteSync({Bucket: 'craft-work', Key : object});
      if(result.DeleteMarker){
        Meteor.users.update({_id: Meteor.userId()},{ $set : {
          'profile.craft.photo' : 'https://s3.us-east-2.amazonaws.com/craft-work/clem-onojeghuo-90396.jpg'
        }},function(err){
          if(err)throw err;// Output error if registration fails
        });
      }
    }catch(err){
      return err;
    }
  },
  checkRecoverPassToken : (token) => {
    var user = Meteor.users.findOne({'services.password.reset.token' : token});
    if(user) return false;
    return true;
  },
  deletePostImage : (post,img) =>{
    var object = img.split('.com/')[1];
    var s3 = new AWS.S3();
    var deleteSync = Meteor.wrapAsync(s3.deleteObject,s3);
    try{
      var result = deleteSync({Bucket: 'craft-work', Key : object});
      if(result.DeleteMarker){
        posts.update({_id: post},{ $pull : {
          photos : img
        }},function(err){
          if(err)throw err;// Output error if registration fails
        });
      }
    }catch(err){
      return err;
    }
  },
  deletePost : (post) => {
    var photos = posts.findOne({_id : post}).photos;
    var s3 = new AWS.S3();
    var deleteSync = Meteor.wrapAsync(s3.deleteObject,s3);
    for(var photo in photos){
      try{
        var object = photos[photo].split('.com/')[1];
        var result = deleteSync({Bucket: 'craft-work', Key : object});
      }catch(err){
        return err;
      }
    }
    posts.remove(post);
  },
  search : (criteria) => {
    var results = posts.find({$text : {$search : criteria} , publish : true});
    console.log(results.fetch());
    return 'hola';
  }
 });
