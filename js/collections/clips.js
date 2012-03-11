/*
 * Author: Jan Myler <honza.myler@gmail.com>
 * Filename: clips.js
 * 
 * Collection for audio clips.
 */

define([
    'underscore',
    'backbone',
    'models/clip'
], function(_, Backbone, Clip) {
	var ClipsCollection = Backbone.Collection.extend({
		// model reference
		model: Clip

        // other functions will be here ...
	});

	return new ClipsCollection;
});