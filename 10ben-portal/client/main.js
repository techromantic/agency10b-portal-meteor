import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import SimpleSchema from 'simpl-schema';
import './main.html';

//Simple Schema
SimpleSchema.extendOptions(['autoform']);
SimpleSchema.debug = true;

//Collections

//Schemas

//Template Helpers
Template.applicationLayout.onCreated(() => {
  Blaze._allowJavascriptUrls();
});

Template.login.onCreated(() => {
  setTimeout(() => {
    $('.at-form').addClass('login-form flex-column flex-center');
    $('.at-pwd-form form').addClass('flex-column flex-start');
    $('.at-form .at-title h3').addClass('login-title');
    $('.at-form .at-title h3').text('Welcome, Controller.');
    $('.at-pwd-form form .at-input').addClass('login-field');
    $('.at-pwd-form form .at-btn').addClass('login-button');
    $('.at-signup-link').addClass('hidden');
  }, 0);
});

Template.stub.events({
  'click #logout' : (event, template) => {
    AccountsTemplates.logout();
  }
})
