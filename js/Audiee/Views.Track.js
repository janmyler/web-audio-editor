/**
 * Author: Jan Myler <honza.myler@gmail.com>
 * 
 * View for a single editor track.
 */

define([
    'underscore',
    'backbone',
    'Audiee/Views.EditableName',
    'Audiee/Views.TrackDisplay',
    'Audiee/Views.TrackControls',
    'Audiee/Views.Clips'
], function(_, Backbone, EditableNameV, TrackDisplayV, TrackControlsV, ClipsV) {

    return Backbone.View.extend({
        tagName: 'div',
        className: 'track',

        initialize: function () {
            _.bindAll(this, 'render', 'remove');
        },

        render: function() {
            console.log('Track.render()');
            var editable_name = new EditableNameV({
                    model: this.model,
                    className: 'track-name',
                    hasColor: true
                }),
                track_display = new TrackDisplayV({
                    model: this.model
                }),
                track_controls = new TrackControlsV({

                });

            $(this.el).empty().width(this.model.get('max_length') / 1000)   // FIXME: prob not the best solution
                .append(editable_name.el)
                .append(track_controls.el)
                .append(track_display.el);

            new ClipsV({
                collection: clips,
                el: $('.track-display', this.el)
            }).render();

            return this;
        },

        remove: function() {
            $(this.el).remove();
        }  
    });
});