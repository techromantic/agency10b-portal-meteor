//Base Application
FlowRouter.route('/', {
  action: () => {
    if (!Meteor.user() && !Meteor.loggingIn())
      FlowRouter.go('login');
    else if (Meteor.user() || Meteor.loggingIn())
      FlowRouter.go('stub');
  }
});


//Controller Login
FlowRouter.route('/login', {
  action: () => {
    if (!Meteor.user() && !Meteor.loggingIn())  {
      BlazeLayout.render('applicationLayout', {
        main: 'login'
      })
    } else if (Meteor.user() || Meteor.loggingIn())
      FlowRouter.go('stub');
  },
  name: 'login'
});


//Stub Page
FlowRouter.route('/stub', {
  action: () => {
    if (!Meteor.user() && !Meteor.loggingIn())
      FlowRouter.go('login');
    else if (Meteor.user() || Meteor.loggingIn()) {
      BlazeLayout.render('applicationLayout', {
        main: 'stub'
      })
    }
  },
  name: 'stub'
});
