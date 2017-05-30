var selectedLabels;
var postDep = new Tracker.Dependency;
var currentPost;
var uploader = new Slingshot.Upload("postUpload");
var progBarDep = new Tracker.Dependency;
var auxdep = new Tracker.Dependency;
var uploadComplete = false;
var auxArray;
var self = this;

Template.newProductForm.helpers({
  selectedLabels : function(){
    labelsDep.depend();
    return labels
  }
});

Template.newProductForm.events({
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
    var newPost = posts.insert({name : form.name.value, description : form.description.value, labels : selectedLabels, user: Meteor.userId()});
    Router.go('/account/product/'+newPost+'/priceInfo');
  }
});

Template.productFirstForm.events({
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
    Router.go('/account/product/'+currentPost._id+'/priceInfo');
  }
});

Template.productFirstForm.onRendered(function(){
    var post = this.data.post;
    var selectedLabels = [];
    var labels = post.labels;
    for(var label in labels){
      selectedLabels.push({tag : labels[label]});
    };
    console.log('yeyeey',selectedLabels);
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
    Materialize.updateTextFields();
    currentPost = post;
});

Template.productSecondForm.onRendered(function(){
    var post = this.data.post;
    currentPost = post;
    computeOnSaleSection(post.onSale);
    computeShippingDiv(post.shipping);
    computeShippingIncludedDiv(post.shippingIncluded);
    $('#salePaySelect')[0].value = post.salePay||1;
    $('#saleGetSelect')[0].value = post.saleGet||2;
    $('select').material_select();
});

Template.productSecondForm.helpers({
  currentPost : function(){
    postDep.depend();
    var post = this.post;
    if(!post.price)post.price = 0;
    if(post.shipping != true && post.shipping != false){
      post.shipping = true;
    }
    if(post.shippingIncluded != true && post.shippingIncluded != false){
      post.shippingIncluded = true;
    }
    return this.post;
  }
});

Template.productSecondForm.events({
  'change input.price-range' : function(e){
    this.post.price = e.target.value;
    postDep.changed();
  },
  'change select#saleSelect' : function(e){
    computeOnSaleSection(e.target.value);
  },
  'change #shippingInput' : function(e){
    computeShippingDiv(e.target.checked);
  },
  'change #shippingIncludedInput' : function(e){;
    computeShippingIncludedDiv(e.target.checked);
  },
  'click a.next' : function(e){
    $('#productSecondFormButton').click();
  },
  'submit form' : function(e){
    e.preventDefault();
    var form = e.target;
    if(form.price.value == 0) return Materialize.toast('El precio unitario debe ser mayor a 0',4000);
    switch(form.onSale.value){
      case '1':
        if(!form.percentage.value || !form.minValue.value)return Materialize.toast('Debes seleccionar un porcentaje y un valor minimo',4000);
      break;
      case '2':
        if(parseInt(form.saleGet.value) <= parseInt(form.salePay.value))return Materialize.toast('La catnidad que pagas no puede ser mayor o igual a la que llevas',4000);
      break;
    };
    console.log(form.saleGet.value,form.salePay.value);
    if(form.shipping.checked&&!form.shippingIncluded.checked&&!form.shippingCost.value)return Materialize.toast('Debes proveer un costo de envio aproximado',4000);
    posts.update({_id : currentPost._id},{$set :
      { price : form.price.value,
        negotiable : form.negotiable.checked,
        onSale : form.onSale.value,
        percentage : form.percentage.value,
        minValue : form.minValue.value,
        saleGet : form.saleGet.value,
        salePay : form.salePay.value,
        shipping : form.shipping.checked,
        shippingIncluded : form.shippingIncluded.checked,
        shippingCost : form.shippingCost.value
    }});
    Router.go('/account/product/'+currentPost._id+'/photos');
  }
});

Template.productThirdForm.onRendered(function(){
  var post = this.data.post;
  currentPost = post;
  if(currentPost.photos){
    auxArray = currentPost.photos.slice()
  }else{
    auxArray = [];
  } 
});

Template.productThirdForm.helpers({
  currentPost : function(){
    auxdep.depend();
    return this.post;
  },
  uploadProgress: function () {
    progBarDep.depend();
    if(uploadComplete)return false;
    return Math.round(uploader.progress() * 100);
  },
});

