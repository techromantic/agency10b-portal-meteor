//Logout Config
var redirectOnLogout = () => {
  FlowRouter.go('/login');
}

AccountsTemplates.configure({
  onLogoutHook: redirectOnLogout
});

//Account Config
AccountsTemplates.addFields([
  {
    _id: 'callsign',
    type: 'text',
    displayName: 'Callsign',
    placeholder: 'Callsign',
    required: true
  }
]);

var email = AccountsTemplates.removeField('email');
AccountsTemplates.addField(email);

var password = AccountsTemplates.removeField('password');
AccountsTemplates.addField(password);
