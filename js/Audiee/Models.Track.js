/**
 * Author: Jan Myler <honza.myler@gmail.com>
 * 
 * Model for single audio track.
 */

define([
	'underscore', 
	'backbone',
	'Audiee/Collections.Clips'
], function(_, Backbone, ClipsC) {
	var Track = Backbone.Model.extend({
		// default attributes
		defaults: {
			name: 'Untitled',
			color: '#356871',
			gain: 1,
			pan: 0.5,
			muted: false,
			solo: false,
			// order: 1, // won't be here, will be for purpose of sorting in view
			// allow minimalization (view purpose)
			// minimalized: false,

			// if there is only one audio souce for one track
			// and this source can be splitted into several clips,
			// source may be here (not in defaults, but in track model)
			// ... but idk yet

			// view border times (ms)
			default_length: 3600000, 	// 1 hour (default length)
			start_time: 0,		// FIXME: useful? track will be from 0 to max_length..
			end_time: 0			// FIXME: useful at all?
		},

		// initialization
		initialize: function() {
			this.clips = new ClipsC;
		}
	});
		
	return Track;
});