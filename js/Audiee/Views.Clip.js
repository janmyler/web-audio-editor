/**
 * Author: Jan Myler <honza.myler@gmail.com>
 * 
 * View for a single audio clip.
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'Audiee/Views.ClipDisplay',
    'Audiee/Views.EditableName'
], function($, _, Backbone, ClipDisplayV, EditableNameV) {
    // sets the Mustache format delimiter: {{ variable }}
    _.templateSettings = {
        interpolate: /\{\{(.+?)\}\}/g
    };

    return Backbone.View.extend({
        className: 'clip',

        initialize: function() {
            _.bindAll(this, 'render', 'remove');
            this.model.bind('change', this.render); // prekresluje cely view, to je spatne!
            this.model.bind('destroy', this.remove);
        },

        render: function() {
            console.log('rendering clip', e);
            // rendering canvas width and height?
            var editable_name = new EditableNameV({
                    model: this.model,
                    className: 'clip-name',
                    hasColor: true
                }),
                clip_display  = new ClipDisplayV();

            $(this.el).empty()
                .append(editable_name.el)
                .append(clip_display.el);
            return this;
        },

        remove: function() {
            $(this.el).remove();
        }
    });
});