var autocomplete ;
var userPic = 'https://s3.us-east-2.amazonaws.com/craft-work/nouser.png';
var uploader = new Slingshot.Upload("userPicUpolad");
var currentPhoto = function(){
  return Meteor.user().profile.photo;
}
// var pic = Meteor.user().profile.photo
Template.account.helpers({
  uploadProgress: function () {
    return Math.round(uploader.progress() * 100);
  }
});

Template.account.events({
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
        Materialize.toast('Información actualizada');
      });
    },

    'submit form#craftInfoForm': function(e){
      e.preventDefault();
      var form = e.target;
      setTimeout(function(){
        if(!form.placeId.value)return Materialize.toast('Vuelva a seleccionar la ciudad', 4000);
        Meteor.users.update({_id: Meteor.userId()},{ $set : {
          'profile.craft.name' : form.name.value,
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
          Materialize.toast('foto actualizada');
        });
      });
    },

    'click a.delete': function(e){
      console.log(currentPhoto())
      Meteor.call('deleteImage',currentPhoto(),function(response){
        if(response){
          console.log(response);
          // Meteor.users.update({_id: Meteor.userId()},{ $set : {
          //   'profile.photo' : 'https://craft-work.s3-us-east-2.amazonaws.com/nouser.png'
          // }},function(err){
          //   if(err)return Materialize.toast(err.reason, 4000); // Output error if registration fails
          //   Materialize.toast('foto actualizada');
          // });
        }
      });
    },
});
