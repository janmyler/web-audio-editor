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
            this.editableName = new EditableNameV({
                model: this.model,
                className: 'track-name',
                hasColor: true
            }),
            this.trackDisplay = new TrackDisplayV({
                model: this.model
            }),
            this.trackControls = new TrackControlsV({
            });

            $(this.el).empty().width(this.model.get('default_length') / 1000)   // FIXME: prob not the best solution
                .append(this.editableName.el)
                .append(this.trackControls.el)
                .append(this.trackDisplay.el);

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