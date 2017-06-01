Template.homeLayout.onRendered(function(){
  $('.parallax').parallax();
  $('.slider').slider();
  $('.carousel.carousel-slider').carousel({fullWidth: true});
});

Template.mainLayout.onRendered(function(){
  $('.modal').modal();
  $(".button-collapse").sideNav();
  $('.dropdown-button').dropdown();
  $('.register-button').addClass('bordered');
});

Template.accountButtonTemplate.onRendered(function(){
   $('.dropdown-button').dropdown();
});

function messagesGet(){
  return messages.find();
}

Template.messages.onRendered(function(){
  this.autorun(_.bind(function(){
    var messages = messagesGet();
    messages.forEach(function(message){});
    Meteor.setTimeout(function(){
      var scroller = $('#messagesDiv');
      scroller.scrollTop(scroller.prop("scrollHeight"));
      $('.message-card').tooltip({delay: 50});
    }, 250);
  },this));
});

Template.productSecondForm.onRendered(function(){
  $('select').material_select();
});

Template.productThirdForm.onRendered(function(){
  $('.carousel').carousel();
  Materialize.updateTextFields();
});

Template.newPostForm.onRendered(function(){
  if(Router.current().params.type == 'p'){
    $('.chips-autocomplete').material_chip({
      autocompleteOptions: {
        data: {
          'accesorios': null,
          'joyas': null,
          'ropa': null,
          'camisetas': null,
          'alimentos': null,
          'bebidas' : null,
          'muebles' : null,
          'medicina' : null,
          'cuidado personal' : null
        },
        limit: Infinity,
        minLength: 1
      }
    });
  }else{
    $('.chips-autocomplete').material_chip({
      autocompleteOptions: {
        data: {
          'plomeria': null,
          'carpinteria': null,
          'joyeria': null,
          'tecnologia': null,
          'celulares': null,
          'computadoras' : null,
          'muebles' : null,
          'pintura' : null,
          'medicina' : null,
          'sfotware' : null,
          'musica' : null,
          'auditoria' : null
         },
        limit: Infinity,
        minLength: 1
      }
    });
  }
});

function postsGet(){
  return posts.find();
}

Template.post.onRendered(function(){
  Meteor.setTimeout(function(){
  $('.slider').slider();
  }, 500);
});

Template.search.onRendered(function(){
  $('select').material_select();
});
