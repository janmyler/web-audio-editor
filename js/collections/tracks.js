/*
 * Author: Jan Myler <honza.myler@gmail.com>
 * Filename: tracks.js
 * 
 * Collection for audio tracks.
 */

define([
    'underscore',
    'backbone',
    'models/track'
], function(_, Backbone, Track) {
	var TracksCollection = Backbone.Collection.extend({
        // model reference
        model: Track

        // other functions will be here ...
	});

	return new TracksCollection;
});