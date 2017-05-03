var autocomplete ;


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
      var uploader = new Slingshot.Upload("myFileUploads");

      console.log(form.photo.files[0]);
      uploader.send(form.photo.files[0], function (error, downloadUrl) {
        if (error) {
          // Log service detailed response.
          console.log(error);
          console.log(uploader.xhr);
          console.error('Error uploading', uploader.xhr.response);
          alert (error);
        }
        else {
          console.log(downloadUrl);
          // Meteor.users.update(Meteor.userId(), {$push: {"profile.files": downloadUrl}});
        }
      });
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
    }
});
