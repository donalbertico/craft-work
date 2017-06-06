var craftUploader = new Slingshot.Upload("craftPicUpolad");
var canDeleteDep = new Tracker.Dependency;
var progBarDep = new Tracker.Dependency;
var craftProgBarDep = new Tracker.Dependency;
var canDelete = false;
var uploadComplete = false;

Template.craftInfo.onRendered(function(){
  $('input#input_text, textarea#textarea1').characterCounter();
  this.autorun(function(c) {
    var user = Meteor.user();
    var craftMan = user && user.profile && user.profile.craft && user.profile.craft.name;
    if(user){
      if(!craftMan){
        $('#craft').removeClass('animated bounceInLeft');
        $('#craft').addClass('animated bounceOutLeft');
      }
      c.stop();
    }
  });
});

Template.craftInfo.helpers({
  uploadCraftProgress: function () {
    craftProgBarDep.depend();
    if(uploadComplete)return false;
    return Math.round(craftUploader.progress() * 100);
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

Template.craftInfo.events({
    'click a.crafterInfoButton': function(e){
      $('#crafterInfoFormButton').click();
    },

    'submit form#craftInfoForm': function(e){
      e.preventDefault();
      var form = e.target;
      console.log('yas');
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
          'profile.craft.instagram' : form.instagram.value,
          'profile.craft.facebook' : form.facebook.value,
        }},function(err){
          if(err)return Materialize.toast(err.reason, 4000); // Output error if registration fails
          Materialize.toast('Información actualizada');
        });
      }, 200);
    },

    'change input#craftPhotoInput' : function(e){
      uploadComplete = false;
      craftProgBarDep.changed();
      craftUploader.send(e.target.files[0], function (error, downloadUrl) {
        if (error) {
          console.error('Error uploading', craftUploader.xhr.response);
          alert (error);
          return Materialize.toast('Hubo un error al subir la imagen', 4000);
        }
        deleteImage();
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

    'click a.delete-craftPhoto' : function(e){
        deleteImage();
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

var deleteImage = function(){
  Meteor.call('deleteCraftImage',Meteor.user().profile.craft.photo,function(err){
    if(err)return Materialize.toast(err.reason, 4000);
    Materialize.toast('foto eliminada', 4000);
  });
}
