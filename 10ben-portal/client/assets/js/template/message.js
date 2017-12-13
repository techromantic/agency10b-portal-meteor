//Assignment Messaging
Template.messageAssignment.onCreated(function(aid) {
  this.assignments = this.subscribe("allAssignments");
  this.agents = this.subscribe("allAgents");
  this.users = this.subscribe("allUsers");

  //Collection subscription and call to server method
  this.messages = this.subscribe("allAssignmentMessages", FlowRouter.getParam('agentid'), FlowRouter.getParam('assignmentid'));

  //Call to client method
  Meteor.call("setMessageIDs", FlowRouter.getParam('agentid'), FlowRouter.getParam('assignmentid'));
});

Template.messageAssignment.helpers({
  messages: () => {
    return Messages.find({assignmentid: FlowRouter.getParam('assignmentid')}, {sort: {datecreated: -1}});
  },

  isSender: (sid) => {
    return (sid === FlowRouter.getParam('agentid')) ? true : false;
  },

  assignment: () => {
    return Assignments.find({assignmentid: FlowRouter.getParam('assignmentid')});
  }
});

Template.messageAssignment.events({
  'click #close-form' : (event, template) => {
    event.preventDefault();
    $('#assignment-message').removeClass('active');
    $('.form-bg').removeClass('active');
    window.history.back();
  }
});
