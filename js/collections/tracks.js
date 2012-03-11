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
	var TrackCollection = Backbone.Collection.extend({
        // model reference
        model: Track,



	});

	return new TrackCollection;
});