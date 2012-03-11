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
	var ClipCollection = Backbone.Collection.extend({
		// model reference
		model: Clip,


	});

	return new ClipCollection;
});