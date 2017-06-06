var autocomplete ;
var userPic = 'https://s3.us-east-2.amazonaws.com/craft-work/nouser.png';
var uploader = new Slingshot.Upload("userPicUpolad");
var craftUploader = new Slingshot.Upload("craftPicUpolad");
var canDeleteDep = new Tracker.Dependency;
var progBarDep = new Tracker.Dependency;
var craftProgBarDep = new Tracker.Dependency;
var canDelete = false;
var uploadComplete = false;

Template.userInfo.onRendered(function(){
  $('input#input_text, textarea#textarea1').characterCounter();
  this.autorun(function(c) {
    var user = Meteor.user()
    var craftMan = user && user.profile && user.profile.craft && user.profile.craft.name;
    if(user){
      if(!craftMan){
        $('#craft').removeClass('animated bounceInLeft');
        $('#craft').addClass('animated bounceOutLeft');
      }
      canDeleteDep.depend();
      c.stop();
    }
  });
});

Template.userInfo.helpers({
  uploadProgress: function () {
    progBarDep.depend();
    if(uploadComplete)return false;
    return Math.round(uploader.progress() * 100);
  },
  uploadCraftProgress: function () {
    craftProgBarDep.depend();
    if(uploadComplete)return false;
    return Math.round(craftUploader.progress() * 100);
  },
  actualDate : function(){
    return new Date();
  },
  canDelete : function(){
    canDeleteDep.depend();
    return canDelete;
  }
});

Template.userInfo.events({
    'click .verify': function(e){
      Meteor.call('sendVerificationMail',function(err,response){
        if(err)return Materialize.toast(err.reason, 4000);
        return Materialize.toast('Revisa tu bandeja de entrada', 4000);
      });
    },

    'click a.userInfoButton': function(e){
      $('#userInfoFormButton').click();
    },

    'submit form#userInfoForm': function(e){
      e.preventDefault();
      var form = e.target;
      Meteor.users.update({_id: Meteor.userId()},{ $set : {
        'profile.name' : form.name.value,
        'profile.lastName' : form.lastName.value,
        'profile.telephone' : form.telephone.value
      }},function(err){
        if(err)return Materialize.toast(err.reason, 4000); // Output error if registration fails
        Materialize.toast('Información actualizada',4000);
      });
    },

    'change input#picInput' : function(e){
      uploadComplete = false;
      progBarDep.changed();
      uploader.send(e.target.files[0], function (error, downloadUrl) {
        if (error) {
          console.error('Error uploading', uploader.xhr.response);
          alert (error);
          return Materialize.toast('Hubo un error al subir la imagen', 4000);
        }
        deleteImage();
        Meteor.users.update({_id: Meteor.userId()},{ $set : {
          'profile.photo' : downloadUrl
        }},function(err){
          if(err)return Materialize.toast(err.reason, 4000); // Output error if registration fails
          Materialize.toast('foto actualizada',4000);
          uploadComplete = true;
          progBarDep.changed();
        });
      });
    },

    'click .icon-delete' : function(e){
      deleteImage();
    },

    'mouseover div.img' : function(e){
      if(Meteor.user().profile.photo == 'https://s3.us-east-2.amazonaws.com/craft-work/nouser.png')return;
      canDelete = true;
      canDeleteDep.changed();
      $('.userPic').addClass('to-delete');
    },

    'mouseout div.img' : function(e){
      canDelete = false;
      canDeleteDep.changed();
      $('.userPic').removeClass('to-delete');
    }
});
var deleteImage = function(){
  Meteor.call('deleteImage',Meteor.user().profile.photo,function(err){
    if(err)return Materialize.toast(err.reason, 4000);
    Materialize.toast('foto eliminada', 4000);
  });
}
