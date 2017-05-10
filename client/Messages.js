var c= new Tracker.Dependency;
const room = function(){
  var transmiter = Meteor.userId();
  var reciver = Router.current().params.id;
  return rooms.findOne({$and : [ {users : transmiter},{users:reciver}]});
};

Template.messages.helpers({
  userRooms : function(){
    var userRooms = [];
    rooms.find().forEach((room)=>{
      if(room.users[0]==Meteor.userId()){
        userRooms.push({
          id :room._id,
          user: Meteor.users.findOne({_id: room.users[1]}),
          users : room.users
        });
      }else if(room.users[1]==Meteor.userId()){
        userRooms.push({
          id :room._id,
          user: Meteor.users.findOne({_id: room.users[0]}),
          users : room.users});
      }
    });
    console.log(userRooms);
  	return userRooms;
  },
  messages : function(){
    var roomMessages = [];
    if(!room())return roomMessages;
    messages.find({room : room()._id}).fetch().forEach(function(message){
      console.log(message);
      if(message.user == Meteor.userId()){
        roomMessages.push({transmiter :true, content : message.content});
      }else{
        roomMessages.push({transmiter :false,content : message.content});
      }
    });
    return roomMessages;
  },
  userReciver : function(){
    return Meteor.users.findOne({_id : Router.current().params.id });
  }
});

Template.newMessage.events({
  'submit form.new-message' : function(e){
    e.preventDefault();
    Meteor.call('createMessage',Router.current().params.id , $("#textarea").val());
  }
})
