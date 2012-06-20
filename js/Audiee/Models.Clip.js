/**
 * Model for single audio clip
 *
 * @file        Models.Clip.js
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