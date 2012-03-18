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
            _.bindAll(this, 'render', 'addAll', 'addOne');
            this.collection.bind('add', this.addOne);
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
            model.bind('remove', track.remove);  // TODO: ?? w00t?
        }
    });
});