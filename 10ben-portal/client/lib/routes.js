//Base Application
FlowRouter.route('/', {
  action: () => {
    if (!Meteor.user() && !Meteor.loggingIn())
      FlowRouter.go('agent-login');
    else if (Meteor.user() || Meteor.loggingIn())
      FlowRouter.go('control-login');
  }
});

//Login Routes
//Controller Login
FlowRouter.route('/control-login', {
  action: () => {
    if (!Meteor.user() && !Meteor.loggingIn())  {
      BlazeLayout.render('applicationLayout', {
        main: 'controllerLogin'
      })
    } else if (Meteor.user() || Meteor.loggingIn())
      FlowRouter.go('control-dash');
  },
  name: 'control-login'
});

//Agent Login
FlowRouter.route('/agent-login', {
    action: () => {
      BlazeLayout.render('applicationLayout', {
          main: 'agentLogin'
      })
    },
    name: 'agent-login'
});

//Dashboard Routes
//Agent Dashboard
FlowRouter.route('/agent-dash/:agentid', {
  action: () => {
    BlazeLayout.render('applicationLayout', {
      main: 'agentDashboard'
    })
  },
  name: 'agent-dash'
});

//Controller Dashboard
FlowRouter.route('/control-dash', {
  action: () => {
    if (!Meteor.user() && !Meteor.loggingIn())
      FlowRouter.go('control-login');
    else if (Meteor.user() || Meteor.loggingIn()) {
      BlazeLayout.render('applicationLayout', {
        main: 'controllerDashboard'
      })
    }
  },
  name: 'control-dash'
});

//Create Routes
//Add Agent
FlowRouter.route( '/control-dash/add/agent/', {
  action: () => {
    if (!Meteor.user() && !Meteor.loggingIn())
      FlowRouter.go('control-login');
    else if (Meteor.user() || Meteor.loggingIn()) {
        BlazeLayout.render('applicationLayout', {
          main: 'createAgent'
        })
    }
  },
  name: 'add-agent'
});

//Add Assignment
FlowRouter.route( '/control-dash/add/assignment/', {
  action: () => {
    if (!Meteor.user() && !Meteor.loggingIn())
      FlowRouter.go('control-login');
    else if (Meteor.user() || Meteor.loggingIn()) {
        BlazeLayout.render('applicationLayout', {
          main: 'createAssignment'
        })
    }
  },
  name: 'add-assignment'
});

//Edit Routes
//Edit Agent
FlowRouter.route( '/control-dash/edit/agent/:agentid', {
  action: () => {
    if (!Meteor.user() && !Meteor.loggingIn())
      FlowRouter.go('control-login');
    else if (Meteor.user() || Meteor.loggingIn()) {
        BlazeLayout.render('applicationLayout', {
          main: 'editAgent'
        })
    }
  },
  name: 'edit-agent'
});

//Edit Assignment
FlowRouter.route( '/control-dash/edit/assignment/:assignmentid', {
  action: () => {
    if (!Meteor.user() && !Meteor.loggingIn())
      FlowRouter.go('control-login');
      else if (Meteor.user() || Meteor.loggingIn()) {
        BlazeLayout.render('applicationLayout', {
          main: 'editAssignment'
        })
      }
  },
  name: 'edit-assignment'
});

//Edit Profile
FlowRouter.route('/agent-dash/:agentid/edit/profile', {
  action: () => {
  },
  name: 'edit-profile'
});


//View Routes
//View Assignment
FlowRouter.route('/agent-dash/:agentid/view/assignment/:assignmentid', {
  action: () => {
  },
  name: 'view-assignment'
});


//Message Routes
//View Assignment Message (Controller)
FlowRouter.route( '/control-dash/:agentid/message/assignment/:assignmentid', {
  action: () => {
    if (!Meteor.user() && !Meteor.loggingIn()) {
      FlowRouter.go('control-login');
    } else {
      BlazeLayout.render('applicationLayout', {
          main: 'messageAssignment'
      })
    }
  },
  name: 'message-assignment-control'
});

//View Assignment Message (Agent)
FlowRouter.route( '/agent-dash/:agentid/message/assignment/:assignmentid', {
  action: () => {
    BlazeLayout.render('applicationLayout', {
        main: 'messageAssignment'
    })
  },
  name: 'message-assignment-agent'
});
