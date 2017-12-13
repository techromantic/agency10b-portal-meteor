//Application Init
Template.applicationLayout.onCreated(() => {
  Blaze._allowJavascriptUrls();
});

//Controller Login
Template.controllerLogin.onCreated(() => {
  setTimeout(() => {
    $('.at-form').addClass('login-form flex-column flex-center');
    $('.at-pwd-form form').addClass('flex-column flex-start');
    $('.at-form .at-title h3').addClass('login-title');
    $('.at-form .at-title h3').text('Welcome, Controller.');
    $('.at-pwd-form form .at-input').addClass('login-field');
    $('.at-pwd-form form .login-field input').addClass('bottom-border');
    $('.at-pwd-form form .at-btn').addClass('login-button');
    //$('.at-signup-link').addClass('hidden');
  }, 0);
});

//Agent Login
Template.agentLogin.onCreated(() => {
    setTimeout(() => {
        $('.at-form').addClass('login-form flex-column flex-center');
        $('.at-pwd-form form').addClass('flex-column flex-start');
        $('.at-form .at-title h3').addClass('login-title');
        $('.at-form .at-title h3').text('Welcome, Controller.');
        $('.at-pwd-form form .at-input').addClass('login-field');
        $('.at-pwd-form form .login-field input').addClass('bottom-border');
        $('.at-pwd-form form .at-btn').addClass('login-button');
        //$('.at-signup-link').addClass('hidden');
    }, 0);
});

Template.agentLogin.events({
    'click .login-image': function (e) {
        e.preventDefault();
        var userkey = document.getElementById('userkey').value;
        Meteor.call('checkAgentKey', userkey, function (err, result) {
          console.log(err);
          console.log(result);
          if(err) {
              alert('There is an error while checking credentials.');
          } else {
            if (result === true){
                FlowRouter.go(`/agent-dash/${userkey}`);
            } else {
                alert('That userkey is not acceptable.');
            }
          }
        });
    }
});
