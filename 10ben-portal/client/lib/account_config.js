var userLogin = (error) => {
  if (!error)
    FlowRouter.go('stub');
};

var userLogout = () => {
  FlowRouter.go('login');
};

AccountsTemplates.configure({
  onSubmitHook: userLogin,
  onLogoutHook: userLogout
});
