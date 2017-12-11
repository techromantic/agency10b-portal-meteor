//FlowRouter Autoform Hooks
AutoForm.addHooks(null, {
    onError: (name, error, template) => {
      console.log(name + " error:", error);
    }
});

AutoForm.addHooks('addAgent', {
    onSubmit: (doc) => {
      AgentSchema.clean(doc);
      this.done();
      return false;
    },
    onError: (formType, error) => {
      alert("Error adding agent: " + error);
    },
    onSuccess: (formType, result) => {
      $('#agent-add').removeClass('active');
      $('.form-bg').removeClass('active');

        var agent = Agents.findOne({_id: result});
        Meteor.call('newAgentEmail', agent, (err, result) => {
            if(err) {
                alert('There was an error while sending the email.');
            } else {
                if (result === true) {
                    alert('Email was succesfully sent.');
                } else {
                    alert('Email may not have been sent.');
                }
            }
        });
        FlowRouter.go('control-dash');
    }
});

AutoForm.addHooks('editAgent', {
    onSubmit: (doc) => {
      AgentSchema.clean(doc);
      this.done();
      return false;
    },
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
    onSubmit: (doc) => {
      AgentSchema.clean(doc);
      this.done();
      return false;
    },
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
    onSubmit: (doc) => {
      AssignmentSchema.clean(doc);
      this.done();
      return false;
    },
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
    onSubmit: (doc) => {
      AssignmentSchema.clean(doc);
      this.done();
      return false;
    },
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
    onSubmit: (doc) => {
      MessageSchema.clean(doc);
      this.done();
      return false;
    },
    onError: (formType, error) => {
      alert("Error sending message: " + error);
    },
    onSuccess: (formType, result) => {
    }
});
