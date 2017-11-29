//Controller Publications
Meteor.publish('allAgents', () => {
  return Agents.find({});
});

Meteor.publish('allControllerAssignments', () => {
  return Assignments.find({controllerid: this.userId});
});
