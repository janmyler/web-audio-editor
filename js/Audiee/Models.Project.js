/**
 * Model for project information
 *
 * @file        Models.Project.js
 * @author      Jan Myler <honza.myler[at]gmail.com>
 * @copyright   Copyright 2012, Jan Myler (http://janmyler.com)
 * @license     MIT License (http://www.opensource.org/licenses/mit-license.php)
 *
 * Licensed under The MIT License
 * Redistributions of files must retain the above copyright notice.
 */

define([
    'underscore',
    'backbone'
], function(_, Backbone) {
    var Project = Backbone.Model.extend({
        // default attributes
        defaults: {
            name: 'Untitled',
            created: Date.now(),
            user: 'Guest', 
            changed: false
        },

        // initialization
        initialize: function() {
            this.bind('error', function(model, err) {
                alert(err);
            });
        },

        // validation?
        validate: function(attribs) {
            var regex = /^(\w+[\ ]*)+$/;
            if (!regex.test(attribs.name))
                return "Project name is invalid.";
        }
    });

    return Project;
});