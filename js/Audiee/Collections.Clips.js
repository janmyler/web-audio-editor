/**
 * Author: Jan Myler <honza.myler@gmail.com>
 * 
 * Collection for audio clips.
 */

define([
    'underscore',
    'backbone',
    'Audiee/Models.Clip'
], function(_, Backbone, ClipM) {
	var ClipsCollection = Backbone.Collection.extend({
		// model reference
		model: ClipM

        // other functions will be here ...
	});

	return ClipsCollection;
});