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

Template.newMessage.onRendered(function(){
    var scroller = $('#messagesDiv');
    scroller.scrollTop(scroller.prop("scrollHeight"));
    console.log(scroller.scrollHeight);
    console.log(scroller.prop("scrollHeight"));
});
