/*
 * Author: Jan Myler <honza.myler@gmail.com>
 * Filename: clips.js
 * 
 * Collection for audio clips.
 */

define(['models/clip'], function(Clip) {
	var ClipCollection = Backbone.Collection.extend({
		// model reference
		model: Clip,




	});

	return new ClipCollection;
});
