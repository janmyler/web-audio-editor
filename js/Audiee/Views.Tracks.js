/**
 * Author: Jan Myler <honza.myler@gmail.com>
 * 
 * View for the collection of tracks.
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'Audiee/Views.Track'
], function($, _, Backbone, TrackV) {
    
    return Backbone.View.extend({
        initialize: function() {
            _.bindAll(this, 'render', 'addAll', 'addOne', 'zoomChange');
            this.collection.bind('add', this.addOne);
            this.bind('Audiee:scroll', this.alignTrackControls);
            this.bind('Audiee:zoomChange', this.zoomChange);
        },

        render: function() {
            console.log('Tracks.render()');
            this.addAll();
            return this;
        },

        addAll: function() {
            console.log('Tracks.addAll()');
            this.collection.each(this.addOne);
        },

        addOne: function(model) {
            console.log('Tracks.addOne()');
            var track = new TrackV({model: model});
            $(this.el).append(track.render().el);
        },

        alignTrackControls: function(scrollLeft) {
            $('div.track-name, div.track-controls').css('left', scrollLeft + 'px');
        },

        zoomChange: function() {
            this.collection.each(function(model) {
                model.trigger('Audiee:zoomChange');
                model.clips.trigger('Audiee:zoomChange');
            });
        }
    });
});