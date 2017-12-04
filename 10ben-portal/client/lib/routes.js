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

//Edit Agent
FlowRouter.route( '/control-dash/edit/agent/:agentid', {
  action: () => {
    if (!Meteor.user() && !Meteor.loggingIn()) {
      FlowRouter.go('login');
    }
  },
  name: 'editagent'
});

//Edit Assignment
FlowRouter.route( '/control-dash/edit/assignment/:assignmentid', {
  action: () => {
    if (!Meteor.user() && !Meteor.loggingIn()) {
      FlowRouter.go('login');
    }
  },
  name: 'editassignment'
});
