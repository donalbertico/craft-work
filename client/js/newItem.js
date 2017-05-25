Template.productFirstForm.onRendered(function(){
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
    },
    secondaryPlaceholder: 'busca una etiqueta'
  });
});

Template.productFirstForm.helpers({
  selectedLabels : function(){
    labelsDep.depend();
    return labels
  }
});

Template.productFirstForm.events({
  'click a.btn' : function(e){
    var selectedLabels = $('.chips-autocomplete')[0].textContent.split('close');
    selectedLabels.pop();
    console.log('asdf',selectedLabels);
    $('.form-button').click();
  },
  'submit #postForm' : function(e){
    e.preventDefault();
    console.log();
  }
});

Template.itemType.events({
  'click a.btn-large' : function(e){
    console.log(e);
  }
});
