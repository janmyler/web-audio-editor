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
        tagName: 'div',
        className: 'clip',

        initialize: function() {
            _.bindAll(this, 'render', 'remove');
            //this.model.bind('change', this.render); // TODO: prekresluje cely view, to je spatne!
            this.model.bind('change:track_pos', this.render);
            this.model.bind('change:start_time', this.render);
            this.model.bind('change:end_time', this.render);
            this.model.bind('destroy', this.remove);
        },

        render: function() {
            var editable_name = new EditableNameV({
                    model: this.model,
                    className: 'clip-name',
                    hasColor: true
                }),
                clip_display  = new ClipDisplayV({
                    model: this.model
                });

            $(this.el).empty()
                .css('left', this.model.get('track_pos') + 'px')                    // TODO: zoom ratio must be involved
                .width(this.model.get('end_time') - this.model.get('start_time'))   // TODO: zoom ratio must be involved
                .append(editable_name.el)
                .append(clip_display.el);
            
            return this;
        },

        remove: function() {
            $(this.el).remove();
        }
    });
});