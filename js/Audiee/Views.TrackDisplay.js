/**
 * Author: Jan Myler <honza.myler@gmail.com>
 * 
 * View for clips container within a track.
 */

define([
    'jquery',
    'underscore',
    'backbone',
], function($, _, Backbone) {
    // sets the Mustache format delimiter: {{ variable }}
    _.templateSettings = {
        interpolate: /\{\{(.+?)\}\}/g
    };

    return Backbone.View.extend({
        tagName: 'div',
        className: 'track-display',

        template: _.template(
            '<canvas width="{{ width }}" height="{{ height }}">' +
                'Your browser does not support HTML5 canvas.' +
            '</canvas>'
        ),

        initialize: function() {
            _.bindAll(this, 'render', 'zoomChange');
            this.model.bind('Audiee:zoomChange', this.zoomChange);
            this.render();
        },

        render: function() {
            console.log('Display.render()');
            // calculate width and height
            var width = Audiee.Display.sec2px(this.model.get('length')),
                height = 100;

            $(this.el).html(this.template({
                width: width,
                height: height
            })).width(width);
            return this;
        },

        zoomChange: function() {
            var width = Audiee.Display.sec2px(this.model.get('length'));
            $(this.el).width(width)
                .find('canvas').attr('width', width); // FIXME: solution with template re-rendering?
        }
    });
});