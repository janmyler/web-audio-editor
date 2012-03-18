/**
 * Author: Jan Myler <honza.myler@gmail.com>
 * 
 * Collection for audio tracks.
 */

define([
    'underscore',
    'backbone',
    'Audiee/Models.Track'
], function(_, Backbone, TrackM) {
	var TracksCollection = Backbone.Collection.extend({
        // model reference
        model: TrackM

        // other functions will be here ...
	});

	return TracksCollection;
});