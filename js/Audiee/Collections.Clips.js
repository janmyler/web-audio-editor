/**
 * Author: Jan Myler <honza.myler@gmail.com>
 * Filename: clips.js
 * 
 * Collection for audio clips.
 */

define([
    'underscore',
    'backbone',
    'Audiee/Models.Clip'
], function(_, Backbone, Clip) {
	var ClipsCollection = Backbone.Collection.extend({
		// model reference
		model: Clip

        // other functions will be here ...
	});

	return new ClipsCollection;
});