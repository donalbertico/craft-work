const room = function(){
  var transmiter = Meteor.userId();
  var reciver = Router.current().params.id;
  console.log('tha rooms',rooms.findOne({$and : [ {users : transmiter},{users:reciver}]}));
  return rooms.findOne({$and : [ {users : transmiter},{users:reciver}]});
};

Template.newMessage.events({
  'submit form.new-message' : function(e){
    e.preventDefault();
    var textarea = e.target.message;
    if(textarea.value){
      Meteor.call('createMessage',Router.current().params.id , textarea.value);
      textarea.value = '';
    }
  },

  'keypress textarea' : function(e){
    if(!e.shiftKey && e.which == 13){
      e.preventDefault();
      $('form.new-message').submit();
    }
  }
});

Template.messages.helpers({
  userRooms : function(){
    var userRooms = [];
    rooms.find({users : Meteor.userId()}).forEach((room)=>{
      var current = {
        id :room._id,
        users : room.users
      }
      if(room.users[0]==Meteor.userId()){
        current['user'] = Meteor.users.findOne({_id: room.users[1]});
      }else if(room.users[1]==Meteor.userId()){
        current['user'] = Meteor.users.findOne({_id: room.users[0]});
      }
      console.log(Meteor.users.findOne({_id: room.users[1]}));
      if(room.recivedA == Meteor.userId() || room.recivedB == Meteor.userId())current['unseen'] = true;
      console.log(current);
      userRooms.push(current);
    });
  	return userRooms;
  },
  messages : function(){
    var roomMessages = [];
    if(!room())return roomMessages;
    messages.find({room : room()._id}).fetch().forEach(function(message){
      var date = message.createdAt;
      var currentMessage = {transmiter : false , content : message.content,
        date : date.getDate()+'/'+(date.getMonth() + 1) + '/'+ date.getFullYear()+ ' ' +date.getHours()+ ':' +date.getMinutes()};
      if(message.user == Meteor.userId()){
        currentMessage.transmiter = true;
        roomMessages.push(currentMessage);
      }else{
        currentMessage.transmiter = false;
        roomMessages.push(currentMessage);
      }
    });
    return roomMessages;
  },
  userReciver : function(){
    return Meteor.users.findOne({_id : Router.current().params.id });
  },
  sameUser : function(){
    console.log(Meteor.userId() == Router.current().params.id);
    return Meteor.userId() == Router.current().params.id ;
  }
});
