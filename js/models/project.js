/*
 * Author: Jan Myler <honza.myler@gmail.com>
 * Filename: project.js
 * 
 * Model for project information.
 */

define([
    'underscore',
    'backbone'
], function(_, Backbone) {
    var Project = Backbone.Model.extend({
        // default attributes
        defaults: {
            name: 'Untitled',
            curr_time: 0           
        },

        // initialization
        initialize: function() {
            this.bind('error', function(model, err) {
                alert(err);
            });
        },

        // validation?
        validate: function(attribs) {
            if (attribs.name.length == 0)
                return "Project name cannot be empty.";
        }

    });

    return Project;
});