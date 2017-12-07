import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Random } from 'meteor/random';
import { Session} from 'meteor/session';
import SimpleSchema from 'simpl-schema';
import './main.html';

//Simple Schema
SimpleSchema.extendOptions(['autoform']);
SimpleSchema.debug = true;

//Collections
Agents = new Mongo.Collection('agents');
Assignments = new Mongo.Collection('assignments');
Messages = new Mongo.Collection('messages');

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

Messages.attachSchema(new SimpleSchema({
  content: {
    type: String
  },
  senderid: {
    type: String,
    defaultValue: (!Meteor.user() && !Meteor.loggingIn()) ? FlowRouter.getParam('agentid') : Meteor.userId(),
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
  // assignmentid: {
  //   type: String,
  //   defaultValue: FlowRouter.getParam('assignmentid')
  // }
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

AutoForm.addHooks('editProfile', {
    onError: (formType, error) => {
      alert("Error updating profile: " + error);
    },
    onSuccess: (formType, result) => {
      $('#profile-edit').removeClass('active');
      $('.form-bg').removeClass('active');
      FlowRouter.go(`/agent-dash/${FlowRouter.getParam('agentid')}`);
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

AutoForm.addHooks('sendMessage', {
    onError: (formType, error) => {
      alert("Error sending message: " + error);
    },
    onSuccess: (formType, result) => {
      console.log(formType);
    }
});
