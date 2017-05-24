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
