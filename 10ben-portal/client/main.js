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
    autoValue: function() {
      if (this.isInsert && (!this.isSet || this.value.length === 0)) {
        return Random.id(8)
      }
    },
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
    type: String
  },
  callsign: {
    type: String
  },
  status: {
    type: String
  }
}, {tracker: Tracker}));

Assignments.attachSchema(new SimpleSchema({
  assignmentid: {
    type: String,
    autoValue: function() {
      if (this.isInsert && (!this.isSet || this.value.length === 0)) {
        return Random.id(8)
      }
    },
    autoform: {
      type: "hidden"
    }
  },
  title: {
    type: String
  },
  desc: {
    type: String
  },
  type: {
    type: String
  },
  status: {
    type: String
  },
  datecreated: {
    type: Date,
    autoValue: function() {
      return new Date()
    },
    autoform: {
      type: "hidden"
    }
  },
  deadline: {
    type: Date
  },
  controllerid: {
    type: String,
    autoValue: function() {
      return Meteor.userId()
    },
    autoform: {
      type: "hidden"
    }
  },
  agentid: {
    type: String,
  }
}, {tracker: Tracker}));

//Template Helpers
Template.applicationLayout.onCreated(() => {
  Blaze._allowJavascriptUrls();
});

Template.login.onCreated(() => {
  setTimeout(() => {
    $('.at-form').addClass('login-form flex-column flex-center');
    $('.at-pwd-form form').addClass('flex-column flex-start');
    $('.at-form .at-title h3').addClass('login-title');
    $('.at-form .at-title h3').text('Welcome, Controller.');
    $('.at-pwd-form form .at-input').addClass('login-field');
    $('.at-pwd-form form .at-btn').addClass('login-button');
    //$('.at-signup-link').addClass('hidden');
  }, 0);
});

Template.stub.events({
  'click #logout' : (event, template) => {
    AccountsTemplates.logout();
  }
})
