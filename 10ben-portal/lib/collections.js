import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Random } from 'meteor/random';
import { Session } from 'meteor/session';
import { Match } from 'meteor/check'
import { check } from 'meteor/check'
import SimpleSchema from 'simpl-schema';

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
        return Meteor.call("getSenderID");
      }
    },
    optional: true,
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
  },
  assignmentid: {
    type: String,
    autoValue: function() {
      if (this.isInsert && (!this.isSet || this.value.length === 0)) {
        return Meteor.call("getAssignmentID");
      }
    },
    optional: true,
    denyInsert: false,
    denyUpdate: true
  }
});

Agents.attachSchema(AgentSchema);
Assignments.attachSchema(AssignmentSchema);
Messages.attachSchema(MessageSchema);
