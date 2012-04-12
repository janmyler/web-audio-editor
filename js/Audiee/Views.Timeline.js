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
            $(window).on('resize', this.render);
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
                minFrame = 50,      // min size of pixels
                frame = Audiee.Display.sec2px(1),
                i = offsetLeft % frame,
                sec = Audiee.Display.px2sec(offsetLeft),
                t = '';


            ctx.fillStyle = '#444';
            ctx.font="0.8em sans-serif";
            ctx.clearRect(0, 0, width, height);
            for (; i < width; i += frame) {
                if (sec % 60 < 10) {
                    t = '' + Math.floor(sec / 60) + ':' + '0' + Math.floor(sec % 60);
                } else {
                    t = '' + Math.floor(sec / 60) + ':' + Math.floor(sec % 60);
                }

                if (Math.floor(Audiee.Display.px2sec(i) % 5) === 0) {
                    ctx.fillRect(i, height, 1, -14);
                    ctx.fillText(t, i, 12);
                } else {
                   ctx.fillRect(i, height, 1, -6);
                }
                sec++;
            }
        }
    });
});