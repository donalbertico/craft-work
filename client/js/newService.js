var currentPost;

Template.serviceFirstForm.onRendered(function(){
  var post = this.data.post;
  var selectedLabels = [];
  var labels = post.labels;
  for(var label in labels){
    selectedLabels.push({tag : labels[label]});
  };
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
      }
    },
    data:selectedLabels
  });
  Materialize.updateTextFields();
  currentPost = post;
});

Template.serviceFirstForm.events({
  'click a.btn-flat' : function(e){
    var autcomplete = $('.chips-autocomplete');
    selectedLabels = autcomplete[0].textContent.split('close');
    selectedLabels.pop();
    if(selectedLabels.length == 0){
      autcomplete.focus();
      return Materialize.toast('debes seleccionar almenos una etiqueta',4000);
    }
    $('.form-button').click();
  },
  'submit #postForm' : function(e){
    var form = e.target;
    e.preventDefault();
    posts.update({_id : currentPost._id},{$set : {name : form.name.value, description : form.description.value, labels : selectedLabels}});
    Router.go('/account/service/'+currentPost._id+'/priceInfo');
  }
});

Template.serviceSecondForm.onRendered(function(){
  var post = this.data.post;
  currentPost = post;
  var paymentType = $('#paymentType')[0];
  paymentType.value = post.paymentType||0;
  if(paymentType.value == 0){
    showHourFeeInput();
  }else {
    hideHourFeeInput();
  }
  $('select').material_select();
  currentPost = post;
});

Template.serviceSecondForm.events({
  'change select#paymentType' : function(e){
    if(e.target.value == 0){
      showHourFeeInput();
    }else{
      hideHourFeeInput();
    }
  },
  'click a.btn-flat' : function(){
    $('.form-button').click();
  },
  'submit form' : function(e){
    e.preventDefault();
    var form = e.target;
    if(form.paymentType.value == 0 && !form.hourFee.value) return Materialize.toast('debes proporcinar el valor');
    posts.update({_id : currentPost._id},{$set : { paymentType : form.paymentType.value , negotiable : form.negotiable.checked, hourFee : form.hourFee.value}});
    Router.go('/account/service/'+currentPost._id+'/extraInfo');
  }
});

showHourFeeInput = function(){
  var div = $('#hourPaymentDiv');
  div.show();
  div.removeClass('bounceOutLeft');
  div.addClass('bounceInLeft');
}

hideHourFeeInput = function(){
  var div = $('#hourPaymentDiv');
  div.removeClass('bounceInLeft');
  div.addClass('bounceOutLeft');
  setTimeout(function(){
    div.hide();
  }, 1000);
}
