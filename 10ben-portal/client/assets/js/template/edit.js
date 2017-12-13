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
    window.history.back();
  },

  'click #accept-assignment' : (event, template) => {
    Meteor.call('acceptAssignment', FlowRouter.getParam('assignmentid'), FlowRouter.getParam('agentid'));
  },

  'click .view-section .view-section-title' : (event, template) => {
    $('.view-section').removeClass('active');
    $('.view-section').css("left", "");
    $('.view-section.one').css("left", "0px");
    $('.view-section.two').css("left", "250px");
    $('.view-section.three').css("left", "500px");
    console.log('reset');

    if ($(event.target).parent('.view-section').hasClass('one')) {
      console.log('clicked 1');
      $('.view-section.two').css("left", "250px");
      $('.view-section.three').css("left", "500px");
    } else if ($(event.target).parent('.view-section').hasClass('two')) {
      console.log('clicked 2');
      $('.view-section.one').css("left", "250px");
      $('.view-section.three').css("left", "500px");
    } else if ($(event.target).parent('.view-section').hasClass('three')) {
      console.log('clicked 3');
      $('.view-section.one').css("left", "250px");
      $('.view-section.two').css("left", "500px");
    }

    $(event.target).parent('.view-section').addClass('active');
  }
});

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
    window.history.back();
  }
});
