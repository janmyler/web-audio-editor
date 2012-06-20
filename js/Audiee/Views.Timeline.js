/**
 * View a for timeline panel
 *
 * @file        Views.Timeline.js
 * @author      Jan Myler <honza.myler[at]gmail.com>
 * @copyright   Copyright 2012, Jan Myler (http://janmyler.com)
 * @license     MIT License (http://www.opensource.org/licenses/mit-license.php)
 *
 * Licensed under The MIT License
 * Redistributions of files must retain the above copyright notice.
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
                minFrame = 50,                                          // minimal distance between two time labels (px)
                intervals = Audiee.Display.getIntervals(minFrame),      // interval (sec) + division interval
                interval = Audiee.Display.sec2px(intervals.interval),   // main time labels interval (px)
                sub = interval / intervals.subdivision,                 // sub ticks interval (px)
                offsetLeft = Audiee.Views.Editor.scrollLeftOffset(),    // left scroll offset (px)
                timeLeft = Audiee.Display.px2sec(offsetLeft),
                i, t, min, sec, millisec;

            // prepare the context
            ctx.fillStyle = '#444';
            ctx.font="0.8em sans-serif";
            ctx.clearRect(0, 0, width, height);

            // draw only sub ticks first
            i = sub - (offsetLeft % sub);
            for (; i < width; i += sub) 
                ctx.fillRect(i, height, 1, -5);
            

            // let's draw time labels
            i = (offsetLeft > 0) ? interval - (offsetLeft % interval) : 0;
            timeLeft += Audiee.Display.px2sec(i);

            for (; i < width; i += interval) {
                min = Math.floor(timeLeft / 60);
                sec = Math.floor(timeLeft % 60);
                if (intervals.interval < 1) // count milliseconds
                    millisec = Math.round((timeLeft % 1) * 10) % 10;

                t = min + ':';
                t +=(sec < 10) ? '0' + sec : sec;
                if (intervals.interval < 1) 
                    t += ',' + millisec + '0';

                ctx.fillRect(i, height, 1, -12);
                ctx.fillText(t, i, 13);

                timeLeft += intervals.interval;
            }
        }
    });
});