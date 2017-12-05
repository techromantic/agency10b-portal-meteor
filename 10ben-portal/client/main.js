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
    type: String,
    regEx: SimpleSchema.RegEx.Email
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
    type: Date,
    autoform: {
      type: "bootstrap-datepicker"
    }
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
    onError: (formType, error) => {
      alert("Error adding agent: " + error);
    },
    onSuccess: (formType, result) => {
      $('#agent-add').removeClass('active');
      $('.form-bg').removeClass('active');
      FlowRouter.go('control-dash');
    }
});

AutoForm.addHooks('editAgent', {
    onError: (formType, error) => {
      alert("Error updating agent: " + error);
    },
    onSuccess: (formType, result) => {
      $('#agent-edit').removeClass('active');
      $('.form-bg').removeClass('active');
      FlowRouter.go('control-dash');
    }
});

AutoForm.addHooks('addAssignment', {
    onError: (formType, error) => {
      alert("Error adding assignment: " + error);
    },
    onSuccess: (formType, result) => {
      $('#assignment-add').removeClass('active');
      $('.form-bg').removeClass('active');
      FlowRouter.go('control-dash');
    }
});

AutoForm.addHooks('editAssignment', {
    onError: (formType, error) => {
      alert("Error updating assignment: " + error);
    },
    onSuccess: (formType, result) => {
      $('#assignment-edit').removeClass('active');
      $('.form-bg').removeClass('active');
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

//Agent Login
Template.agentLogin.onCreated(() => {
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

Template.agentLogin.events({
    'click .login-image': function (e) {
        e.preventDefault();
        var userkey = document.getElementById('userkey').value;
        Meteor.call('checkAgentKey', userkey, function (err, result) {
          console.log(err);
          console.log(result);
          if(err) {
              alert('There is an error while checking credentials.');
          } else {
            if (result === true){
                FlowRouter.go(`/agent-dash/${userkey}`);
            } else {
                alert('That userkey is not acceptable.');
            }
          }
        });
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

//Create Agent
Template.createAgent.onCreated(function() {
  this.agents = this.subscribe("allAgents");
});

Template.createAgent.events({
  'click #cancel-form' : (event, template) => {
    event.preventDefault();
    $('#agent-add').removeClass('active');
    $('.form-bg').removeClass('active');
    FlowRouter.go('control-dash');
  }
});

Template.editAgent.onCreated(function() {
  this.agents = this.subscribe("allAgents");
});

//Edit Agent
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
    event.preventDefault();
    $('#agent-edit').removeClass('active');
    $('.form-bg').removeClass('active');
    FlowRouter.go('control-dash');
  }
})

//Create Assignment
Template.createAssignment.onCreated(function() {
    this.assignments = this.subscribe("allAssignments");
    this.agents = this.subscribe("allAgents");
});

Template.createAssignment.events({
  'click #cancel-form' : (event, template) => {
    event.preventDefault();
    $('#assignment-add').removeClass('active');
    $('.form-bg').removeClass('active');
    FlowRouter.go('control-dash');
  }
})

//Edit Assignment
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
    event.preventDefault();
    $('#assignment-edit').removeClass('active');
    $('.form-bg').removeClass('active');
    FlowRouter.go('control-dash');
  }
})


//Agent Dashboard
Template.agentDashboard.onCreated(function(){
  this.agents = this.subscribe("allAgents");
  this.assignments = this.subscribe("allAssignments");
});

Template.agentDashboard.helpers({
  agentcallsign: () => {
    return Agents.findOne({agentid: FlowRouter.getParam('agentid')}).callsign;
  },

  assignments: () => {
    return Assignments.find({});
  }
});

Template.agentDashboard.events({
  'click #logout' : (event, template) => {
    AccountsTemplates.logout();
  }
});
