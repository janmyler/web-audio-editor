/**
 * Collection for audio tracks
 *
 * @file        Collections.Tracks.js
 * @author      Jan Myler <honza.myler[at]gmail.com>
 * @copyright   Copyright 2012, Jan Myler (http://janmyler.com)
 * @license     MIT License (http://www.opensource.org/licenses/mit-license.php)
 *
 * Licensed under The MIT License
 * Redistributions of files must retain the above copyright notice.
 */

define([
    'underscore',
    'backbone',
    'Audiee/Models.Track'
], function(_, Backbone, TrackM) {
	return Backbone.Collection.extend({
        // model reference
        model: TrackM,

        initialize: function() {
            this.indexCount = 1;
            _.bindAll(this, 'incIndexCount');
            this.bind('add', this.incIndexCount);
        },

        getSnapshot: function(from, to, cid) {
            return this.getByCid(cid).getSnapshot(from, to);
        },

        deleteSelection: function(from, to, cid, except) {
            this.getByCid(cid).deleteSelection(from, to, except);
        },

        pasteSelection: function(cid, position, clipboard) {
            this.getByCid(cid).pasteSelection(position, clipboard);
        },

        incIndexCount: function() {
            this.indexCount += 1;
        },

        decIndexCount: function() {
            this.indexCount -= 1;
        },

        getIndexCount: function() {
            return this.indexCount;
        },

        isAnySolo: function() {
            var soloTracks = this.filter(
                function(model) { 
                    return model.get('solo') === true;
                }
            );

            return soloTracks.length > 0;
        }
	});
});