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

Template.registerHelper('getAgent', (aid) => {
  return Agents.findOne({agentid: aid}).callsign;
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
});

Template.registerHelper('agentOptions', () => {
  let agents = Agents.find({}).fetch();
  let agentArray = [];
  for (let i = 0; i < agents.length; i++) {
    let item = {label: agents[i].callsign, value: agents[i].agentid};
    agentArray.push(item);
  }
  return agentArray;
});


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
