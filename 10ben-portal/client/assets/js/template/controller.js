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
  },

  getDueColor: (deadline) => {
      console.log(deadline);
      if(moment(deadline).isBefore(moment().add(3, 'days'))){
          return 'due-3d';
      }
      if(moment(deadline).isBefore(moment().add(1, 'weeks'))){
          return 'due-1w';
      }
      if(moment(deadline).isBefore(moment().add(2, 'weeks'))){
          return 'due-2w';
      }
      if(moment(deadline).isBefore(moment().add(1, 'months'))){
          return 'due-1m';
      }
      if(moment(deadline).isBefore(moment().add(3, 'months'))){
          return 'due-3m';
      }
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

  // 'click #add-assignment' : (event, template) => {
  //   $('#assignment-add').addClass('active');
  //   $('.form-bg').addClass('active');
  // },

  'click #edit-agent' : (event, template) => {
    $('#agent-edit').addClass('active');
    $('.form-bg').addClass('active');
  },

  // 'click #edit-assignment' : (event, template) => {
  //   $('#assignment-edit').addClass('active');
  //   $('.form-bg').addClass('active');
  // },

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

  openAssignments: () => {
    return Assignments.find({status: 'Open'});
  },

  lastMessage: (aid) => {
    return Messages.find({assignmentid: aid}, {sort: {datecreated: -1}, limit: 1});
  },

  noConfirmation: (status) => {
    return !(status === 'Accepted' || status === 'Rejected') ? true : false;
  },

  getDueColor: (deadline) => {
      console.log(deadline);
      if(moment(deadline).isBefore(moment().add(3, 'days'))){
          return 'due-3d';
      }
      if(moment(deadline).isBefore(moment().add(1, 'weeks'))){
          return 'due-1w';
      }
      if(moment(deadline).isBefore(moment().add(2, 'weeks'))){
          return 'due-2w';
      }
      if(moment(deadline).isBefore(moment().add(1, 'months'))){
          return 'due-1m';
      }
      if(moment(deadline).isBefore(moment().add(3, 'months'))){
          return 'due-3m';
      }
  }
});

Template.agentDashboard.events({
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

  'click #accept-assignment' : (event, template) => {
    Meteor.call('acceptAssignment', $(event.target).data("assignmentid"), FlowRouter.getParam('agentid'));
  }
});
