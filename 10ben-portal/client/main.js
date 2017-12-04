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
            var opts = Agents.find().map(function(agent) {
                return {
                    label: agent.name + ": " + agent.type,
                    value: agent.agentid
                };
            });
            return opts;
          }
      }
  },
    'agentid.$' : {
    type: String
    }
}, {tracker: Tracker}));

//FlowRouter Autoform Hooks
AutoForm.addHooks(null, {
    onError: (name, error, template) => {
      console.log(name + " error:", error);
    }
});

AutoForm.addHooks('addAgent', {
    onSuccess: (formType, result) => {
      FlowRouter.go('control-dash');
    }
});

AutoForm.addHooks('editAgent', {
    onSuccess: (formType, result) => {
      FlowRouter.go('control-dash');
    }
});

AutoForm.addHooks('addAssignment', {
    onSuccess: (formType, result) => {
      FlowRouter.go('control-dash');
    }
});

AutoForm.addHooks('editAssignment', {
    onSuccess: (formType, result) => {
      FlowRouter.go('control-dash');
    }
});

//Template Helpers
Template.registerHelper('formatDate', (date) => {
  return moment(date).format('MMM. D, YYYY');
});

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
    $('#agent-add').addClass('active');
    $('.form-bg').addClass('active');
  },

  'click #add-assignment' : (event, template) => {
    $('#assignment-add').addClass('active');
    $('.form-bg').addClass('active');
  },

  'click .agent-item' : (event, template) => {
    $('#agent-edit').addClass('active');
    $('.form-bg').addClass('active');
  },

  'click .assignment-item' : (event, template) => {
    $('#assignment-edit').addClass('active');
    $('.form-bg').addClass('active');
  }
});

Template.createAgent.onCreated(function() {
  this.agents = this.subscribe("allAgents");
});

Template.createAgent.events({
  'click #cancel-form' : (event, template) => {
    $('#agent-add').removeClass('active');
    $('.form-bg').removeClass('active');
  },

  'click #submit-form' : (event, template) => {
    $('#agent-add').removeClass('active');
    $('.form-bg').removeClass('active');
  }
});

Template.editAgent.onCreated(function() {
  this.agents = this.subscribe("allAgents");
});

Template.editAgent.helpers({
  agentdetail: () => {
    return Agents.find({agentid: FlowRouter.getParam('agentid')});
  },

  beforeRemove: () => {
    return function (collection, id) {
      let doc = collection.findOne(id);
      if (confirm('Really delete "' + doc.name + '"?')) {
        this.remove();
      }
    };
  },

  onSuccess: () => {
    return (result) => {
      $('#agent-edit').removeClass('active');
      $('.form-bg').removeClass('active');
      FlowRouter.go('control-dash');
    };
  }
});

Template.editAgent.events({
  'click #cancel-form' : (event, template) => {
    $('#agent-edit').removeClass('active');
    $('.form-bg').removeClass('active');
  },

  'click #submit-form' : (event, template) => {
    $('#agent-edit').removeClass('active');
    $('.form-bg').removeClass('active');
  }
})

Template.createAssignment.onCreated(function() {
    this.assignments = this.subscribe("allAssignments");
    this.agents = this.subscribe("allAgents");
});

Template.createAssignment.events({
  'click #cancel-form' : (event, template) => {
    $('#assignment-add').removeClass('active');
    $('.form-bg').removeClass('active');
  },

  'click #submit-form' : (event, template) => {
    $('#assignment-add').removeClass('active');
    $('.form-bg').removeClass('active');
  }
})

Template.editAssignment.onCreated(function() {
    this.assignments = this.subscribe("allAssignments");
    this.agents = this.subscribe("allAgents");
});

Template.editAssignment.helpers({
  assignmentdetail: () => {
    return Assignments.find({assignmentid: FlowRouter.getParam('assignmentid')});
  },

  beforeRemove: () => {
    return function (collection, id) {
      let doc = collection.findOne(id);
      if (confirm('Really delete "' + doc.name + '"?')) {
        this.remove();
      }
    };
  },

  onSuccess: () => {
    return (result) => {
      $('#assignment-edit').removeClass('active');
      $('.form-bg').removeClass('active');
      FlowRouter.go('control-dash');
    };
  }
});

Template.editAssignment.events({
  'click #cancel-form' : (event, template) => {
    $('#assignment-edit').removeClass('active');
    $('.form-bg').removeClass('active');
  },

  'click #submit-form' : (event, template) => {
    $('#assignment-edit').removeClass('active');
    $('.form-bg').removeClass('active');
  }
})
