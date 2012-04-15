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
			color: '#00a0b0',
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

		deleteSelection: function(from, to, except) {
			this.clips.deleteSelection(from, to, except);
		},

		pasteSelection: function(position, clipboard) {
			for (var i = 0, len = clipboard.length; i < len; ++i) {
				var clip = new ClipM({
						startTime: 	clipboard[i].startTime,
						endTime: 	clipboard[i].endTime,
						trackPos: 	clipboard[i].offset + position,
						loop: 		clipboard[i].loop,
						name: 		clipboard[i].name,
						color: 		clipboard[i].color,
						buffer: 	clipboard[i].buffer
					}),
					from = clip.get('trackPos'),
					to = from + clip.clipLength();

				// delete space before pasting the new clip
				Audiee.Collections.Tracks.deleteSelection(from, to, this.cid);
				this.clips.add(clip);
            }
		}
	});
		
	return Track;
});