/*
 * Author: Jan Myler <honza.myler@gmail.com>
 * Filename: tracks.js
 * 
 * Collection for audio tracks.
 */

define(['models/track'], function(Track) {
	var TrackCollection = Backbone.Collection.extend({
        // model reference
        model: Track,



	});

	return new TrackCollection;
});