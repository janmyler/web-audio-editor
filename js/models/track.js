/*
 * Author: Jan Myler <honza.myler@gmail.com>
 * Filename: track.js
 * 
 * Model for single audio track.
 */

define(['jquery', 'underscore', 'backbone'], function() {
	var Track = Backbone.Model.extend({
		// default attributes
		defaults: {
			name: 'untitled',
			color: '#356871',
			// allow +gain? (should be useful) like:
			// volume_max: 1.4,
			volume: 1,
			pan: 0.5,
			muted: false,
			solo: false,
			// allow minimalization (view purpose)
			// minimalized: false,

			// if there is only one audio souce for one track
			// and this source can be splitted into several clips,
			// source may be here (not in defaults, but in track model)
			// ... but idk yet

			// view border times (ms)
			max_length: 3600000, 	// 1 hour (max length)
			start_time: 0,
			end_time: 0
		},

		// initialization
		initialize: function() {
			var name = this.get('name') || this.defaults.name;
			console.log('track ' + name + ' has been initialized');
		},

		// validation?
		validate: function(attribs) {
			if (attribs.attr === undefined)
				return "Error msg";
		},

		// debug print
		print: function() {
			console.log(this);
		}
	});
		
	return Track;
});