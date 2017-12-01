import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Random } from 'meteor/random';
import SimpleSchema from 'simpl-schema';
import './main.html';

//Simple Schema
SimpleSchema.extendOptions(['autoform']);
SimpleSchema.debug = true;

//Collections
Agents = new Mongo.Collection('agents');
Assignments = new Mongo.Collection('assignments');


//Schemas
Agents.attachSchema(new SimpleSchema({
  agentid: {
    type: String,
    defaultValue: Random.id(8),
    autoform: {
      type: "hidden"
    }
  },
  datecreated: {
    type: Date,
    defaultValue: new Date(),
    autoform: {
      type: "hidden"
    }
  },
  name: {
    type: String
  },
  email: {
    type: String
  },
  type: {
    type: String,
      allowedValues: ['Developer', 'Writer', 'Designer', 'Analyst', 'Strategist']
  },
  callsign: {
    type: String
  },
  status: {
    type: String,
      allowedValues: ['Active', 'Inactive']
  }
}, {tracker: Tracker}));

Assignments.attachSchema(new SimpleSchema({
  assignmentid: {
    type: String,
    defaultValue: Random.id(8),
    autoform: {
      type: "hidden"
    }
  },
  title: {
    type: String
  },
  desc: {
    type: String,
    max: 2000
  },
  type: {
    type: String,
      allowedValues: ['Development', 'Copy', 'Design', 'Analysis', 'Strategy']
  },
  status: {
    type: String,
      allowedValues: ['Open', 'Assigned', 'Accepted', 'Rejected', 'Completed', 'Under Review', 'Archived']
  },
  datecreated: {
    type: Date,
    defaultValue: new Date(),
    autoform: {
      type: "hidden"
    }
  },
  deadline: {
    type: Date
  },
  controllerid: {
    type: String,
    defaultValue: Meteor.userId(),
    autoform: {
      type: "hidden"
    }
  },
  agentid: {
    type: Array,
      autoform: {
          options: function () {
          //var agents = Agents.find({}).fetch();
              var opts = Agents.find().map(function(agent) {
                  return {
                      label: agent.name + ": " + agent.type,
                      value: agent.agentid
                  };
              });
              console.log(opts);
              return opts;
          }
      }
  },
    'agentid.$' : {
    type: String
    }
}, {tracker: Tracker}));

//Template Helpers
Template.registerHelper('formatDate', (date) => {
  return moment(date).format('MMM. D, YYYY');
});

//Template Helpers
Template.applicationLayout.onCreated(() => {
  Blaze._allowJavascriptUrls();
});

//Controller Login
Template.controllerLogin.onCreated(() => {
  setTimeout(() => {
    $('.at-form').addClass('login-form flex-column flex-center');
    $('.at-pwd-form form').addClass('flex-column flex-start');
    $('.at-form .at-title h3').addClass('login-title');
    $('.at-form .at-title h3').text('Welcome, Controller.');
    $('.at-pwd-form form .at-input').addClass('login-field');
    $('.at-pwd-form form .login-field input').addClass('bottom-border');
    $('.at-pwd-form form .at-btn').addClass('login-button');
    //$('.at-signup-link').addClass('hidden');
  }, 0);
});

Template.stub.events({
  'click #logout' : (event, template) => {
    AccountsTemplates.logout();
  }
});


//Controller Dashboard
Template.controllerDashboard.onCreated(function(){
  this.agents = this.subscribe("allAgents");
  this.assignments = this.subscribe("allAssignments");
});

Template.controllerDashboard.helpers({
  controllerCallsign: () => {
    return Meteor.user().profile.callsign;
  },
  agents: () => {
    return Agents.find({});
  },

  assignments: () => {
    return Assignments.find({});
  }
});

Template.controllerDashboard.events({
  'click #logout' : (event, template) => {
    AccountsTemplates.logout();
  },

  'click .control-section:not(.active) .control-title' : (event, template) => {
    $('.control-section').toggleClass('active');
  },

  'click #add-agent' : (event, template) => {
    $('#assignment-form').removeClass('active');
    $('#agent-form').addClass('active');
  },

  'click #add-assignment' : (event, template) => {
    $('#agent-form').removeClass('active');
    $('#assignment-form').addClass('active');
  }
});

Template.createAgent.onCreated(function() {
  this.agents = this.subscribe("allAgents");
});

Template.createAgent.events({
  'click #cancel-form' : (event, template) => {
    $('#agent-form').removeClass('active');
  },

  'click #submit-form' : (event, template) => {
    $('#agent-form').removeClass('active');
  },
});

Template.createAssignment.onCreated(function() {
    this.assignments = this.subscribe("allAssignments");
    this.agents = this.subscribe("allAgents");
});

Template.createAssignment.events({
  'click #cancel-form' : (event, template) => {
    $('#assignment-form').removeClass('active');
  },

  'click #submit-form' : (event, template) => {
    $('#assignment-form').removeClass('active');
  },
})
