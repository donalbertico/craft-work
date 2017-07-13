Template.homeTemplate.onRendered(function(){
  $('.parallax').parallax();
  $('.slider').slider();
  $('.carousel.carousel-slider').carousel({fullWidth: true});
});

Template.mainLayout.onRendered(function(){
  $('.modal').modal();
  $('.button-collapse').sideNav();
  $('.dropdown-button').dropdown();
  $('.register-button').addClass('bordered');
});

Template.homePageLayout.onRendered(function(){
  $('.modal').modal();
  $('.button-collapse').sideNav();
  $('.dropdown-button').dropdown();
  $('.register-button').addClass('bordered');
});

Template.account.onRendered(function(){
  $(".button-collapse").sideNav();
});

Template.messagesLayout.onRendered(function(){
  $(".button-collapse").sideNav();
});

Template.accountButtonTemplate.onRendered(function(){
   $('.dropdown-button').dropdown();
});

Template.searchLayout.onRendered(function(){
  $('.button-collapse').sideNav();
  $('.modal').modal();
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
          'cuidado personal' : null,
          'hogar y decoracion' : null,
          'arte' : null,
          'objetos de coleccion' : null,
          'impresion' : null,
          'fotografia' : null,
          'munecos y miniaturas' : null,
          'targetas personalizadas' : null,
          'costura' : null,
          'vidrio' : null,
          'esculturas' : null,
          'madera' : null
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
          'auditoria' : null,
          'fotografia' : null,
          'hogar y decoracion' : null,
          'arte' : null,
          'munecos y miniaturas' : null,
          'targetas personalizadas' : null,
          'tejido' : null,
          'vidrio' : null,
          'esculturas' : null
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

Template.searchLayout.onRendered(function(){
  $('select').material_select();
});

Template.forbidden.onRendered(function(){
  $('.parallax').parallax();
});

Template.registerView.onRendered(function(){
  $('.parallax').parallax();
});

Template.about.onRendered(function(){
  $('.parallax').parallax();
});

Template.terms.onRendered(function(){
  $('.parallax').parallax();
});

Template.faq.onRendered(function(){
  $('.parallax').parallax();
});
