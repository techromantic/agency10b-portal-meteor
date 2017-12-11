import { Email } from 'meteor/email';
var senderID;
var assignmentID;

Meteor.startup(() => {
  // code to run on server at startup
    process.env.MAIL_URL = "smtp://postmaster@sandbox7f352be01259405aacba840a713f2ad0.mailgun.org:25fa41a946c85fb6ebca0c9989cf6959@smtp.mailgun.org:587";
});

Meteor.users.allow({
  'update' : () => {
    return true;
  }
})

//Server Methods
Meteor.methods({
    'checkAgentKey': (userkey) => {
        return (Agents.findOne({agentid: userkey})) ? true : false;
    },
    'newAgentEmail': (agent) => {
        SSR.compileTemplate('newAgentEmail', Assets.getText('newagent.html'));

        let agentData = {
            name: agent.name,
            userkey: agent.userkey,
        };

        Email.send({
            to: agent.email,
            from: "sarim@10ben.io",
            subject: "Welcome to 10Ben",
            html: SSR.render('newAgentEmail', agentData),
        });
    },
    'setMessageIDs': (sid, aid) => {
      if (this.isSimulation) {
        senderID = FlowRouter.getParam('agentid');
        assignmentID = FlowRouter.getParam('assignmentid');
      } else {
        senderID = sid;
        assignmentID = aid;
      }
    },
    'getSenderID': () => {
      return senderID;
    },
    'getAssignmentID': () => {
      return assignmentID;
    }
});
