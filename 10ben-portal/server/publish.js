//Controller Publications
Meteor.publish('allUsers', () => {
  return Meteor.users.find({});
});

Meteor.publish('allAgents', () => {
  return Agents.find({});
});

Meteor.publish('allDeveloper', () => {
    return Agents.find({type:'Developer'});

});

Meteor.publish('allDesigner', () => {
    return Agents.find({type:'Designer'});
});

Meteor.publish('allWriter', () => {
    return Agents.find({type:'Writer'});
});

Meteor.publish('allAnalyst', () => {
    return Agents.find({type:'Analyst'});
});

Meteor.publish('allStrategist', () => {
    return Agents.find({type:'Strategist'});
});

Meteor.publish('allAssignments', () => {
  return Assignments.find({});
});

Meteor.publish('allControllerAssignments', () => {
  return Assignments.find({controllerid: this.userId});
});
