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
        wrapperName: 'display-wrapper',
        wrapperClass: '.display-wrapper',
        maxWidth: 20000,        // maximum canvas width

        template: _.template(
            '<canvas width="{{ width }}" height="{{ height }}">' +
                'Your browser does not support HTML5 canvas.' +
            '</canvas>'
        ),

        initialize: function() {
            _.bindAll(this, 'render', 'renderDisplay', 'cursor', 'selection');
            this.model.bind('Audiee:zoomChange', this.renderDisplay);  

            // register mouse events
            $(this.el)
                .on('mousedown', this.wrapperClass, this.cursor)
                .on('mouseup', this.wrapperClass, this.selection);

            this.render();
        },

        render: function() {
            // calculate width and height
            var $wrapperV = $('<div class="' + this.wrapperName + '">'),
                $el = $(this.el);

            $el.append($wrapperV);
            this.renderDisplay();          

            return this;
        },

        renderDisplay: function() {
            var width = Audiee.Display.sec2px(this.model.get('length')),
                maxWidth = this.maxWidth,
                height = 100,   
                $el = $(this.el),
                $wrapperV = $el.find(this.wrapperClass);

            // remove canvas elements without removing the event listeners
            $el.width(width);
            $wrapperV.children().detach();

            do {
                $wrapperV.append(this.template({
                    width: (width > maxWidth) ? maxWidth : width,
                    height: height
                }));

                width -= maxWidth;
            } while (width > 0);
        },

        cursor: function(e) {
            // set active class to the selected track
            $(this.el).parent('.track').addClass('active').siblings().removeClass('active');
            Audiee.Views.Editor.setActiveTrack(this);

            var $canvasArray = $(this.wrapperClass, this.el).children('canvas');

            // clear track-display (all tracks) 
            if (!e.shiftKey) {
                var index = $canvasArray.index($(e.target)),
                    offset = e.offsetX + index * this.maxWidth,
                    position = offset % this.maxWidth;
                
                console.log('offsetttt:', offset);

                Audiee.Views.Editor.setSelectionFrom(Audiee.Display.px2sec(offset));
                $(this.wrapperClass).children('canvas').each(function() {
                    Audiee.Display.clearDisplay(this);
                });

                // console.log(offset, '/', this.maxWidth, '=', offset/this.maxWidth);
                // canvas index 
                
                // console.log(index, $(this.wrapperClass, this.el).children('canvas').eq(index));

                Audiee.Display.drawCursor($canvasArray.eq(index)[0], position);
            }
            

            // Audiee.Display.drawCursor($(this.el).children('canvas')[0], e.offsetX);
        },


        /*startSelection: function(e) {
            console.log(e.offsetX);
            this.selectionFrom = Audiee.Display.px2sec(e.offsetX);
        },*/

        selection: function(e) {
            console.log(e);
            console.log(e.offsetX);
            // this.selectionTo = Audiee.Display.px2sec(e.offsetX);

            // if (this.selectionFrom !== this.selectionTo) {
            //     // clear track-display canvas (all the tracks)
            //     $('.track-display').children('canvas').each(function() {
            //         Audiee.Display.clearDisplay(this);
            // });
            //     Audiee.Display.drawSelection($(this.el).children('canvas')[0], this.selectionFrom, this.selectionTo);
            // }

        }
        
    });
});