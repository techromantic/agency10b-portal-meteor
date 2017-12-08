import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Random } from 'meteor/random';
import { Session } from 'meteor/session';
import { Match } from 'meteor/check'
import { check } from 'meteor/check'
import SimpleSchema from 'simpl-schema';
import {Email} from 'meteor/email';

//Collections
Agents = new Mongo.Collection('agents');
Assignments = new Mongo.Collection('assignments');
Messages = new Mongo.Collection('messages');

//Simple Schema
SimpleSchema.extendOptions(['autoform']);
SimpleSchema.extendOptions({
  denyInsert: Match.Optional(Boolean),
  denyUpdate: Match.Optional(Boolean)
});
SimpleSchema.debug = true;

//Schemas
AgentSchema = new SimpleSchema({
  agentid: {
    type: String,
    autoValue: function() {
      if (this.isInsert && (!this.isSet || this.value.length === 0)) {
        return Random.id(8);
      } else if (this.isUpsert) {
        return {$setOnInsert: Random.id(8)};
      }
    },
    denyInsert: false,
    denyUpdate: true
  },
  datecreated: {
    type: Date,
    autoValue: function() {
      if (this.isInsert && (!this.isSet || this.value.length === 0)) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date};
      }
    },
    denyInsert: false,
    denyUpdate: true
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
});

AssignmentSchema = new SimpleSchema({
  assignmentid: {
    type: String,
    autoValue: function() {
      if (this.isInsert && (!this.isSet || this.value.length === 0)) {
        return Random.id(8)
      } else if (this.isUpsert) {
        return {$setOnInsert: Random.id(8)};
      } else {
        this.unset();
      }
    },
    denyInsert: false,
    denyUpdate: true
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
    autoValue: function() {
      if (this.isInsert && (!this.isSet || this.value.length === 0)) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date};
      } else {
        this.unset();
      }
    },
    denyInsert: false,
    denyUpdate: true
  },
  deadline: {
    type: Date,
    autoform: {
      type: "bootstrap-datepicker"
    }
  },
  controllerid: {
    type: String,
    autoValue: function() {
      if (this.isInsert && (!this.isSet || this.value.length === 0)) {
        return Meteor.userId();
      } else if (this.isUpsert) {
        return {$setOnInsert: Meteor.userId()};
      } else {
        this.unset();
      }
    },
    denyInsert: false,
    denyUpdate: true
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
});

MessageSchema = new SimpleSchema({
  senderid: {
    type: String,
    autoValue: function() {
      if (this.isInsert && (!this.isSet || this.value.length === 0)) {
        return (!Meteor.user() && !Meteor.loggingIn()) ? FlowRouter.getParam('agentid') : Meteor.userId();
      } else if (this.isUpsert) {
        return {$setOnInsert: (!Meteor.user() && !Meteor.loggingIn()) ? FlowRouter.getParam('agentid') : Meteor.userId()};
      } else {
        this.unset();
      }
    },
    denyInsert: false,
    denyUpdate: true
  },
  datecreated: {
    type: Date,
    autoValue: function() {
      if (this.isInsert && (!this.isSet || this.value.length === 0)) {
        return new Date();
      }
    },
    denyInsert: false,
    denyUpdate: true
  },
  content: {
    type: String
  }
});

Agents.attachSchema(AgentSchema);
Assignments.attachSchema(AssignmentSchema);
Messages.attachSchema(MessageSchema);

Meteor.startup(() => {
  // code to run on server at startup
    process.env.MAIL_URL = "smtp://postmaster@sandbox7f352be01259405aacba840a713f2ad0.mailgun.org:25fa41a946c85fb6ebca0c9989cf6959@smtp.mailgun.org:587";
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
    },
    'newAgentEmail': function (agent) {
        SSR.compileTemplate('newAgentEmail', Assets.getText('newagent.html'));

        var agentData = {
            name: agent.name,
            userkey: agent.userkey,
        };

        Email.send({
            to: agent.email,
            from: "sarim@10ben.io",
            subject: "Welcome to 10Ben",
            html: SSR.render('newAgentEmail', agentData),
        });
    }
});
