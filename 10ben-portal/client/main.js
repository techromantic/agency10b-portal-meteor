import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { SimpleSchema } from 'meteor/simple-schema';
import './main.html';

//Simple Schema
SimpleSchema.extendOptions(['autoform']);
SimpleSchema.debug = true;

//Collections

//Schemas

//Template Helpers
Template.applicationLayout.onCreated(function() {
  Blaze._allowJavascriptUrls();
});
