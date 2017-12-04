//Base Application
FlowRouter.route('/', {
  action: () => {
    if (!Meteor.user() && !Meteor.loggingIn())
      FlowRouter.go('control-login');
    else if (Meteor.user() || Meteor.loggingIn())
      FlowRouter.go('control-dash');
  }
});


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


//Stub Page
FlowRouter.route('/stub', {
  action: () => {
    if (!Meteor.user() && !Meteor.loggingIn())
      FlowRouter.go('control-login');
    else if (Meteor.user() || Meteor.loggingIn()) {
      BlazeLayout.render('applicationLayout', {
        main: 'stub'
      })
    }
  },
  name: 'stub'
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

//Add Agent
FlowRouter.route( '/control-dash/add/agent/', {
  action: () => {
    if (!Meteor.user() && !Meteor.loggingIn()) {
      FlowRouter.go('login');
    }
  },
  name: 'add-agent'
});

//Add Assignment
FlowRouter.route( '/control-dash/add/assignment/', {
  action: () => {
    if (!Meteor.user() && !Meteor.loggingIn()) {
      FlowRouter.go('login');
    }
  },
  name: 'add-assignment'
});

//Edit Agent
FlowRouter.route( '/control-dash/edit/agent/:agentid', {
  action: () => {
    if (!Meteor.user() && !Meteor.loggingIn()) {
      FlowRouter.go('login');
    }
  },
  name: 'edit-agent'
});

//Edit Assignment
FlowRouter.route( '/control-dash/edit/assignment/:assignmentid', {
  action: () => {
    if (!Meteor.user() && !Meteor.loggingIn()) {
      FlowRouter.go('login');
    }
  },
  name: 'edit-assignment'
});
