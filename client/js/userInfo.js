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
  canDelete : function(){
    canDeleteDep.depend();
    return canDelete;
  },
  canDeleteCraft : function(){
    canDeleteDep.depend();
    if(!Meteor.user())return false;
    return (Meteor.user().profile.craft&&Meteor.user().profile.craft.photo !== 'https://s3.us-east-2.amazonaws.com/craft-work/clem-onojeghuo-90396.jpg');
  },
  actualDate : function(){
    return new Date();
  },
  craftMan : function(){
    if(Meteor.user() && Meteor.user().profile.craft && Meteor.user().profile.craft.name)return true;
    return false;
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

    'click a.crafterInfoButton': function(e){
      $('#crafterInfoFormButton').click();
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

    'submit form#craftInfoForm': function(e){
      e.preventDefault();
      var form = e.target;
      Meteor.setTimeout(function(){
        if(!form.placeId.value)return Materialize.toast('Vuelva a seleccionar la ciudad', 4000);
        Meteor.users.update({_id: Meteor.userId()},{ $set : {
          'profile.craft.name' : form.name.value,
          'profile.craft.description' : form.description.value,
          'profile.craft.city' : form.city.value,
          'profile.craft.address' : form.address.value,
          'profile.craft.placeId' : form.placeId.value,
          'profile.craft.movil' : form.movil.value,
          'profile.craft.telephone' : form.telephone.value,
          'profile.craft.webPage' : form.webPage.value,
        }},function(err){
          if(err)return Materialize.toast(err.reason, 4000); // Output error if registration fails
          Materialize.toast('Información actualizada');
        });
      }, 200);
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

    'change input#craftPhotoInput' : function(e){
      uploadComplete = false;
      craftProgBarDep.changed();
      craftUploader.send(e.target.files[0], function (error, downloadUrl) {
        if (error) {
          console.error('Error uploading', uploader.xhr.response);
          alert (error);
          return Materialize.toast('Hubo un error al subir la imagen', 4000);
        }
        Meteor.users.update({_id: Meteor.userId()},{ $set : {
          'profile.craft.photo' : downloadUrl
        }},function(err){
          if(err)return Materialize.toast(err.reason, 4000); // Output error if registration fails
          Materialize.toast('foto actualizada',4000);
          uploadComplete = true;
          craftProgBarDep.changed();
        });
      });
    },

    'click .icon-delete' : function(e){
      Meteor.call('deleteImage',Meteor.user().profile.photo,function(err){
        if(err)return Materialize.toast(err.reason, 4000);
        Materialize.toast('foto eliminada', 4000);
      });
    },


    'click a.delete-craftPhoto' : function(e){
        Meteor.call('deleteCraftImage',Meteor.user().profile.craft.photo,function(err){
          if(err)return Materialize.toast(err.reason, 4000);
          Materialize.toast('foto eliminada', 4000);
        });
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
    },

    'load #switch' : function(e){
      console('loaded');
      console.log(e.target.checked)
    },

    'change input.switch' : function(e){
      console.log('click');
      var checked = e.target.checked;
      console.log(e.target.checked)
      if(checked){
        $('#craft').removeClass('animated bounceOutLeft');
        $('#craft').addClass('animated bounceInLeft');
      }else{
        $('#craft').removeClass('animated bounceInLeft');
        $('#craft').addClass('animated bounceOutLeft');
      }
    }
});
