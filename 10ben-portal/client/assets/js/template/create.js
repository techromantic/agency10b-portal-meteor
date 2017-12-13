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
