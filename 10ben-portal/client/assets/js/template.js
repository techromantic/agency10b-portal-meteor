//Application Init
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
    this.agents = new ReactiveVar([]);
    this.agents.set(Agents.find({}));
    this.assignments = new ReactiveVar([]);
    this.assignments.set(Assignments.find({}));
    this.messages = this.subscribe("allMessages");
});

Template.controllerDashboard.helpers({
  controllerCallsign: () => {
    return Meteor.user().profile.callsign;
  },

  agents: () => {
    return Template.instance().agents.get();
  },

  assignments: () => {
    return Template.instance().assignments.get();
  },

  hasMessages: (aid) => {
    return Messages.find({assignmentid: aid}).count() > 0 ? true : false;
  },

  lastMessage: (aid) => {
    return Messages.find({assignmentid: aid}, {sort: {datecreated: -1}, limit: 1});
  },

  controllerid: () => {
    return Meteor.userId();
  },

  controllerEmail: () => {
    return Meteor.user().emails[0].address;
  }
});

Template.controllerDashboard.events({
  'click #logout' : (event, template) => {
    AccountsTemplates.logout();
  },

  'click .control-section .control-title' : (event, template) => {

    $('.control-section').removeClass('active');
    $('.control-section').css("left", "");
    $('.control-section.one').css("left", "0px");
    $('.control-section.two').css("left", "400px");
    $('.control-section.three').css("left", "800px");
    console.log('reset');

    if ($(event.target).parent('.control-section').hasClass('one')) {
      console.log('clicked 1');
      $('.control-section.two').css("left", "400px");
      $('.control-section.three').css("left", "800px");
    } else if ($(event.target).parent('.control-section').hasClass('two')) {
      console.log('clicked 2');
      $('.control-section.one').css("left", "400px");
      $('.control-section.three').css("left", "800px");
    } else if ($(event.target).parent('.control-section').hasClass('three')) {
      console.log('clicked 3');
      $('.control-section.one').css("left", "400px");
      $('.control-section.two').css("left", "800px");
    }

    $(event.target).parent('.control-section').addClass('active');
  },

  'click #add-agent' : (event, template) => {
    $('#agent-add').addClass('active');
    $('.form-bg').addClass('active');
  },

  'click #add-assignment' : (event, template) => {
    $('#assignment-add').addClass('active');
    $('.form-bg').addClass('active');
  },

  'click #edit-agent' : (event, template) => {
    $('#agent-edit').addClass('active');
    $('.form-bg').addClass('active');
  },

  'click #edit-assignment' : (event, template) => {
    $('#assignment-edit').addClass('active');
    $('.form-bg').addClass('active');
  },

  'click #message-assignment' : (event, template) => {
    $('#assignment-message').addClass('active');
    $('.form-bg').addClass('active');
  },

  'change #filter-agent' : (event, template) => {
      var agentType = $(event.target).val();
      console.log(agentType);
      template.agents.set(Agents.find({type: agentType}));
  },

  'change #search-agent' : (event, template) => {
      var search = $(event.target).val();
      console.log(search);
      if(search.length !== 0){
          template.agents.set(
              Agents.find({
                  $or: [{name: {$regex: search, $options: 'i'}},
                      {callsign: {$regex: search, $options: 'i'}},
                      {email: {$regex: search, $options: 'i'}}]
              })
          );
      } else {
        template.agents.set(Agents.find({}));
      }

  },


  'change #filter-assignment' : (event, template) => {
      var assignmentType = $(event.target).val();
      console.log(assignmentType);
      template.assignments.set(Assignments.find({type: assignmentType}));
  }

});

Template.controllerDashboard.datas = function(filter){
    console.log(filter);
    var result = new Array();
    if(ac != undefined){
        var cursor = RawData.find({type:ac});
        var data = cursor.fetch();
        console.log(data);
        //we rewind our cursor here so that it can be iterated again from the beginning when needed
        cursor.rewind();
        return result;
    }
};

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

    //this.currentAgent = Agents.findOne({_id: FlowRouter.getParam({'assignmentid'})});
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
Template.agentDashboard.onCreated(function() {
  this.users = this.subscribe("allUsers");
  this.agents = this.subscribe("allAgents");
  this.assignments = this.subscribe("allAssignments");
});

