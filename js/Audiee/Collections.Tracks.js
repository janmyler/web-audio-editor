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
	return Backbone.Collection.extend({
        // model reference
        model: TrackM,

        getSnapshot: function(from, to, cid) {
            return this.getByCid(cid).getSnapshot(from, to);
        },

        deleteSelection: function(from, to, cid) {
            this.getByCid(cid).deleteSelection(from, to);
        },

        pasteSelection: function(cid, position, clipboard) {
            this.getByCid(cid).pasteSelection(position, clipboard);
        }
	});
});