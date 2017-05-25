var labels = [];
var labelsDep = new Tracker.Dependency;

Template.newItem.onRendered(function(){
  $('.chips-autocomplete').material_chip({
    autocompleteOptions: {
      data: {
        'accesorios': null,
        'joyas': null,
        'ropa': null,
        'camisetas': null
      },
      limit: Infinity,
      minLength: 1
    },
    secondaryPlaceholder: 'busca una etiqueta'
  });
});

Template.newItem.helpers({
  selectedLabels : function(){
    labelsDep.depend();
    return labels
  }
});

Template.newItem.events({
  'click a.btn' : function(e){
    console.log('asdf',$('.chips-autocomplete')[0].textContent);
    console.log('asdf',$('.chips-autocomplete')[0].textContent.split('close'));
    $('.form-button').click();
  },
  'submit #postForm' : function(e){
    e.preventDefault();
    console.log();
  }
});
