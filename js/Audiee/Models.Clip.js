/**
 * Author: Jan Myler <honza.myler@gmail.com>
 * 
 * Model for single audio clip.
 */

define([
	'underscore',
	'backbone'
], function(_, Backbone) {
	var Clip = Backbone.Model.extend({
		// default attributes
		defaults: {
			name: 'untitled',
			//source: undefined,	// NOTE: it's one source for one track so far (source property moved to the track model)
			color: '#4ecdc4',
			trackPos: 0,
			startTime: 0,
			endTime: 0,
			loop: 0
		},

		// initialization
		initialize: function() {
			// console.log('clip ' + this.get('name') + ' has been initialized');
		},

		clipLength: function() {
            return this.get('endTime') 
              - this.get('startTime') 
              + this.get('loop')
              * this.get('buffer').duration;
        },

        duplicate: function() {
        	var newClip = this.clone(),
        		newTrackPos = newClip.get('trackPos') + this.clipLength();
        	newClip.set('trackPos', newTrackPos);
        	this.collection.addDuplicate(newClip);
        }
	});

	return Clip;
});