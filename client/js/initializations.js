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
