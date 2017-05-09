
Accounts.emailTemplates.resetPassword.text = function(user, url) {
  var id = url.substring(url.lastIndexOf('/') + 1);
  return "Click aqui para cambiar la contraseña: /reset-password/" + id;
};
