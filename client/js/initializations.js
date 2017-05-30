Template.homeLayout.onRendered(function(){
  $('.parallax').parallax();
  $('.slider').slider();
  $('.carousel.carousel-slider').carousel({fullWidth: true});
});

Template.mainLayout.onRendered(function(){
  $('.modal').modal();
  $(".button-collapse").sideNav();
  $('.dropdown-button').dropdown();
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
});

Template.newProductForm.onRendered(function(){
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
});

function postsGet(){
  return posts.find();
}

Template.post.onRendered(function(){
  this.autorun(_.bind(function(){
    var posts = postsGet();
    posts.forEach(function(message){});
    Meteor.setTimeout(function(){
    $('.slider').slider(); 
    }, 500);
  },this));
});

// Template.productFirstForm.onRendered(function(){
//   $('.chips-autocomplete').material_chip({
//     autocompleteOptions: {
//       data: {
//         'accesorios': null,
//         'joyas': null,
//         'ropa': null,
//         'camisetas': null,
//         'alimentos': null,
//         'bebidas' : null,
//         'muebles' : null,
//         'medicina' : null,
//         'cuidado personal' : null
//       },
//       limit: Infinity,
//       minLength: 1
//     }
//   });
// });