var userLogin = (error) => {
  if (!error)
    FlowRouter.go('control-dash');

  //Add more checks if user is controller or agent
};

var userLogout = () => {
  FlowRouter.go('control-login');
};

AccountsTemplates.configure({
  onSubmitHook: userLogin,
  onLogoutHook: userLogout
});
