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
			color: '#3CA9B5',
			track_pos: 0,
			start_time: 0,
			end_time: 0
		},

		// initialization
		initialize: function() {
			console.log('clip ' + this.get('name') + ' has been initialized');
		}
	});

	return Clip;
});