//Controller Publications
Meteor.publish('allUsers', () => {
  return Meteor.users.find({});
});

Meteor.publish('allAgents', () => {
  return Agents.find({});
});

Meteor.publish('allAssignments', () => {
  return Assignments.find({});
});

Meteor.publish('allControllerAssignments', () => {
  return Assignments.find({controllerid: this.userId});
});