Template.productThirdForm.events({
  'change input.photo-input' : function(e){
      uploadComplete = false;
      progBarDep.changed();
      var self = this;
      uploader.send(e.target.files[0], function (error, downloadUrl) {
        if (error) {
          console.error('Error uploading', uploader.xhr.response);
          alert (error);
          return Materialize.toast('Hubo un error al subir la imagen', 4000);
        }
        posts.update({_id: currentPost._id},{ $push : {
          'photos' : downloadUrl
        }},function(err){
          if(err)return Materialize.toast(err.reason, 4000); // Output error if registration fails
          Materialize.toast('foto agreagada',4000);
          uploadComplete = true;
          progBarDep.changed();
        });
        auxArray.push(downloadUrl);
        setCurrentPostPhotos(self.post);
      });
  },
  'click a.delete' : function(e){
    var items = $('.carousel')[0].children;
    var index = getSelectedPhotoIndex();
    var self = this;
    Meteor.call('deletePostImage',currentPost._id,currentPost.photos[index],function(err){
      if(err)return Materialize.toast(err.reason, 4000);
      Materialize.toast('foto eliminada', 4000);
      auxArray.splice(index,1);
      setCurrentPostPhotos(self.post);
    });
  },
  'click a.set-main' : function(e){
    var index = getSelectedPhotoIndex();
    var aux = auxArray[0];
    auxArray[0] = auxArray[index];
    auxArray[index] = aux;
    posts.update({_id:currentPost._id},{$set : { photos : auxArray}});
    setCurrentPostPhotos(this.post);
  },
  'click a.publish' : function(e){
    if(this.post.photos && this.post.photos.length > 0) {
      posts.update({_id : this.post._id},{ $set : {publish : true}});
      return Router.go('/account/posts');
    }
    Materialize.toast('Debes incluir almenos una foto',4000);
  }
});

setCurrentPostPhotos = function(post){
  post.photos = [];
  auxdep.changed();
    setTimeout(function(){
  $('.carousel').carousel();
  },3000);
  setTimeout(function(){
  post.photos = auxArray.slice();
  auxdep.changed();
  $('.carousel').carousel();
  },1000);
};

getSelectedPhotoIndex = function(){
  var items = $('.carousel')[0].children;
  var index = 0;
  for(var item in items){
    if(items[item].className == 'carousel-item active')return index;
    index++;
  } 
};

computeOnSaleSection = function(onSale){
    var percentageDiv = $('#percentageDiv');
    var quantityDiv = $('#quantityDiv');
    switch(onSale){
      case '0' :
        percentageDiv.removeClass('bounceInLeft');
        percentageDiv.addClass('bounceOutLeft');
        quantityDiv.removeClass('bounceInLeft');
        quantityDiv.addClass('bounceOutLeft');
        setTimeout(function(){ 
          percentageDiv.hide();
          quantityDiv.hide();
        }, 1000);
      break;
      case '1' :
        percentageDiv.show();
        percentageDiv.removeClass('bounceOutLeft');
        percentageDiv.addClass('bounceInLeft');
        quantityDiv.removeClass('bounceInLeft');
        quantityDiv.addClass('bounceOutLeft');
        setTimeout(function(){ 
          quantityDiv.hide();
        }, 500);
      break;
      case '2' :
        quantityDiv.show();
        quantityDiv.removeClass('bounceOutLeft');
        quantityDiv.addClass('bounceInLeft');
        percentageDiv.removeClass('bounceInLeft');
        percentageDiv.addClass('bounceOutLeft');
        setTimeout(function(){ 
          percentageDiv.hide();
        }, 500);
      break;
    }
    $('#saleSelect')[0].value = onSale;
},

computeShippingDiv = function(shipping){
  var shippingDiv = $('#shippingDiv');
  if(shipping){
    shippingDiv.show();
    shippingDiv.removeClass('bounceOutLeft');
    shippingDiv.addClass('bounceInLeft');
  }else{
    shippingDiv.removeClass('bounceInLeft');
    shippingDiv.addClass('bounceOutLeft');
    setTimeout(function(){ 
      shippingDiv.hide();
    }, 1000);
  }
},

computeShippingIncludedDiv = function(shipping){
  var shippingIncludedDiv = $('#shippingIncludedDiv');
  if(shipping){
    shippingIncludedDiv.removeClass('bounceInLeft');
    shippingIncludedDiv.addClass('bounceOutLeft');
    setTimeout(function(){ 
      shippingIncludedDiv.hide();
    }, 1000);
  }else{
    shippingIncludedDiv.show();
    shippingIncludedDiv.removeClass('bounceOutLeft');
    shippingIncludedDiv.addClass('bounceInLeft');
  }
}
