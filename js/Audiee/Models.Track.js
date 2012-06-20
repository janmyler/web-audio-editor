/**
 * Model for single audio track
 *
 * @file        Models.Track.js
 * @author      Jan Myler <honza.myler[at]gmail.com>
 * @copyright   Copyright 2012, Jan Myler (http://janmyler.com)
 * @license     MIT License (http://www.opensource.org/licenses/mit-license.php)
 *
 * Licensed under The MIT License
 * Redistributions of files must retain the above copyright notice.
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
			length: 1920		// 32 minutes (default length)
		},

		// initialization
		initialize: function() {
			_.bindAll(this, 'initClip', 'remove', 'resetDuplicates');
			this.bind('remove', this.remove);
			this.bind('change:name', this.resetDuplicates);
			this.clips = new ClipsC;
			this.initClip();
			Audiee.Player.initTrack(this.cid);
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
			Audiee.Player.releaseTrack(this.cid);
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
		},

		resetDuplicates: function() {
			this.duplicates = undefined;
		},

		duplicate: function() {
			var newTrack = this.clone(),
				newName  = newTrack.get('name'),
				match    = newName.match(/\(\d+\)$/),
				index;

			newTrack.clips.reset(this.clips.toJSON());

			if (this.duplicates) {	// was duplicated before?
				this.duplicates.count += 1;	// yes, increment the counter
			} else {
				this.duplicates = { count: 2};	// no, create the counter object
			}			
			index = this.duplicates.count;

			if (match) {
				newName = newName.replace(/\(\d+\)$/, ' (' + index + ')');
			} else {
				newName += ' (' + index + ')';
			}

			newTrack.set('name', newName);
			newTrack.duplicates = this.duplicates;
			this.collection.add(newTrack);
			this.collection.decIndexCount();
		}
	});
		
	return Track;
});