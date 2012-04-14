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
			// allow minimalization (view purpose)?
			// minimalized: false,

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
		},

		getSnapshot: function(from, to) {
			return this.clips.getSnapshot(from, to);
		},

		deleteSelection: function(from, to) {
			this.clips.deleteSelection(from, to);
		}
	});
		
	return Track;
});