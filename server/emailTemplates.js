
Accounts.emailTemplates.resetPassword.html = function(user, url) {
  var id = url.substring(url.lastIndexOf('/') + 1);
  var newUrl = process.env.ROOT_URL + 'reset-password/' +id;
  return 'Click aqui para cambiar la contraseña: <a href='+newUrl+'>'+newUrl+'</a>';
};

Accounts.emailTemplates.verifyEmail.html = function(user, url) {
  var id = url.substring(url.lastIndexOf('/') + 1);
  var newUrl = process.env.ROOT_URL + 'confirm-mail/' +id;
  return 'Click aqui para confirmar tu dirección de correo electronico: <a href='+newUrl+'>'+newUrl+'</a>';
};
