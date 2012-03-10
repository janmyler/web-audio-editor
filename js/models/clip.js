/*
 * Author: Jan Myler <honza.myler@gmail.com>
 * Filename: clip.js
 * 
 * Model for single audio clip.
 */

define(['jquery', 'underscore', 'backbone'], function() {
	var Clip = Backbone.Model.extend({
		// default attributes
		defaults: {
			name: 'untitled',
			source: undefined,
			color: '#3CA9B5',
			track_id: undefined,
			track_pos: 0,
			start_time: 0,
			end_time: 0
		},

		// initialization
		initialize: function() {
			console.log('clip has been initialized');
		},

		// validation?
		validate: function(attribs) {
			if (attribs.attr === undefined)
				return "Error msg";
		}

	});

	return Clip;
});