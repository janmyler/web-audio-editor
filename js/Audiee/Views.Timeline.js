/**
 * Author: Jan Myler <honza.myler@gmail.com>
 * 
 * View for timeline panel.
 */

define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {
    // sets the Mustache format delimiter: {{ variable }}
    _.templateSettings = {
        interpolate: /\{\{(.+?)\}\}/g
    };

    return Backbone.View.extend({
        // parent DOM element
        el: $('#time-line'),

        template: _.template(
            '<canvas width="{{ width }}" height="{{ height }}">' +
                'Your browser does not support HTML5 canvas.' +
            '</canvas>'
        ),

        // listeners to a model's changes
        initialize: function() {
            _.bindAll(this, 
               'render'
            );
            
            // FIXME: proper functions
            this.bind('Audiee:scroll', this.drawScale);
            this.bind('Audiee:zoomChange', this.drawScale);
            this.render();
        },

        // render function
        render: function() {
            var $el = $(this.el),
                width = $el.width(),
                height = $el.height();

            $el.html(this.template({width: width, height: height}));
            this.drawScale();
            return this;
        },

        drawScale: function() {
            var $el = $(this.el),
                ctx = $el.children('canvas')[0].getContext('2d'),
                width = $el.width(),
                height = $el.height(),
                offsetLeft = Audiee.Views.Editor.scrollLeftOffset(),
                frame = Audiee.Display.sec2px(1),
                i = offsetLeft % frame;

            ctx.clearRect(0, 0, width, height);
            for (; i < width; i += frame) {
                if (Math.floor(Audiee.Display.px2sec(i) % 5) === 0)
                    ctx.fillRect(i, 0, 1, height);
                else 
                   ctx.fillRect(i, 0, 1, height / 2);
            }
        }
    });
});