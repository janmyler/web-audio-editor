/**
 * Author: Jan Myler <honza.myler@gmail.com>
 * 
 * Model for single audio track.
 */

define([
	'underscore', 
	'backbone',
	'Audiee/Collections.Clips',
	'Audiee/Models.Clip'
], function(_, Backbone, ClipsC, ClipM) {
	var Track = Backbone.Model.extend({
		// default attributes
		defaults: {
			name: 'Untitled',
			color: '#ffa345',
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

			// view border times (seconds)
			// length: 3600, 		// 1 hour (default length)
			length: 900 		// 0.25 hour (default length)
		},

		// initialization
		initialize: function() {
			_.bindAll(this, 'initClip', 'remove');
			this.bind('remove', this.remove);
			this.clips = new ClipsC;
			this.initClip();
		},

		initClip: function() {
			var clip = new ClipM({
				name: this.get('file').name,
				endTime: this.get('buffer').duration,
				buffer: this.get('buffer')
			});
			this.clips.add(clip);
		},

		remove: function() {
			this.destroy();
		}


	});
		
	return Track;
});