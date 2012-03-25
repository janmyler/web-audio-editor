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
            this.model.bind('change:trackPos', this.render);
            this.model.bind('change:startTime', this.render);
            this.model.bind('change:endTime', this.render);
            this.model.bind('destroy', this.remove);
            this.model.collection.bind('Audiee:zoomChange', this.render);

            this.editableName = new EditableNameV({
                model: this.model,
                className: 'clip-name',
                hasColor: true
            }),
            this.clipDisplay  = new ClipDisplayV({
                model: this.model
            });
        },

        render: function() {
            var left = Audiee.Display.sec2px(this.model.get('trackPos')),
                width = Audiee.Display.sec2px(this.model.get('endTime') - this.model.get('startTime'));

            console.log('Clip.render() ', left, width);

            $(this.el).empty()
                .css('left', left + 'px')                    
                .width(width)  
                .append(this.editableName.el)
                .append(this.clipDisplay.el);
            
            return this;
        },

        remove: function() {
            $(this.el).remove();
        }
    });
});