var lastSearch;
var routeQuery = {};
var resultDep = new Tracker.Dependency;


Template.search.helpers({
  loading : function(){
    var query = Router.current().params.query;
    return Meteor.subscribe('postSearch',query.criteria,query.labels).ready();
  },
  query : function(){
    routeQuery = Router.current().params.query;
    return routeQuery;
  },
  lastSearch : function(){
    var query = {};
    switch(routeQuery.type){
      case '1':
        query['type']='p';
      break;
      case '2':
        query['type']='s';
      break;
    }
    if(routeQuery.labels)query['labels'] = { $in : routeQuery.labels};
    if(routeQuery.onSale)query['$or']=[{onSale : '1'},{onSale : '2'}];
    if(routeQuery.shipping)query['shippingIncluded']=true;
    if(routeQuery.negotiable)query['negotiable']=true;
    if(routeQuery.city)query['city']=routeQuery.city;
    lastSearch = posts.find(query);
    resultDep.changed();
    return lastSearch;
  },
  noResults : function(){
    resultDep.depend();
    if(lastSearch){
      if(lastSearch.fetch().length > 0) return false;
    };
    return true;
  }
});

Template.search.events({
  'submit form.search-form' : function(e){
    e.preventDefault();
    routeQuery['criteria'] = e.target.searchInput.value;
    var uri = '/search?'+$.param(routeQuery);
    Router.go(uri,{replaceState: true});
  }
});

Template.searchLayout.onRendered(function(){
  var labels = routeQuery.labels;
  var selectedLabels = [];
  for(var label in labels){
    selectedLabels.push({tag : labels[label]});
  };
  initChipsAutoComplete(selectedLabels);
  $('#typeSelect')[0].value = routeQuery.type;
  $('select').material_select();
});

Template.searchLayout.helpers({
  query : function(){
    routeQuery = Router.current().params.query;
    switch (routeQuery.type) {
      case '1':
        routeQuery.onlyProducts = true;
        break;
      case '2':
        routeQuery.onlyServices = true;
        break;
    }
    return routeQuery;
  },
});

Template.searchLayout.events({
  'click a.filters-search' : function(e){
    $('.filters-form-button').click();
  },
  'click a.nav-filters-search' : function(e){
    $('.nav-filters-form-button').click();
  },
  'submit form.nav-filters-form' : function(e){
    e.preventDefault();
    var form = e.target;
    var autcomplete = $('.nav-chips-autocomplete');
    var selectedLabels = autcomplete[0].textContent.split('close');
    selectedLabels.pop();
    routeQuery = { criteria : routeQuery.criteria};
    if(selectedLabels.length != 0)routeQuery['labels'] = selectedLabels;
    if(form.onlyServices.checked&&!form.onlyProducts.checked)routeQuery['type'] = '2';
    if(form.onlyProducts.checked&&!form.onlyServices.checked)routeQuery['type'] = '1';
    if(form.onSale.checked)routeQuery['onSale'] = true;
    if(form.shipping.checked)routeQuery['shipping'] = true;
    if(form.negotiable.checked)routeQuery['negotiable'] = true;
    if(form.city.value)routeQuery['city'] = form.city.value;
    Router.go('/search?'+$.param(routeQuery),{replaceState: true});
  },
  'submit form.filters-form' : function(e){
    e.preventDefault();
    var form = e.target;
    var autcomplete = $('.side-chips-autocomplete');
    var selectedLabels = autcomplete[0].textContent.split('close');
    selectedLabels.pop();
    routeQuery = { criteria : routeQuery.criteria};
    if(selectedLabels.length != 0)routeQuery['labels'] = selectedLabels;
    if(form.type.value != 0)routeQuery['type'] = form.type.value;
    if(form.onSale.checked)routeQuery['onSale'] = true;
    if(form.shipping.checked)routeQuery['shipping'] = true;
    if(form.negotiable.checked)routeQuery['negotiable'] = true;
    if(form.city.value)routeQuery['city'] = form.city.value;
    Router.go('/search?'+$.param(routeQuery),{replaceState: true});
  },
  'click a.clear' : function(e){
    clearFilters();
  }
});

Template.searchBar.events({
  'submit form.search-form' : function(e){
    e.preventDefault();
    redirectSearch(e.target.searchInput.value);
  }
});

Template.mainLayout.events({
  'submit form.mainLayout-search-form' : function(e){
    e.preventDefault();
    redirectSearch(e.target.searchInput.value);
  }
});

Template.account.events({
  'submit form.account-search-form' : function(e){
    e.preventDefault();
    redirectSearch(e.target.searchInput.value);
  }
});

var redirectSearch = function(criteria){
  Router.go('/search?criteria='+criteria);
}

var initChipsAutoComplete = function(selectedLabels){
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
      }
    },
    data:selectedLabels
  });
}

var _formSubmtied = function(e){

};

var clearFilters = function(){
  routeQuery = {criteria : routeQuery.criteria};
  $('#onSaleCheck').checked = false;
  $('#shippingCheck').checked = false;
  $('#typeSelect')[0].value = 0;
  $('select').material_select();
  initChipsAutoComplete({});
  Router.go('/search?criteria='+routeQuery.criteria, {replaceState: true});
}