Template.agentDashboard.helpers({
  agentCallsign: () => {
    return Agents.findOne({agentid: FlowRouter.getParam('agentid')}).callsign;
  },

  agentId: () => {
    return Agents.findOne({agentid: FlowRouter.getParam('agentid')}).agentid;
  },

  agentName: () => {
    return Agents.findOne({agentid: FlowRouter.getParam('agentid')}).name;
  },

  agentEmail: () => {
    return Agents.findOne({agentid: FlowRouter.getParam('agentid')}).email;
  },

  assignments: () => {
    return Assignments.find({agentid: FlowRouter.getParam('agentid')});
  },

  lastMessage: (aid) => {
    return Messages.find({assignmentid: aid}, {sort: {datecreated: -1}, limit: 1});
  }
});

Template.agentDashboard.events({
  'click #logout' : (event, template) => {
    AccountsTemplates.logout();
  },

  'click #view-assignment' : (event, template) => {
    $('#assignment-view').addClass('active');
    $('.form-bg').addClass('active');
  },

  'click #message-assignment' : (event, template) => {
    $('#assignment-message').addClass('active');
    $('.form-bg').addClass('active');
  },

  'click #edit-profile' : (event, template) => {
    $('#profile-edit').addClass('active');
    $('.form-bg').addClass('active');
  },
});

//View Assignment
Template.viewAssignment.onCreated(function() {
  this.users = this.subscribe("allUsers");
  this.agents = this.subscribe("allAgents");
  this.assignments = this.subscribe("allAssignments");
});

Template.viewAssignment.helpers({
  assignmentDetail: () => {
    return Assignments.find({assignmentid: FlowRouter.getParam('assignmentid')});
  }
});

Template.viewAssignment.events({
  'click #cancel-view' : (event, template) => {
    $('#assignment-view').removeClass('active');
    $('.form-bg').removeClass('active');
    FlowRouter.go(`/agent-dash/${FlowRouter.getParam('agentid')}`);
  }
});

Template.viewAssignment.helpers({
  agentprofile: () => {
    return Agents.find({agentid: FlowRouter.getParam('agentid')});
  }
});

Template.viewAssignment.events({
  'click #cancel-form' : (event, template) => {
    $('#profile-edit').removeClass('active');
    $('.form-bg').removeClass('active');
    FlowRouter.go(`/agent-dash/${FlowRouter.getParam('agentid')}`);
  }
});

//Edit Profile
Template.editProfile.onCreated(function() {
  this.agents = this.subscribe("allAgents");
});

Template.editProfile.helpers({
  agentprofile: () => {
    return Agents.find({agentid: FlowRouter.getParam('agentid')});
  },

  onSuccess: () => {
    return (result) => {
      $('#profile-edit').removeClass('active');
      $('.form-bg').removeClass('active');
      FlowRouter.go(`/agent-dash/${FlowRouter.getParam('agentid')}`);
    };
  }
});

Template.editProfile.events({
  'click #cancel-form' : (event, template) => {
    event.preventDefault();
    $('#profile-edit').removeClass('active');
    $('.form-bg').removeClass('active');
    FlowRouter.go(`/agent-dash/${FlowRouter.getParam('agentid')}`);
  }
});

//Assignment Messaging
Template.messageAssignment.onCreated(function(aid) {
  this.assignments = this.subscribe("allAssignments");
  this.agents = this.subscribe("allAgents");
  this.users = this.subscribe("allUsers");

  //Collection subscription and call to server method
  this.messages = this.subscribe("allAssignmentMessages", FlowRouter.getParam('agentid'), FlowRouter.getParam('assignmentid'));

  //Call to client method
  Meteor.call("setMessageIDs", FlowRouter.getParam('agentid'), FlowRouter.getParam('assignmentid'));
});

Template.messageAssignment.helpers({
  messages: () => {
    return Messages.find({assignmentid: FlowRouter.getParam('assignmentid')}, {sort: {datecreated: -1}});
  },

  isSender: (sid) => {
    return (sid === FlowRouter.getParam('agentid')) ? true : false;
  },

  assignment: () => {
    return Assignments.find({assignmentid: FlowRouter.getParam('assignmentid')});
  }
});

Template.messageAssignment.events({
  'click #close-form' : (event, template) => {
    event.preventDefault();
    $('#assignment-message').removeClass('active');
    $('.form-bg').removeClass('active');
    window.history.back();
  }
});
