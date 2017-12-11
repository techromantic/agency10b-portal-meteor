var senderID;
var assignmentID;

//Registered Template Helpers
Template.registerHelper('formatFullDate', (date) => {
  return moment(date).format('lll');
});

Template.registerHelper('formatDate', (date) => {
  return moment(date).format('MMM. D, YYYY');
});

Template.registerHelper('formatDateTime', (date) => {
  return moment(date).format('LT');
});

Template.registerHelper('formatDateFromNow', (date) => {
    return moment(date).fromNow();
});

Template.registerHelper('getSender', (senderid) => {
  if (Meteor.users.findOne({_id: senderid})) {
    return Meteor.users.findOne({_id: senderid}).profile.callsign;
  } else {
    return Agents.findOne({agentid: senderid}).callsign;
  }
});

Template.registerHelper('getController', (controllerid) => {
  return Meteor.users.findOne({_id: controllerid}).profile.callsign;
});

Template.registerHelper('condenseMessage', (message) => {
  return message.substring(0, 240) + (message.length > 240)? '' : '...';
})


Meteor.methods({
  'setMessageIDs': (sid, aid) => {
    if (this.isSimulation) {
      senderID = FlowRouter.getParam('agentid');
      assignmentID = FlowRouter.getParam('assignmentid');
    } else {
      senderID = sid;
      assignmentID = aid;
    }
  },
  'getSenderID': () => {
    return senderID;
  },
  'getAssignmentID': () => {
    return assignmentID;
  }
});
