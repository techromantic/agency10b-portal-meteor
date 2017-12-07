import { Meteor } from 'meteor/meteor';

//Collections
Agents = new Mongo.Collection('agents');
Assignments = new Mongo.Collection('assignments');
Messages = new Mongo.Collection('messages');

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.users.allow({
  'update' : () => {
    return true;
  }
})

//Validation Methods
Meteor.methods({
    'checkAgentKey': function (userkey) {
        return (Agents.findOne({agentid: userkey})) ? true : false;
    }
});
