import { Meteor } from 'meteor/meteor';

//Collections
Agents = new Mongo.Collection('agents');
Assignments = new Mongo.Collection('assignments');

Meteor.startup(() => {
  // code to run on server at startup
});
