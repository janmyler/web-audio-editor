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
            _.bindAll(this, 'render', 'addAll', 'addOne', 'zoomChange', 'scrollChange');
            this.collection.bind('add', this.addOne);
            this.bind('Audiee:scroll', this.scrollChange);
            this.bind('Audiee:zoomChange', this.zoomChange);
        },

        render: function() {
            this.addAll();
            return this;
        },

        addAll: function() {
            this.collection.each(this.addOne);
        },

        addOne: function(model) {
            var track = new TrackV({model: model});
            $(this.el).append(track.render().el);
        },

        scrollChange: function() {
            // NOTE: This solution is not working good!
            // FIXME: rewrite for top scroll... for track-info
            // var scrollTop = Audiee.Views.Editor.scrollTopOffset();
            // $('div.track-info').css('margin-top', -scrollTop + 'px');     

            var scrollLeft = Audiee.Views.Editor.scrollLeftOffset();
            $('div.track-info').css('left', scrollLeft + 'px');
            this.collection.each(function(model) {
                model.clips.trigger('Audiee:scroll');
            });
        },

        zoomChange: function() {
            this.collection.each(function(model) {
                model.trigger('Audiee:zoomChange');
                model.clips.trigger('Audiee:zoomChange');
            });
        }
    });
});