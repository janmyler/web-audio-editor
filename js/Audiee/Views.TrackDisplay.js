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
            _.bindAll(this, 
                'render', 
                'renderDisplay', 
                'renderCursor',
                'renderSelection',
                'cursor',
                'selection'
            );
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
            var $track = $(this.el).parent('.track'),
                $canvasArray = $(this.wrapperClass, this.el).children('canvas');
            
            Audiee.Views.Editor.setActiveTrack($track);

            if (!e.shiftKey) {
                var index = $canvasArray.index($(e.target)),
                    offset = e.offsetX + index * this.maxWidth,
                    position = offset % this.maxWidth;
                
                Audiee.Views.Editor.setSelectionFrom(Audiee.Display.px2sec(offset));
                this.renderCursor();
            } else { // shift key pressed – make an selection or edit the existing one
                // TODO: code here...

            }
        },

        renderCursor: function() {
            if (!Audiee.Views.Editor.isActiveTrack()) 
                return;

            var $track = Audiee.Views.Editor.getActiveTrack(),
                $canvasArray = $(this.wrapperClass, $track).children('canvas'),
                position = Audiee.Display.sec2px(Audiee.Views.Editor.getCursor()),
                index = Math.floor(position / this.maxWidth);

            // clear track-display (all tracks) 
            $(this.wrapperClass).children('canvas').each(function() {
                Audiee.Display.clearDisplay(this);
            });

            // draw the cursor
            Audiee.Display.drawCursor($canvasArray.eq(index)[0], position % this.maxWidth);
        },

        renderSelection: function() {
            var selectionFrom = Audiee.Display.sec2px(Audiee.Views.Editor.getCursor()),
                selectionTo = Audiee.Display.sec2px(Audiee.Views.Editor.getSelectionTo()),
                indexFrom = Math.floor(selectionFrom / this.maxWidth),
                indexTo = Math.floor(selectionTo / this.maxWidth),
                $tracks = $('.track'),
                that = this,
                from, len, tmp, $canvasArray;

            // if there is a selection (from != to), clear all TrackDisplays and render the selection
            if (selectionFrom !== selectionTo) {
                $(this.wrapperClass).children('canvas').each(function() {
                    Audiee.Display.clearDisplay(this);
                });

                var index1 = $tracks.index(Audiee.Views.Editor.getActiveTrack()),
                    index2 = index1;
                
                if (Audiee.Views.Editor.isMultiSelection()) {
                    index2 = $tracks.index(Audiee.Views.Editor.getMultiSelection());
                    if (index1 > index2) {  // swap indexes if needed
                        tmp = index1;
                        index1 = index2;
                        index2 = tmp;
                    }
                } 

                selectionTo %= this.maxWidth;   
                $tracks.slice(index1, ++index2).each(function() {
                    $canvasArray = $(this).find(that.wrapperClass).children('canvas');
                    from = selectionFrom % that.maxWidth;
                    len = (indexFrom !== indexTo) ? (that.maxWidth - from) : (selectionTo - from);
                    
                    for (var index = indexFrom; index <= indexTo; ++index) {
                        Audiee.Display.drawSelection($canvasArray.eq(index)[0], from, len);
                        from = 0;
                        len = (index != indexTo - 1) ? that.maxWidth : selectionTo;
                    } 
                });                
            }
        },    

        selection: function(e) {
            var $canvasArray = $(this.wrapperClass, this.el).children('canvas'),   // canvas array within a track display
                $track = $(e.target).parents('.track'),
                selectionTo = e.offsetX + $canvasArray.index($(e.target)) * this.maxWidth;   // total offset in the track display
                // selectionFrom, indexFrom, indexTo;

            // store the selectionTo value in the editor view 
            Audiee.Views.Editor.setSelectionTo(Audiee.Display.px2sec(selectionTo));

            if (Audiee.Views.Editor.getActiveTrack() !== $track) {
                Audiee.Views.Editor.setMultiSelection($track);
            }

            this.renderSelection();
                
           /* // selectionFrom and selectionTo could have been swapped
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
                for (; indexFrom <= indexTo; ++indexFrom) {
                    Audiee.Display.drawSelection($canvasArray.eq(indexFrom)[0], from, len);
                    from = 0;
                    len = (indexFrom != indexTo - 1) ? this.maxWidth : selectionTo;
                }
            }*/
            // multiline vyber - od tracku do tracku, jak je to na papirech, proste dle indexu kde byl na zacatku, a kde se pustil, to se nastavi a ulozi, aby to tam bylo...
        }
        
    });
});