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
        maxWidth: 500, //20000,        // maximum canvas width

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
                
                Audiee.Views.Editor.setSelectionFrom(Audiee.Display.px2sec(offset));
                $(this.wrapperClass).children('canvas').each(function() {
                    Audiee.Display.clearDisplay(this);
                });

                // console.log(offset, '/', this.maxWidth, '=', offset/this.maxWidth);
                // console.log(index, $(this.wrapperClass, this.el).children('canvas').eq(index));

                Audiee.Display.drawCursor($canvasArray.eq(index)[0], position);
            } else { // shift key pressed – make an selection or edit the existing one
                // TODO: code here...

            }
        },        

        selection: function(e) {
            var $canvasArray = $(this.wrapperClass, this.el).children('canvas'),   // canvas array within a track display
                $track = $(e.target).parents('.track'),
                selectionTo = e.offsetX + $canvasArray.index($(e.target)) * this.maxWidth,   // total offset in the track display
                selectionFrom, indexFrom, indexTo;

            // store the selectionTo value in the editor view 
            Audiee.Views.Editor.setSelectionTo(Audiee.Display.px2sec(selectionTo));
                
            // selectionFrom and selectionTo could have been swapped
            selectionFrom = Audiee.Display.sec2px(Audiee.Views.Editor.getCursor());
            selectionTo = Audiee.Display.sec2px(Audiee.Views.Editor.getSelectionTo());
            indexFrom = Math.floor(selectionFrom / this.maxWidth);
            indexTo = Math.floor(selectionTo / this.maxWidth);

            // if there is a selection (from != to), clear all TrackDisplays and render the selection
            if (selectionFrom !== selectionTo) {
                $(this.wrapperClass).children('canvas').each(function() {
                    Audiee.Display.clearDisplay(this);
                });
                
                selectionTo %= this.maxWidth;

                var from = selectionFrom % this.maxWidth,
                    len = (indexFrom !== indexTo) ? (this.maxWidth - from) : (selectionTo - from);
                    console.log('Selection is allowed initially from ', from, 'len ', len, 'on ', $canvasArray.eq(indexFrom)[0]);
                for (; indexFrom <= indexTo; ++indexFrom) {
                    console.log('ifrom:',indexFrom, 'ito:',indexTo);
                    Audiee.Display.drawSelection($canvasArray.eq(indexFrom)[0], from, len);
                    from = 0;
                    len = (indexFrom != indexTo - 1) ? this.maxWidth : selectionTo;
                    console.log('STO:', selectionTo, 'MAX:', this.maxWidth);

                    console.log(from, len, $canvasArray.eq(indexFrom+1)[0]);
                }
            }

            // console.log('selection to: ', $track, index, selectionFrom, selectionTo);

            // handle selection somehow ... think about the multiple canvases within TrackDisplay view
            
            /*do {

                if (length > this.maxWidth)
                    selectionTo = this.maxWidth - selectionFrom % this.maxWidth;
                else
                    selectionTo = length;



                Audiee.Display.drawSelection($canvasArray.eq(index)[0], );


                

            } while (length > 0);*/

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